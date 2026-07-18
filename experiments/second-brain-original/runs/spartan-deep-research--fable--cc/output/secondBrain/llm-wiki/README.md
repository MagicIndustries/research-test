# Method: The LLM Wiki (Agent-Maintained Markdown Second Brain)

The defining second-brain technique of 2026. An LLM agent — not you — builds and maintains a persistent knowledge base of interlinked markdown files: writing summaries, updating cross-references, flagging contradictions, and keeping an index current. You curate sources and ask questions; the agent does the bookkeeping that makes humans abandon wikis.

Published by Andrej Karpathy as a gist on **April 3, 2026** ([primary source](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)); reported ~16M views on X and thousands of stars on derivative repos within days ([Codersera](https://codersera.com/blog/karpathy-llm-knowledge-base-second-brain/)).

## Core idea

Traditional RAG re-reads raw documents on every query. The LLM wiki instead **pre-compiles** knowledge: the agent reads a source once, extracts what matters, and integrates it into existing structured pages. Knowledge compounds — good answers become new wiki pages, and the agent's prior reasoning becomes addressable knowledge ([Kloia](https://www.kloia.com/blog/knowledge-base-vs-knowledge-graph-llm)). Karpathy frames it as the maintenance layer Vannevar Bush's 1945 Memex never had.

Reported scale from Karpathy's own use: one research topic grew to ~100 articles / ~400,000 words without him writing any of it directly ([Professor Glitch](https://www.askglitch.com/blog/build-a-second-brain)).

## Architecture (three layers)

1. **Raw sources** — immutable input documents (articles, papers, transcripts, data). The agent reads these but never modifies them. They are ground truth.
2. **The wiki** — agent-generated markdown: entity pages, concept pages, summaries, syntheses, cross-references. Entirely agent-maintained.
3. **The schema** — a configuration document (typically `CLAUDE.md` or `AGENTS.md`) encoding structural conventions, naming rules, and workflows. This file is what turns a generic chatbot into "a disciplined wiki maintainer" and prevents drift.

Two special files:

- **`index.md`** — a catalog of every page with one-line summaries and metadata, organized by category, updated on every ingest. The agent reads this first to orient itself.
- **`log.md`** — append-only, timestamped activity record with consistent prefixes (e.g. `## [2026-04-02] ingest | Title`), giving a parseable evolution timeline.

## Core operations

- **Ingest**: drop a new source in; the agent reads it, discusses findings with you, writes/updates summaries, revises affected pages, updates the index, appends to the log.
- **Query**: questions are answered by searching wiki pages and synthesizing with citations; strong answers get promoted into new pages.
- **Lint**: periodic health check — find contradictions, orphaned pages, stale claims, missing cross-references.

## Why it works — and where it strains

Works because LLM agents are tireless at exactly the bookkeeping humans skip: touching 15 files in one pass, keeping cross-references consistent ([Techstrong.ai](https://techstrong.ai/features/karpathys-instructions-for-building-an-ai-driven-second-brain/)).

Known criticisms (take these seriously before committing):

- **Rewrite drift / "model collapse" in your notes**: repeated LLM read-rewrite cycles smooth detail and homogenize voice — "the average of the average of the average" ([WenHao Yu, Zettelkasten user's review](https://yu-wenhao.com/en/blog/karpathy-zettelkasten-comparison/)). Mitigation: immutable raw sources, lint passes, dated claims.
- **You're still the operator**: Karpathy's workflow is manual — you prompt, review, and direct; the agent assists ([Tony Demol](https://medium.com/@tony.demol/karpathys-llm-wiki-with-a-single-brain-975df9c84be6)).
- **Cognitive offloading**: critics argue this outsources thinking, not just storage ([Howz Nguyen](https://howznguyen.dev/blog/second-brain-karpathy-applying-or-just-fomo); academic treatment in [arXiv:2604.04387](https://arxiv.org/pdf/2604.04387)).
- **Verification burden**: every agent-written claim needs spot-checking against raw sources, especially in domains you don't yet know well.

## Getting started (step-by-step)

Prerequisites: an agent CLI (Claude Code is the common choice; Codex/Gemini CLI also work), a folder, optionally Obsidian as viewer and git for history.

1. **Create the structure:**
   ```
   wiki/
     sources/      # immutable raw material
     pages/        # agent-written wiki pages
     index.md
     log.md
     CLAUDE.md     # the schema
   ```
2. **Write the schema (`CLAUDE.md`).** Specify: page types (entity/concept/synthesis), naming conventions, linking style (`[[wikilinks]]` if using Obsidian), the ingest/query/lint workflows, the rule that `sources/` is read-only, index/log update duties, and citation requirements. This file is the whole system — start from Karpathy's gist or a template in [resources.md](resources.md).
3. **First ingest.** Drop 1–3 documents into `sources/`, then ask the agent: "Ingest sources/X per CLAUDE.md" — review what it writes. Iterate on the schema whenever output disappoints; schema tuning is the real work.
4. **Query.** Ask questions; require citations to wiki pages and sources. Promote good answers to pages.
5. **Lint weekly.** "Run the lint workflow" — review contradictions and stale claims it finds.
6. **Version everything with git** so you can audit and revert agent edits.
7. Optional: open the folder as an Obsidian vault for graph view and human browsing (see [../obsidian-ai/](../obsidian-ai/README.md) — the two methods compose naturally).

Prefer a pre-built system? The `obsidian-second-brain` Claude Code skill (3.4k stars, MIT, v0.12 July 2026 — verified) ships 44 commands, scheduled maintenance agents, and installs via the Claude Code plugin marketplace ([repo](https://github.com/eugeniughelbur/obsidian-second-brain)).

## When to choose this method

- You want compounding synthesis over a corpus you keep adding to.
- You're comfortable reviewing agent output and iterating on prompts/schemas.
- You value owning plain files over app features.

Avoid if: your corpus changes faster than it's worth re-compiling (use [RAG](../rag-apps/README.md)), your questions are mostly relationship-traversal (use a [knowledge graph](../knowledge-graphs/README.md)), or you won't review agent output (drift risk compounds unreviewed).

All links, templates, tutorials, and videos: **[resources.md](resources.md)**.
