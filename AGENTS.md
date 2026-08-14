## Project Working Rules

- Treat this as a continuity-sensitive SillyTavern extension.
- Read `PROJECT_STATUS.md`, `DECISIONS.md`, and the latest `TASK_LOG.md` entry before substantial work.
- Use test-driven development for behavior-bearing TypeScript.
- Keep imported `.jrpack.zip` files data-only; never execute character-pack JavaScript.
- Never add an API-key form. Use SillyTavern's current API or existing Connection Profiles.
- Keep user images, prompts, bindings, settings, and generated history browser-local.
- Commit the generated `dist/` files: SillyTavern installs this repository without running a build.

## Continuity Gate

Before handoff, update `PROJECT_STATUS.md`, `TASK_LOG.md`, `DECISIONS.md` when needed, and `VERIFY.md` with commands actually run.
