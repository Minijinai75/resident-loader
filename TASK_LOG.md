# Task Log

## 2026-08-14 20:16

- Objective: Split Resident Loader from Tavern Pet Workshop into a directly installable GitHub repository.
- RED: `repository-layout.node.mjs` failed first because root `manifest.json`, then prebuilt `dist/index.js`, did not exist.
- Migration: Copied the Loader runtime and six Loader test suites from the website repository; source hashes matched before cleanup.
- Implementation: Added root manifest v0.1.1, direct-install README, independent TypeScript/Vite build, deterministic ZIP packaging, GitHub CI, and committed-dist contract.
- Verification so far: Loader build passed; direct-install topology test passed; 6 files / 30 behavior tests passed.
- Next: package, validate, commit/push, release v0.1.1, update the website, and perform public checks.
