
# Contributing to VirtualizorJS

Thanks for wanting to contribute! This project uses Bun as the primary developer/runtime environment and includes scripts and tools defined in `package.json`. This document explains how to set up a development environment, run tests and linters, and submit a PR.

Quick checklist
1. Meet the requirement: Bun >= 1.3.0 (see "Requirements").
2. Clone your fork and install dependencies with Bun.
3. Run `bun run prepare` to install Git hooks (Husky).
4. Run tests and linters locally (commands below).
5. Open a concise PR with a clear description and tests if applicable.

Table of contents
- Requirements
- Getting started (PowerShell)
- Useful scripts
- Commit hooks and commitlint
- Pull request workflow
- Code of Conduct & License

Requirements
- Bun >= 1.3.0 is required for installing and running scripts (this project contains a `bun.lock`). If you don't have Bun installed, follow the instructions at https://bun.sh/.

Getting started (PowerShell)

Clone your fork and install dependencies using Bun. Example PowerShell commands:

```powershell
# clone your fork
git clone https://github.com/<your-username>/virtualizorjs.git
cd virtualizorjs

# install dependencies (uses bun.lock)
bun install

# install git hooks (runs the `prepare` script which installs husky)
bun run prepare
```

Notes:
- If you cannot use Bun, `npm install` / `npm run <script>` may work for some workflows, but Bun is the recommended and tested environment for this repository.

Useful scripts
The following scripts are defined in `package.json`. Use `bun run <script>` (preferred) or `npm run <script>` as an alternative.

- Build

```powershell
# build the project
bun run build
```

- Development (watch)

```powershell
# start tsup in watch mode
bun run dev
```

- Tests

```powershell
# run tests once
bun run test

# run tests in watch mode
bun run test:watch

# run tests and produce coverage
bun run coverage
```

- Type checking

```powershell
bun run typecheck
```

- Linting & formatting (Biomes)

```powershell
# check for lint issues
bun run lint

# fix lint issues (where supported)
bun run lint:fix

# format code
bun run format
```

- Release / publishing helpers

```powershell
# build and create a release bump (uses `bumpp`)
bun run release

# check package exports
bun run check-exports

# prepublish hook (runs build + typecheck)
bun run prepublishOnly
```

Other notes about scripts:
- `build` uses `tsup` to produce dist files (ESM + CJS types).  
- `typecheck` runs `tsc --noEmit` to validate TypeScript types.  

Commit hooks and commitlint
- This repository uses `husky` to install Git commit hooks. The `prepare` script in `package.json` runs husky installation; run `bun run prepare` after installing dependencies.
- Commit messages are validated by `@commitlint/config-conventional` via Husky. If your commit is rejected by commitlint, fix the commit message.


- To run commitlint manually you can run the CLI from node/NPM (for example):

```powershell
# using npx as a fallback (if you don't have bunx)
npx --yes @commitlint/cli --config ./commitlint.config.js --from HEAD~1 --to HEAD
```

If you prefer to inspect or run hooks locally, check the `.husky/` directory in the repository.

Pull request workflow
1. Create a feature branch off `main` (e.g. `git checkout -b feat/my-change`).
2. Implement your changes and ensure tests pass and linting is clean.
3. Commit logically and write conventional commit messages (the project uses conventional commit rules for automatic changelog/version bumping).
4. Push the branch to your fork and open a Pull Request against `main` in the upstream repository.
5. The maintainers will review the PR and may request changes — please respond to review comments and update the PR.

Troubleshooting & tips
- If you run into environment-specific issues, ensure Bun is up-to-date and the `bun.lock` is present.
- Use `git status` / `git diff` before committing to keep commits small and focused.
- When editing types or public APIs, add or update tests in `tests/`.

Code of Conduct & License
Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions. By contributing you agree to license your contributions under the project's MIT License (see `LICENSE`).

Thank you for contributing to VirtualizorJS!
