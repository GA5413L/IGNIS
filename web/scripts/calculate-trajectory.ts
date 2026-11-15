/** Local calculation only. Does not persist input, call a provider or read research-source PDFs. */
import { readFileSync, statSync } from 'node:fs';
import { calculateTrajectory, MAX_TRAJECTORY_BYTES, trajectoryExample } from '../src/core/trajectory';
try {
  const args = process.argv.slice(2);
  let input: unknown;
  if (args.length === 1 && args[0] === '--example') input = trajectoryExample();
  else if (args.length === 2 && args[0] === '--input') {
    if (statSync(args[1]).size > MAX_TRAJECTORY_BYTES) throw new Error('Input exceeds byte limit');
    const bytes = readFileSync(args[1]);
    if (bytes.byteLength > MAX_TRAJECTORY_BYTES) throw new Error('Input exceeds byte limit');
    input = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } else throw new Error('Use --example or --input request.json');
  process.stdout.write(JSON.stringify(calculateTrajectory(input), null, 2) + '\n');
} catch (error) {
  process.stderr.write(`Trajectory calculation failed: ${error instanceof Error ? error.name : 'unknown error'}. Check the schema, exact units, time order and file size.\n`);
  process.exitCode = 2;
}
