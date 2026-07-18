# The LLM Wiki Pattern (Karpathy) — AI-Maintained Knowledge Bases

> Researched 2026-07-18. Pattern published by Andrej Karpathy in early/mid 2026; this is the most current major technique in the space.

## The core idea

Invert the traditional relationship: instead of **you** maintaining a knowledge base and occasionally asking an AI questions about it, **an LLM agent builds and maintains the knowledge base**, and your job shrinks to curating sources, writing the schema, and asking good questions.

Karpathy's framing: *"The human's job is to curate sources, direct the analysis, ask good questions. The LLM's job is everything else."*

This replaces stateless RAG (retrieve raw chunks + re-synthesize on every query) with **persistent compilation**: the LLM synthesizes sources into cross-referenced wiki pages *once at ingest time*, and queries run over that clean, dense, compiled layer.

## Architecture: three layers

```
second-brain/
├── raw/          # Layer 1 — immutable sources (articles, PDFs, transcripts)
│                 #   LLM reads, never modifies. Source of truth.
├── wiki/         # Layer 2 — LLM-owned markdown pages
│   ├── index.md  #   catalog of all pages by category; read first on every query
│   ├── log.md    #   append-only operation log (ingests, queries, lint passes)
│   └── *.md      #   entity pages, concept pages, syntheses — densely cross-linked
└── CLAUDE.md     # Layer 3 — the schema (human-authored)
                  #   page types, naming conventions, workflows, style rules
```

**The schema file is everything.** It enumerates page types (so the agent decides correctly between creating a new page vs editing in place — ~90% accuracy reported in production), naming conventions, and the ingest/query/lint procedures. It co-evolves with use: when the agent misfiles something, you fix the schema, not the page.

## Three operations

| Operation | What happens |
|---|---|
| **Ingest** | Agent reads a new item in `raw/`, extracts concepts/entities, integrates into the wiki. One source commonly touches 10–15 pages (new pages + cross-reference updates). |
| **Query** | Agent reads `index.md`, loads relevant pages, answers with citations. Valuable answers can be filed back as new wiki pages. |
| **Lint** | Periodic health check: contradictions, stale claims, orphaned pages, missing cross-links. **"Drift is the failure mode"** — partial updates that leave pages inconsistent. |

## The standard stack

- **Storage:** plain markdown + git (versioning, history, rollback)
- **Human browser:** Obsidian — graph view, backlinks, search ("the IDE for the wiki")
- **Agent/maintainer:** Claude Code is most common; the pattern is agent-agnostic — Codex CLI, Cursor, OpenCode all work, and switching requires zero data migration
- **Optional wiring:** MCP connects Claude Desktop/Code to the vault for read/write during chat
- **Optional search at scale:** `qmd` (hybrid BM25/vector) or similar once the wiki outgrows single-context loading

## Known limits and failure modes

- **Scale ceiling:** ~50k–100k tokens (~150–200 dense pages) for load-everything querying. Beyond that: selective page loading via `index.md`, or add a search layer.
- **Drift:** the canonical failure — mitigate with regular lint passes and git diff review.
- **Ingest cost:** touching 10–15 pages per source is token-hungry; batch ingests and use a capable-but-cheap model for routine filing.
- **No longitudinal data yet:** the pattern is months old; nobody knows what year-two maintenance looks like. Git history is your insurance.

## Why it won (vs RAG, vs graphs)

- vs **RAG assistants**: knowledge compounds — contradictions are resolved once, syntheses persist, the wiki gets better while you sleep. RAG re-derives everything per query and nothing accumulates.
- vs **GraphRAG**: same "pre-compiled synthesis" benefit, but in human-readable markdown with no graph DB to run. For personal-scale corpora (hundreds of sources), analyses consistently favor the wiki; graphs win at larger, entity-dense scale.

## Relationship to methodology (../01-methodology/)

PARA and Zettelkasten survive here as **schema vocabulary**: your `CLAUDE.md` can specify PARA-style top-level organization, atomic pages, and mandatory cross-linking. The methods became instructions instead of disciplines.

## Quick-start (≈1 hour)

1. `mkdir second-brain && cd second-brain && git init`; create `raw/`, `wiki/`, and a first-draft `CLAUDE.md`.
2. Seed the schema by pasting Karpathy's gist into Claude Code and asking it to instantiate a version for your domain (this is Karpathy's own recommended approach).
3. Drop 3–5 real sources (articles, transcripts) into `raw/`; run an ingest; review the diff in git/Obsidian.
4. Iterate on `CLAUDE.md` whenever the agent files something wrong. After ~30 days of steady capture you have a compounding system.
5. Open the folder as an Obsidian vault for browsing/graph view.

See `resources.md` for the gist, implementations, step-by-step guides, and videos.
