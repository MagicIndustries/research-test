# The LLM Wiki: An Agent-Maintained Second Brain

*Method documentation. Resource list: [resources.md](resources.md). Researched 2026-07-18.*

## What it is

The LLM Wiki is a pattern published by Andrej Karpathy as a GitHub gist in April 2026 ([gist.github.com/karpathy/442a6bf555914893e9891c11519de94f](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)). Instead of a RAG system that retrieves and synthesizes from raw documents on every query, an LLM agent **incrementally builds and maintains a persistent wiki** — a structured, interlinked collection of markdown files — that grows richer with each interaction. The human's job shrinks to curating sources and directing analysis; the agent does all the bookkeeping.

Karpathy's framing of *why* this works: "the tedious part of maintaining a knowledge base is not reading or thinking — it's bookkeeping." Updating cross-references, noting contradictions, keeping pages consistent — the maintenance work humans always abandon — is precisely what an LLM agent can do reliably on every ingest. He grounds the idea in Vannevar Bush's 1945 Memex: a personal, curated knowledge store with associative trails; LLMs finally solve the maintenance problem Bush couldn't.

The pattern spread extremely fast: within weeks there were Obsidian adaptations, Notion adaptations, YouTube walkthroughs, and critical rebuilds (see [resources.md](resources.md)). Karpathy's own vault reportedly reached ~100 articles and ~400,000 words of agent-written, cross-linked material ([LLBBL analysis](https://llbbl.blog/2026/06/29/karpathys-llm-wiki-your-second.html)).

## Architecture: three layers

| Layer | Owner | Contents |
|---|---|---|
| **Raw sources** (`raw/`) | You (immutable) | Curated articles, PDFs, transcripts, data files. The LLM reads them but never modifies them. Source of truth. |
| **The wiki** (`wiki/`) | The LLM | Entity pages, concept summaries, cross-references, synthesis documents. "You read it; the LLM writes it." |
| **The schema** (`CLAUDE.md`) | You (rarely edited) | The control document: wiki structure, naming conventions, page templates, and operational workflows. Turns a generic chatbot into "a disciplined wiki maintainer." |

Two housekeeping files keep the system navigable and auditable:

- **`index.md`** — a content-oriented catalog of every page with one-line summaries and metadata, organized by category, updated on every ingest.
- **`log.md`** — an append-only chronological record; entries prefixed with date and operation type so the history is greppable with plain Unix tools.

## The three operations

1. **Ingest.** Drop a new source into `raw/`, tell the agent to ingest. It reads the source, extracts key information, creates or updates entity/concept pages, notes contradictions with existing claims, and maintains cross-references. A single source may touch 10–15 wiki pages — this fan-out is what makes the wiki compound instead of accumulate.
2. **Query.** Ask questions; the agent searches relevant wiki pages (not the raw sources), synthesizes an answer, and optionally files valuable findings back into the wiki as new pages. Because synthesis happens over pre-compiled, already-linked material, answers reflect accumulated knowledge rather than per-query retrieval.
3. **Lint.** A periodic health pass: find contradictions, stale claims, orphan pages, and missing cross-references, and fix them. Karpathy: "The lint pass is not optional; it keeps the graph healthy."

## How it compares to the alternatives

- **vs RAG** ([rag-assistants/](../rag-assistants/)): RAG recomputes synthesis every query and nothing persists; the wiki compiles ahead of time, so connections exist before you ask and the artifact compounds. Cost moves from query time to ingest time.
- **vs knowledge graphs** ([knowledge-graphs/](../knowledge-graphs/)): the wiki *is* a knowledge graph, but in human-readable markdown with prose nodes instead of triples in a graph DB — vastly easier to inspect, edit, and own; less amenable to formal traversal queries.
- **vs classic PKM** ([pkm-apps/](../pkm-apps/)): same substrate (markdown vault, typically browsed in Obsidian), different author. Notably, designing notes for LLM readability — flat atomic pages, explicit links, one consistent template — also makes them better for humans ([codersera analysis](https://codersera.com/blog/karpathy-llm-knowledge-base-second-brain/)).

## Trial instructions (Claude Code + Obsidian)

This is the canonical setup used by most guides ([MindStudio](https://www.mindstudio.ai/blog/build-ai-second-brain-claude-code-obsidian), [Professor Glitch](https://www.askglitch.com/blog/build-a-second-brain), [aimaker](https://aimaker.substack.com/p/llm-wiki-obsidian-knowledge-base-andrej-karphaty)):

1. **Create the vault.** A folder with `raw/`, `wiki/`, and empty `index.md` and `log.md`. Open it as an Obsidian vault (Obsidian is the recommended "IDE" — graph view, backlinks, live preview of what the agent writes).
2. **Write the schema.** Create `CLAUDE.md` defining: the three layers and their ownership rules; a page template (title, one-line summary, body, links, sources); naming conventions (e.g. lowercase-hyphenated, one concept per page); the ingest/query/lint workflows; and the rule that every claim links back to a source in `raw/`. Start by adapting the gist rather than inventing your own.
3. **Seed it.** Put 5–10 sources you genuinely care about into `raw/` (use Obsidian Web Clipper for articles; download images locally to avoid broken URLs later).
4. **Ingest.** In the vault directory run Claude Code and ask it to ingest the new sources per CLAUDE.md. Watch it create entity pages and cross-links; check `log.md` afterwards.
5. **Query and file back.** Ask a synthesis question spanning several sources; if the answer is good, have it filed as a wiki page.
6. **Lint.** After a few ingests, run the lint workflow and read what it fixes — this is also your quality-control window as the human.
7. **Optional extensions** (from the gist): qmd search engine for retrieval at scale; the Dataview Obsidian plugin for dynamic queries over page metadata; Marp for turning wiki pages into slide decks; a git repo for versioning the whole brain.

**Costs and caveats.** Ingest fan-out and lint passes consume tokens on a frontier model; budget accordingly or run lint less often. Spot-check the wiki — an unread agent-maintained wiki can compound errors as readily as insights (a point pressed by the critical rebuild at [theaioperator.io](https://theaioperator.io/p/i-rebuilt-karpathys-llm-wiki-heres)). The pattern needs an agentic CLI with file access — Claude Code is the default; adaptations exist for Copilot ([intelligink](https://intelligink.com/blog/build-ai-second-brain-llm-wikis-copilot-cowork/)) and Notion ([ivgraph](https://ivgraph.com/journal/second-brain-llm-notion-claude-code/)).
