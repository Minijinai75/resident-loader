# Decisions

## 2026-08-14 - Dedicated extension repository

- Status: confirmed by Mini
- Decision: Resident Loader lives in `Minijinai75/resident-loader`, separate from `tavern-pet-workshop`.
- Why: SillyTavern can install and update a third-party extension directly from a Git repository URL only when the repository itself is the extension root.
- Packaging: root `manifest.json`; prebuilt `dist/index.js` and `dist/style.css` are committed; source and tests remain in the same repository.
- Website role: Tavern Pet Workshop creates data-only packs and exposes the Loader repository URL plus an offline release fallback.

## Preserved exception - no license selected

- The public repository has no license until Mini explicitly chooses one.
