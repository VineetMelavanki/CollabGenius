### Repo summary

This repository contains two main areas:

- backend/: an Express + Mongoose REST API (work-in-progress). Key files: `backend/index.js`, `backend/routes/*`, `backend/controllers/*`, `backend/model/*`, `backend/package.json`.
- finetune/: small ML tooling for local experiments using `unsloth`, `transformers`, and `torch`. Key files: `finetune/scripts/train_unsloth.py`, `finetune/data/*.jsonl`, `finetune/requirements.txt`.

Keep changes minimal and focused: this project is early-stage and contains many small issues (typos, incorrect imports, inconsistent names). Prefer conservative edits and add tests or lint fixes as separate PRs.

### Architecture & data flow (high level)

- backend: Express app exposes JSON APIs under `/api/User` and `/api/Team` (see `backend/index.js`, `backend/routes/*`). Controllers perform validation and CRUD via Mongoose models in `backend/model/*`. Authentication is not implemented — controllers currently assume requests contain user identifiers.
- finetune: Scripts load JSONL datasets from `finetune/data/` and call `unsloth`-style training APIs to fine-tune models into `finetune/models/`.

### Developer workflows & commands

- Backend
  - Install: run `npm install` from `backend/`.
  - Start (dev): project has no start script — run node directly. Example (PowerShell):
    - cd backend; node index.js
  - Tests: no automated tests present.

- Finetune
  - Create a Python venv, install requirements in `finetune/requirements.txt`.
  - Example (PowerShell):
    - cd finetune; python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt
  - Run a quick smoke run of the training script: `python scripts/train_unsloth.py` (the script already includes tiny health-checks).

### Project-specific conventions & gotchas

- Naming and typos: expect inconsistent names and typos. Examples found:
  - `backend/index.js` imports `express` as `exoress` and doesn't call `app.listen()`.
  - `backend/model/User.js` uses `Email`/`Password` as types and registers model as `UserSChema` — these are invalid. Prefer repairing schemas to use `String` and consistent model naming.
  - `backend/controllers/User.js` contains duplicate `User` imports, inconsistent function variable names, and mismatched casing (`findone` vs `findOne`).
  - `backend/routes/Team.js` has an extra space in route path `"/allteams "` that will break matching.

- Small change policy: when fixing these, prefer isolated commits that only correct syntax/typos and add a short comment explaining why (to keep PR review focused).

### Integration points & external dependencies

- Backend depends on `mongoose`, `express`, `bcrypt`, and `ollama` (see `backend/package.json`). Configure MongoDB separately; no connection string or `.env` provided.
- Finetune depends on `unsloth`, `transformers`, `torch` and related ML libs. The training scripts assume local GPU availability is optional — use CPU-friendly parameters when testing.

### Useful file references / examples

- Fixing Express entrypoint: `backend/index.js` should import `express` correctly, wire `app.use(express.json())`, and call `app.listen(port)`.
- Mongoose schema examples to follow: `backend/model/Team.js` demonstrates using ObjectId refs and Map fields (roles). Use `String` for simple fields.
- Controller examples: `backend/controllers/Team.js` shows how team creation and role map setup are expected to work — keep business logic there and return consistent HTTP codes.

### What to avoid / not implemented

- Don't assume environment variables or DB connection strings exist. The current code lacks a `config`/`.env` loader — add it only when adding integration tests.
- Avoid large refactors across backend and finetune in the same PR. Separate API fixes from ML experiments.

### Ask for feedback

If anything in these instructions is unclear or you'd like me to expand a section (for example: add a ready-to-run `backend/start` script, or produce a corrected `User` schema and quick unit tests), say which area and I'll prepare a follow-up edit.
