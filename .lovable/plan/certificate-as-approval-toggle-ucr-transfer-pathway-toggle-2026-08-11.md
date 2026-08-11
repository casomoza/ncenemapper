# Certificate/AS approval toggle + UCR Transfer Pathway toggle

## What I found in the data

28 programs are dual (`A.S. Degree | Certificate of Achievement`). Their courses already carry
`satisfies` tags of the form:

```text
["CERT Construction Technology", "A.S. Construction Technology"]
```

Findings across all 28 dual programs:

- Every course tagged `CERT ...` is also tagged `A.S. ...` — there is **not a single** course tagged
  A.S.-only. So the tags don't currently mark AS-only additions.
- The remaining ~19 untagged courses per dual program are almost entirely GE placeholders
  (`RCCD GE 1A`, `CalGETC 1B`, ...), category `ge`. Certificates of Achievement don't require GE —
  these GE rows are exactly the AS-degree-only portion.
- A handful of dual programs also have **untagged `core` courses**, which is the ambiguous part
  (see question below).

## Proposed rule for certificate-only view

A course is part of the certificate track when:

1. its `category` is not `ge` (i.e. it is a core/elective course), **or**
2. it is explicitly tagged `CERT ...` in `satisfies`.

Everything else (the GE placeholder rows) is treated as AS-degree-only and hidden while the
approval toggle is off. No schema change or re-tagging needed — this reads cleanly off existing
data, and admins can still override per course later if we add an explicit flag.

## Question before I implement

Some dual programs have **core** courses with no `CERT` tag at all, e.g.:

- Early Childhood Education: `EAR-19` and the two `ECE-ELEC` slots are tagged CERT; `EAR-20`,
  `EAR-24`, `EAR-25`, `EAR-26`, `EAR-28`, `EAR-42`, `EAR-30` are untagged.
- Early Childhood Education: Intervention Assistant: only `EAR-19` is tagged CERT; the other 10
  core courses are untagged.
- Computer Programming: the four `ComProg-ELEC` slots are untagged.

Two readings:

- **(A) Treat untagged core courses as shared** — they show in the certificate view. This is what
  the proposed rule above does, and it is safe (nothing is wrongly hidden), but for ECE Intervention
  Assistant the "certificate" view would show nearly the whole program.
- **(B) Treat untagged core courses as AS-only** — they get hidden. This would strip those programs
  down to 1–3 courses, which looks wrong.

I'll go with **(A)** unless you tell me otherwise. If some of those core courses really are
AS-degree-only, tell me which programs/courses and I'll tag them (or I can add an explicit
`AS ONLY` tag admins can set per course from the program editor).

## Implementation

**Settings** (`src/lib/settings.ts`)
- Keep `show_associate_maps`, repurposed as "AS degree content approved".
- Add `show_ucr_transfer_maps` key (default off).
- Add helpers: `isUcrTransferProgram(cluster)`, `isCertificateProgram(degreeType)`,
  `isDualProgram(degreeType)`, `certificateOnlyCourses(courses)`.

**Homepage** (`src/routes/index.tsx`)
- UCR cluster programs are filtered solely by `show_ucr_transfer_maps` — never by the AS toggle.
- Non-UCR: AS-only programs hidden when AS toggle off; dual and certificate programs always shown.
- Dual program cards show certificate-only unit totals and a certificate-only degree label while
  the AS toggle is off.

**Program page** (`src/routes/programs.$programId.tsx`)
- UCR program + its toggle off → "not yet available" page.
- AS-only program + AS toggle off → "not yet available" (unchanged).
- Dual program + AS toggle off → render normally but with the course list filtered to the
  certificate track, `degreeType` displayed as "Certificate of Achievement", unit totals recomputed,
  GE requirement sections hidden, and the same filtering applied to the PDF export.

**Admin** (`src/routes/admin.index.tsx`)
- Relabel the first switch to "Show A.S. Degree content to public (approved)" with helper text
  explaining dual programs fall back to certificate-only when off.
- Add a second, clearly separated switch: "Show UCR Transfer Pathway Maps to Public".

## Verification

Full production build, browser test on localhost against both toggles in both states, publish, then
re-check the live published URL.
