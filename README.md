# SNS Workspace

Next.js app that will replace the single-page HTML dashboard at
`ymi-flowing/sns-daily-report`.

**Status:** Phase 1 scaffold. The real portfolio dashboard arrives in
Phase 2.

## What it does (end state)

- `/` — portfolio report (parity with the current HTML dashboard)
- `/property/[abbr]` — single-property deep dive (KPIs, units,
  applicants, expiring, work orders)
- `/region/[name]` — regional roll-up (Tampa / Orlando /
  Jacksonville / Ft. Lauderdale)
- `/_showcase` — the SNS UI kit demo (reference only)

## Where its data comes from

During the parallel-migration window:

1. The Python pipeline in `ymi-flowing/sns-daily-report` runs on its
   existing 4-hour schedule and emits `data.json` to its own repo on
   every refresh.
2. This app reads that `data.json` via GitHub's raw URL with Next.js
   ISR (`fetch(..., { next: { revalidate: 60 } })`).

Once parity + staff adoption is verified, pages migrate to live-fetch
from ResMan directly and the Python pipeline retires.

## Local dev

```bash
npm install
npm run dev
# http://localhost:3000 (or next free port)
```

## UI kit

Everything under `components/` is the SNS-branded fork of the shared
UI Templates kit. Scoped under `.ui-scope`. Steel-blue primary + slate
greys. Dark + light mode via `data-theme` on the scope element.

See `C:\Users\ymosh\Claude\UI Templates\SNS\README.md` for the full
component catalog.
