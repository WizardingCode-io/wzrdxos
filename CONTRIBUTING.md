# Contributing to wzrdxOS

Thanks for your interest. wzrdxOS is open-source (MIT) and built in the open.

## Principles

wzrdxOS has a strong opinion about *how* it is built. Before contributing, read
[`docs/roadmap.md`](docs/roadmap.md) and the design principles in the README. The
short version:

1. **Native first, custom only where it pays.** Don't reinvent orchestration —
   lean on Claude Code primitives.
2. **Opt-in flow, no blocking enforcement.** Never add hooks that stall the user.
3. **Curated, not accumulated.** A new skill must earn its place in the taxonomy.
4. **Few, strong agents.**

## Development setup

```bash
corepack enable          # ensures pnpm 10
pnpm install
pnpm build
```

For the Python KB service:

```bash
cd services/kb
uv sync
uv run wzrdx-kb --help
```

## Commit convention

We use [Conventional Commits](https://www.conventionalcommits.org/), enforced by
commitlint. Allowed scopes: `core`, `kb`, `skills`, `agents`, `workflows`,
`docs`, `ci`, `repo`.

```
feat(core): add skill registry loader
fix(kb): handle empty transcript on ingestion
docs(roadmap): clarify M2 scope
```

## Pull requests

- Keep PRs focused on a single milestone item.
- `pnpm typecheck && pnpm build` must pass.
- New formats/conventions go in `docs/formats.md`.
