# Architecture rules

- Both pathway and rotation PDFs must load and draw the Norco logo through `loadNorcoLogo` and `addNorcoLogo` in the shared pathway PDF module, so image proportions are preserved consistently.
- School rotation report master views use the same `buildMasterList` result, so deduplication and merged offerings remain consistent across views.