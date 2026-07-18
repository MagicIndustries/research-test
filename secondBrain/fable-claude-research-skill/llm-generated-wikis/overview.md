# LLM-Generated Wikis (the Karpathy "LLM Wiki" pattern)

The newest and arguably most influential second-brain pattern of 2026: instead of you writing and maintaining a knowledge base, **an LLM agent writes and maintains it**, while you curate sources and ask questions.

## Origin

Andrej Karpathy published the pattern as a gist, ["llm-wiki"](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f), on **April 4, 2026**. His own vault grew to ~100 articles / ~400,000 words, all written and maintained by the agent ([MindStudio write-up](https://www.mindstudio.ai/blog/andrej-karpathy-llm-wiki-obsidian-ai-second-brain)). The core insight, in his words: *"the tedious part of maintaining a knowledge base is not the reading or the thinking — it's the bookkeeping."* LLMs don't get bored and don't forget to update a cross-reference, so hand them the bookkeeping.

The same idea applied to codebases is [DeepWiki](https://deepwiki.com) by Cognition (the Devin company): auto-generated wiki documentation for any public GitHub repo — 50k+ repos indexed, free for public repos ([Cognition blog](https://cognition.com/blog/deepwiki)).

## How it differs from RAG

A RAG system retrieves raw chunks and re-synthesizes an answer on every query — the synthesis is thrown away each time. An LLM wiki is a **persistent, compounding artifact**: the cross-references are already there, contradictions have already been flagged, and each query can *file its answer back into the wiki* as a new page. Your knowledge base gets better every time you use it, rather than staying a static pile of chunks.

## Architecture (three layers)

1. **Raw sources** — an immutable directory of curated documents (articles, PDFs, clippings, data files). The LLM reads them but never edits them.
2. **The wiki** — a directory of LLM-generated, interlinked Markdown: summaries, entity pages, concept pages, comparisons, overviews. The model owns this layer entirely — it creates pages, maintains cross-references, and enforces consistency. You read it; the LLM writes it.
3. **The schema** — a `CLAUDE.md`/`AGENTS.md` file that tells the agent how the wiki is structured, what the conventions are, and how the workflows run. It evolves as you use the system.

Two housekeeping files hold it together:

- `index.md` — a catalog of every page with summaries, organized by category.
- `log.md` — an append-only, greppable record of every ingest, query, and lint.

## The three workflows

- **Ingest** — drop a new source into the raw folder, then tell the agent to process it: read, discuss takeaways with you, write a summary page, update the index, and revise related pages (a single source might touch 10–15 wiki pages).
- **Query** — ask a question; the agent searches the wiki, synthesizes an answer with citations, and optionally files a valuable answer back as a new wiki page.
- **Lint** — a periodic health check: find contradictions, stale claims, orphaned pages, missing cross-references, and gaps.

## Tooling

- Any CLI coding agent works as the maintainer: **Claude Code**, OpenCode, Pi, Codex, etc. (the gist names them explicitly).
- **Obsidian** as the human-facing "IDE" for browsing (wikilinks + graph view render the cross-references beautifully); [Obsidian Web Clipper](https://obsidian.md/clipper) for turning articles into Markdown sources.
- [`qmd`](https://github.com/tobi/qmd) (Tobi Lütke, ~28k stars, MIT) — a mini CLI search engine (BM25 + vector, with an MCP server) so the agent can search the wiki fast instead of grepping.
- Optional: Dataview plugin for querying page frontmatter; Marp for turning wiki pages into slides.

## Trade-offs

**Strengths**
- Near-zero maintenance burden on you — the highest-leverage change vs. classic PKM, where systems die of neglect.
- Compounding: knowledge accumulates as prose you can actually read, not opaque embeddings.
- Plain Markdown + git = fully portable, private (with a local or API model of your choice), diffable, and future-proof.
- The pattern is a *convention*, not a product — nothing to be discontinued or price-hiked.

**Weaknesses**
- Requires comfort with a terminal agent and paying per-token (Claude Code / API costs; heavy ingests touch many pages).
- Quality depends on your schema file and on periodically running lint — an unlinted wiki drifts.
- Young pattern (months old): conventions are still settling; you'll be adapting a gist, not installing a product.
- Hallucination risk exists at write time, not just read time — the lint workflow and source citations are the mitigation, so keep summaries claim-linked to sources.

## Who it's for

People already using (or willing to learn) Claude Code or a similar agent, who want a durable, local, plain-text second brain and are happy to spend API tokens instead of filing time. If you want a GUI product with zero setup, look at [LLM-native note apps](../llm-native-note-apps/overview.md) instead.

## Getting started (concrete)

See [getting-started.md](./getting-started.md) for a full walkthrough. The short version:

1. Create a vault folder with `sources/`, `wiki/`, `CLAUDE.md`.
2. Paste/adapt the schema conventions from [Karpathy's gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) into `CLAUDE.md` (or start from the [NicholasSpisak/second-brain](https://github.com/NicholasSpisak/second-brain) template, 600+ stars, built for Obsidian).
3. Drop 3–5 documents into `sources/`, open Claude Code in the vault, and say "ingest the new sources".
4. Ask it questions; run a lint after the first ten ingests.
