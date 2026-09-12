# Progress Backup Schema & Future Backend Design

This document specifies (1) the JSON schema used by the in-app **Backup / Restore**
tool (client-side only, ships today) and (2) a lightweight database schema and
REST API that a future authenticated backend could implement to replace
localStorage as the source of truth, accepting/returning the *same* JSON
shape so the migration is additive, not a rewrite.

## 1. Why this exists

Today all progress (`completed` day numbers, Pomodoro history, AI grader
endpoint/model) lives only in the browser's `localStorage`. That's zero-setup
and works offline, but it means: clearing site data destroys progress,
switching browsers/devices starts from zero, and there is no way to view or
edit progress outside the app. The export/import tool is a stopgap that lets
a user manually snapshot and restore that state; the REST design below is the
real fix once an authenticated backend exists.

## 2. Backup file schema (`schemaVersion: 1`)

```jsonc
{
  "schemaVersion": 1,
  "app": "ielts-roadmap",
  "exportedAt": "2026-09-12T14:03:00.000Z",   // ISO 8601, informational only
  "data": {
    "completedDays": [1, 2, 3, 5, 8],          // required, array of integers, each 1-180
    "pomodoro": {                                // optional, object keyed by JS Date#toDateString()
      "Fri Sep 12 2026": 3,
      "Sat Sep 13 2026": 1
    },
    "aiGrader": {                                // optional, non-secret fields only
      "endpoint": "https://api.openai.com/v1/chat/completions",
      "model": "gpt-4o-mini"
      // apiKey is deliberately NEVER included in an export file — a backup
      // is meant to be portable (copied, emailed, stored in a drive folder);
      // shipping a live API key inside it would turn every backup into a
      // credential leak. Restoring a backup keeps whatever key is already
      // saved on the destination device/browser untouched.
    }
  }
}
```

### Validation rules (enforced by `validateBackupPayload()` in `app.js`)

- `schemaVersion` must equal `1` (a future bump would add a migration step,
  not silently accept unknown versions).
- `data` must be a plain object.
- `data.completedDays` must be an array of integers, each `1 <= n <= 180`.
- `data.pomodoro`, if present, must be a plain object (not an array).
- `data.aiGrader`, if present, must be a plain object.
- Anything failing validation is rejected with a specific, user-visible
  reason and **nothing is written** — a bad file can't half-apply.

### Restore semantics

Restoring **replaces** `completedDays` entirely (with a confirmation dialog
showing the before/after count so the user can't do this by accident), but
**merges** `pomodoro` entries per-date and only **fills gaps** in `aiGrader`
(an already-configured endpoint/model on the destination is preserved unless
the backup explicitly overrides it). The API key already stored locally is
never touched by an import.

## 3. Future backend: lightweight DB schema

Two tables/collections are enough — this intentionally does not try to model
the full 180-day curriculum server-side; the roadmap content itself stays
static and ships with the client, exactly as it does today.

```sql
-- One row per registered user (however auth is implemented — email/password,
-- OAuth, magic link; out of scope here).
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per user (1:1) — deliberately NOT one-row-per-day, since the
-- client already has the full 180-day structure; the server only needs to
-- persist the same three fields the local backup file has today.
CREATE TABLE progress (
  user_id         UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  completed_days  INTEGER[] NOT NULL DEFAULT '{}',   -- validated 1-180 server-side too
  pomodoro        JSONB NOT NULL DEFAULT '{}',       -- { "<dateString>": <count> }
  ai_endpoint     TEXT,
  ai_model        TEXT,
  -- ai_api_key is intentionally NOT a column: the AI grader key stays
  -- client-side/browser-only even after a backend exists, since it's the
  -- user's own third-party credential, not this app's to custody.
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  schema_version  SMALLINT NOT NULL DEFAULT 1
);
```

A document-database equivalent (e.g. Firestore/Mongo) is the same shape:
one `users/{uid}` document holding `{completedDays, pomodoro, aiEndpoint,
aiModel, updatedAt, schemaVersion}` — which is in fact almost exactly the
`db` capability already wired up for real-time sync in this app today; this
table is the SQL analogue for a team that wants a conventional REST+Postgres
stack instead.

## 4. Future backend: REST interface

All endpoints require an `Authorization: Bearer <token>` header (session
token / JWT — whatever the auth system issues) except where noted. Request
and response bodies reuse the **same `data` shape** as the local backup file,
so the client-side export/import code and the future sync code share one
validator and one mental model.

| Method & Path                | Purpose                                                                 |
|-------------------------------|--------------------------------------------------------------------------|
| `GET /api/v1/progress`        | Fetch the signed-in user's current progress. Returns `{schemaVersion, data}` (same shape as a backup file, minus `app`/`exportedAt`). 404 if the user has never synced. |
| `PUT /api/v1/progress`        | Replace the user's progress wholesale. Body: `{schemaVersion, data}`. Same validation rules as `validateBackupPayload()`. Returns the stored document with a server `updatedAt`. |
| `PATCH /api/v1/progress`      | Partial update — e.g. `{"data": {"completedDays": [1,2,3]}}` to update just one field without resending everything (used by the "mark day complete" checkbox, which fires far more often than a full export). |
| `POST /api/v1/progress/import`| Upload a backup file's contents for server-side validation + merge, returning the same `{ok, errors}` shape the client-side validator produces, so error messages are consistent whichever side validates. |
| `GET /api/v1/progress/export` | Returns a full backup-file-shaped JSON document (`schemaVersion`, `app`, `exportedAt`, `data`) — i.e. the server can hand back exactly the same file format the client already knows how to produce and consume. |

### Example: `GET /api/v1/progress` response

```json
{
  "schemaVersion": 1,
  "data": {
    "completedDays": [1, 2, 3, 5, 8],
    "pomodoro": { "Fri Sep 12 2026": 3 },
    "aiGrader": { "endpoint": "https://api.openai.com/v1/chat/completions", "model": "gpt-4o-mini" }
  },
  "updatedAt": "2026-09-12T14:03:00.000Z"
}
```

### Conflict handling

Use optimistic concurrency: the server returns an `updatedAt`/`version`
value with every `GET`, and `PUT`/`PATCH` accept an optional
`If-Match: <version>` header. A mismatch returns `409 Conflict` with the
current server document, so the client can offer "keep mine / keep server's
/ merge" — the same three-way choice most sync tools give users, rather than
silently clobbering one device's progress with another's.

### Why REST here and not GraphQL

Given the payload is a single small per-user document with no relational
querying needs (no "give me all users who completed day 40" from the
client), a GraphQL schema would just be REST with more ceremony. If the
product later grows features that need flexible querying (e.g. a coach
dashboard viewing many students' progress with filters), a thin GraphQL
layer could be added over the same `progress` table without changing this
document's schema.

## 5. Migration path from today's client-only state

1. Ship this backup/restore tool first (done) — gives users a manual escape
   hatch with zero backend dependency.
2. Stand up the `users`/`progress` tables and the REST endpoints above.
3. On first login after the backend ships, call `GET /api/v1/progress`; if
   `404`, `PUT` the current localStorage state up as the initial sync (i.e.
   the existing local data becomes the seed, nobody loses progress).
4. Going forward, `completed`/`pomoCount` writes fire a debounced `PATCH` in
   addition to the existing `saveProgress()`/`savePomoCount()` localStorage
   writes — localStorage remains a fast local cache and offline fallback,
   the server becomes the durable source of truth.
5. The export/import UI stays — it's still useful for moving a backup
   between accounts, or as a manual safety net independent of the backend.
