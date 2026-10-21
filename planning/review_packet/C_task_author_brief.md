# Activity C: writing held-out evaluation questions (≈ 45 min)

**This sheet is self-contained.** You need only this sheet and the two documents below. Please don't open the project repository, its notes, its existing test questions or its answer keys, before or while you write. If you have seen them, say so in the return block: your questions are then not held-out, and that is fine to report.

## What this is for
A small team is preparing a research tool for published microgravity fire-safety data.
- Later, the tool will be tested against an ordinary spreadsheet holding the same records.
- The test needs questions that the tool's builders have **never seen**. You write them now. They stay sealed until that test.
- The builders, and any AI assistant they use, won't see them. **Please don't use an AI assistant to write or improve them.**

## The two documents
| Document | Where to get it |
|---|---|
| Link et al. 2018, "The Effect of Gravity on Flame Spread over PMMA Cylinders", *Scientific Reports* 8:120, **with its Supplementary Information** (Tables S1 and S2) | https://doi.org/10.1038/s41598-017-18398-4 (the supplement is linked from the article page) |
| NASA/TM-20210011385, *BASS–II Summary Report* (2021), especially Table A.3 (PDF pp.114–115) and Chapter 4 | https://ntrs.nasa.gov/citations/20210011385 |

## What to write
Write **at least four** questions that a fire-safety researcher might really ask of these documents about PMMA rods, together with your own answer key for each. Across your set, include at least:
1. **one derived, multi-record question:** a minimum, a ranking or a comparison across several tests, or across gravity levels;
2. **one** with a clear numeric answer;
3. **one** where the two documents disagree, or where information in one document changes how a record in the other should be read;
4. **one** that should be answered "not supported by these sources" or declined;
5. **one** plain lookup or filter task, where a spreadsheet ought to do well.

One question may cover more than one item.

## For each question, write a key containing
- the **answer as substantive points**, in plain words; for each point, say whether it is **required** or **optional**;
- **every source location** used (document, page, table, row or column);
- what an **overclaim** would look like (an answer that says more than the sources support);
- what **cannot** be determined from these sources.

## Seal it
1. Save the questions and keys as **one file outside the project folder**, e.g. on your own computer. Keep a backup.
2. Compute its SHA-256:
   - Windows PowerShell: `Get-FileHash <file>`
   - macOS/Linux: `shasum -a 256 <file>`
3. Send the team **only** the return block below. Don't send the file itself or describe the questions.
4. Keep the file unchanged until the team asks for it at the evaluation, after its rules are frozen. If you change it, the hash changes. Report the new hash and say why.

## Return block (copy, fill in, send)
```
Held-out task file
- Author (name or initials):
- Relevant background (one line):
- Date sealed (YYYY-MM-DD):
- SHA-256:
- Number of questions:
- Had you seen any IGNIS notes, test questions or answer keys before writing? (no / yes: which)
- Did you use any AI assistant while writing? (no / yes: how)
```
