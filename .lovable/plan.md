# Unified pathway print and PDF

## What will change
- Replace the separate raw-page print and PDF buttons with one **Print / Download Pathway** control.
- Keep the existing PDF choices, then provide **Download PDF** and **Print PDF** actions that use the exact same generated document.
- Remove the old browser print action so site navigation, controls, and interactive map styling are never printed.

## Combined document
- Create a branded, landscape letter-size PDF with the Norco College logo, program name, degree type, cluster, unit totals, description, counselor notice, selected filters, and current summary details.
- Present the current personalized pathway by year and term in a compact print grid, including selected GE/elective courses and local drag-and-drop placements.
- Include useful labels for Core, Elective/GE, Dual Enroll, Flexible term availability, prerequisites, requirement sections, and optional courses as plain print text.
- Preserve completion checkboxes and all existing PDF options for summary, requirement sections, term grouping, and GE visibility.
- Add page numbers and a concise advisory footer; automatically continue cleanly to a second page rather than splitting headings or rows awkwardly.

## Technical details
- Extract PDF assembly into a focused helper so download and print share one source of truth.
- Load the bundled Norco logo into the PDF without external requests.
- Keep the current filtered program state and certificate-only visibility rules intact.
- For Print PDF, open the generated PDF in a new tab and invoke the browser print dialog from that document.

## Verification and release
- Generate a sample from a long, multi-year program and visually inspect every rendered PDF page for clipping, overlap, and readability; tune spacing and type size to stay within 1–2 pages.
- Verify both download and print actions on localhost, including selected filters, choices, and personalized term placement.
- Run the production build, publish, and repeat the core PDF check on the live site.
