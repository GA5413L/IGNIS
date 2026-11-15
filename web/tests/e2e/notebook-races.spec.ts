import { expect, test, type Page } from '@playwright/test';

async function openNotebook(page: Page) {
  await page.goto('/');
  await page.locator('.notebook-toggle > summary').click();
}
async function savePacket(page: Page, question: string) {
  await page.getByRole('textbox', { name: 'Question', exact: true }).fill(question);
  await page.getByRole('button', { name: 'Save in this browser', exact: true }).click();
  return await page.evaluate(() => localStorage.getItem('ignis-research-session-v1')!);
}
async function importPacket(page: Page, name: string, content: string) {
  await page.getByLabel('Session JSON file').setInputFiles({ name, mimeType: 'application/json', buffer: Buffer.from(content) });
}
async function rechecked(page: Page) {
  await expect(page.getByText('Recheck complete. Review the comparison before loading.', { exact: true })).toBeVisible();
}
async function settle(page: Page) {
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}

test.beforeEach(async ({ context }) => {
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (!['127.0.0.1', 'localhost'].includes(url.hostname) || url.pathname === '/api/interpret') return route.abort();
    return route.continue();
  });
});

test('an oversized replacement clears an older recheck without replacing the current draft', async ({ page }) => {
  await openNotebook(page);
  const saved = await savePacket(page, 'Notebook A');
  await page.getByRole('textbox', { name: 'Question', exact: true }).fill('Keep current draft C');
  await importPacket(page, 'a.json', saved); await rechecked(page);
  await page.getByLabel('Session JSON file').setInputFiles({ name: 'oversized-b.json', mimeType: 'application/json', buffer: Buffer.alloc(2 * 1024 * 1024 + 1, 32) });
  await expect(page.getByText('Nothing loaded: session exceeds 2 MiB.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Load rechecked workspace', exact: true })).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'Question', exact: true })).toHaveValue('Keep current draft C');
  await expect(page.getByRole('button', { name: 'Import session', exact: true })).toBeEnabled();
});

test('an older delayed file read cannot replace the latest selected notebook', async ({ page }) => {
  await openNotebook(page);
  const a = await savePacket(page, 'Notebook A'), b = await savePacket(page, 'Notebook B');
  await page.evaluate(() => {
    const scope = window as unknown as { releaseNotebookRead: () => void; notebookReadFinished: boolean };
    const read = File.prototype.text;
    File.prototype.text = async function () {
      if (this.name !== 'slow-a.json') return read.call(this);
      await new Promise<void>((resolve) => { scope.releaseNotebookRead = resolve; });
      const text = await read.call(this); scope.notebookReadFinished = true; return text;
    };
  });
  const sentQuestions: string[] = [];
  page.on('request', (request) => {
    if (request.url().endsWith('/api/session')) sentQuestions.push(JSON.parse(request.postData()!).draft.question);
  });
  await importPacket(page, 'slow-a.json', a);
  await expect(page.getByRole('button', { name: 'Import session', exact: true })).toBeDisabled();
  // A second change event also covers an already-open/native file picker finishing after the first intent.
  await importPacket(page, 'newer-b.json', b); await rechecked(page);
  await page.evaluate(() => (window as unknown as { releaseNotebookRead: () => void }).releaseNotebookRead());
  await page.waitForFunction(() => (window as unknown as { notebookReadFinished: boolean }).notebookReadFinished);
  await settle(page);
  await page.getByRole('button', { name: 'Load rechecked workspace', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Question', exact: true })).toHaveValue('Notebook B');
  expect(sentQuestions).toEqual(['Notebook B']);
});

test('a late older recheck response cannot reopen a report after the newer notebook was loaded', async ({ page }) => {
  await openNotebook(page);
  const a = await savePacket(page, 'Notebook A'), b = await savePacket(page, 'Notebook B');
  let release!: () => void, observed!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const intercepted = new Promise<void>((resolve) => { observed = resolve; });
  await page.route('**/api/session', async (route) => {
    const response = await route.fetch();
    if (JSON.parse(route.request().postData()!).draft.question === 'Notebook A') { observed(); await gate; }
    await route.fulfill({ response });
  });
  try {
    await importPacket(page, 'a.json', a); await intercepted;
    await importPacket(page, 'newer-b.json', b); await rechecked(page);
    await page.getByRole('button', { name: 'Load rechecked workspace', exact: true }).click();
    const late = page.waitForResponse((response) => response.url().endsWith('/api/session') && JSON.parse(response.request().postData()!).draft.question === 'Notebook A');
    release(); await late; await settle(page);
    await expect(page.getByRole('textbox', { name: 'Question', exact: true })).toHaveValue('Notebook B');
    await expect(page.getByRole('button', { name: 'Load rechecked workspace', exact: true })).toHaveCount(0);
    await expect(page.getByText('Rechecked workspace loaded.', { exact: true })).toBeVisible();
  } finally { release(); }
});

test('stale interpretation completion cannot re-enable a newer pending assessment', async ({ page }) => {
  await page.goto('/');
  let releaseInterpret!: () => void, sawInterpret!: () => void, releaseAssess!: () => void, sawAssess!: () => void;
  const interpretGate = new Promise<void>((resolve) => { releaseInterpret = resolve; });
  const interpretSeen = new Promise<void>((resolve) => { sawInterpret = resolve; });
  const assessGate = new Promise<void>((resolve) => { releaseAssess = resolve; });
  const assessSeen = new Promise<void>((resolve) => { sawAssess = resolve; });
  // Fulfilled locally: this never reaches the interpretation endpoint or a provider.
  await page.route('**/api/interpret', async (route) => {
    sawInterpret(); await interpretGate;
    await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ message: 'Mock unavailable; no provider called.' }) });
  });
  await page.route('**/api/assess', async (route) => { const response = await route.fetch(); sawAssess(); await assessGate; await route.fulfill({ response }); });
  try {
    await page.getByRole('textbox', { name: 'Question', exact: true }).fill('Old interpretation A');
    await page.getByRole('button', { name: 'Interpret with AI', exact: true }).click(); await interpretSeen;
    await page.getByRole('textbox', { name: 'Question', exact: true }).fill('New assessment B');
    await page.getByRole('button', { name: 'Confirm and assess', exact: true }).click(); await assessSeen;
    const late = page.waitForResponse('**/api/interpret'); releaseInterpret(); await late; await settle(page);
    await expect(page.getByRole('button', { name: /^Assessing/ })).toBeDisabled();
    await expect(page.getByText('Your question changed while it was being interpreted; the old reply was discarded.', { exact: true })).toHaveCount(0);
    releaseAssess();
    await expect(page.getByRole('heading', { name: 'Research brief', exact: true })).toBeVisible();
  } finally { releaseInterpret(); releaseAssess(); }
});

test('an old interpretation network failure cannot overwrite a loaded notebook status', async ({ page }) => {
  await openNotebook(page);
  const saved = await savePacket(page, 'Restored notebook B');
  let release!: () => void, observed!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const intercepted = new Promise<void>((resolve) => { observed = resolve; });
  await page.route('**/api/interpret', async (route) => { observed(); await gate; await route.abort('failed'); });
  try {
    await page.getByRole('textbox', { name: 'Question', exact: true }).fill('Old interpretation A');
    await page.getByRole('button', { name: 'Interpret with AI', exact: true }).click(); await intercepted;
    await importPacket(page, 'restored.json', saved); await rechecked(page);
    await page.getByRole('button', { name: 'Load rechecked workspace', exact: true }).click();
    const failed = page.waitForEvent('requestfailed', (request) => request.url().endsWith('/api/interpret'));
    release(); await failed; await settle(page);
    await expect(page.getByRole('textbox', { name: 'Question', exact: true })).toHaveValue('Restored notebook B');
    await expect(page.getByText('The saved recipes were recomputed. Review the restored draft before confirming another assessment.', { exact: true })).toBeVisible();
    await expect(page.getByText('Network error; your question is kept.', { exact: true })).toHaveCount(0);
  } finally { release(); }
});

test('revision witnesses expose changed qualifications through keyboard expansion', async ({ page }) => {
  // UI-only fixture: identical compact outcome, different full qualifications. No source record is edited.
  const before = 'Source finding: Synthetic UI fixture.\nQualifications: earlier restriction.';
  const after = 'Source finding: Synthetic UI fixture.\nQualifications: additional restriction requires review.';
  await page.route('**/api/assess', async (route) => {
    const response = await route.fetch(), body = await response.json();
    body.parentAssessmentId = 'ASMT-UI-FIXTURE';
    body.revisionDifference = {
      operation: 'reviewed_assertion_change', changedFields: ['qualifications'], affectedClaimIds: [],
      unchangedClaimIds: [], addedClaimIds: [], removedClaimIds: [], note: 'Synthetic rendering fixture, not new scientific evidence.',
      witnesses: [{ premise: 'Qualification wording changed', assumption: 'Changed scientific fields: qualifications.',
        affectedRef: { id: 'AUDIT-QUALIFICATION-WITNESS', revision: 'r1' }, previousConclusion: before, newConclusion: after }],
    };
    await route.fulfill({ response, body: JSON.stringify(body) });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Confirm and assess', exact: true }).click();
  const panel = page.getByRole('heading', { name: 'What changed', exact: true }).locator('..');
  await expect(panel.getByText(after, { exact: true })).toBeHidden();
  const summary = panel.locator('summary'); await summary.focus(); await summary.press('Enter');
  await expect(panel.getByText(before, { exact: true })).toBeVisible();
  await expect(panel.getByText(after, { exact: true })).toBeVisible();
});
