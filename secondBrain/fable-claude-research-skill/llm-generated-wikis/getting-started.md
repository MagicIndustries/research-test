# Getting Started: Your Own LLM Wiki with Claude Code + Obsidian

A concrete walkthrough of the [Karpathy LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). Budget: ~1 hour to set up, then minutes per ingest.

## Prerequisites

- Claude Code (or another CLI agent: OpenCode, Codex CLI, Pi)
- Obsidian (optional but recommended, for browsing) — [obsidian.md](https://obsidian.md)
- Optionally [`qmd`](https://github.com/tobi/qmd) for fast search once the wiki grows past ~50 pages

## 1. Create the vault

```
mkdir -p ~/llm-wiki/{sources,wiki}
cd ~/llm-wiki && git init
```

Open the folder as an Obsidian vault if you use Obsidian.

## 2. Write the schema file

Create `CLAUDE.md` at the vault root. Either copy the conventions from [the gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) or clone the [NicholasSpisak/second-brain](https://github.com/NicholasSpisak/second-brain) template and adapt. The schema must state, at minimum:

- **Layers**: `sources/` is read-only for the agent; `wiki/` is agent-owned; this file is the schema.
- **Page conventions**: one Markdown file per entity/concept, `[[wikilink]]` cross-references, YAML frontmatter with `type`, `created`, `sources`.
- **Housekeeping**: `wiki/index.md` catalogs every page by category with a one-line summary; `log.md` gets one prefixed line per operation (`INGEST:`, `QUERY:`, `LINT:`).
- **Workflows**: definitions of ingest, query, and lint (see below) so you can invoke them by name.

## 3. The three workflows

**Ingest.** Save an article/PDF/note into `sources/` (Obsidian Web Clipper makes web→Markdown one click). Then, in Claude Code:

> Ingest the new files in sources/. Read them, discuss the key takeaways with me, then write or update wiki pages, update index.md, and log the operation.

Expect one source to touch several wiki pages — that's the point. The agent should link new pages into existing ones.

**Query.**

> Using only the wiki, answer: <question>. Cite the wiki pages and their underlying sources. If the answer is valuable and not already a page, file it as one.

**Lint.** After every ~10 ingests:

> Run a lint: find contradictions between pages, stale claims, orphaned pages, missing cross-links, and gaps worth filling. Propose fixes, then apply the ones I approve.

## 4. Habits that make it compound

- **Curate ruthlessly** — the human job is deciding what goes in `sources/`. Garbage in, confident garbage out.
- **Commit to git** after each session; the diff is a readable record of what the agent changed.
- **Evolve the schema** — when the agent does something you dislike, fix the convention in `CLAUDE.md` rather than correcting it each time.
- **Add search when grep gets slow**: `qmd` indexes the vault and exposes an MCP server so the agent retrieves instead of scanning.

## Cost expectations

Each ingest is a multi-file agent session — with Claude on an API plan expect cents-to-tens-of-cents per source depending on length; a Claude Pro/Max subscription running Claude Code flattens this. Fully-local operation is possible by pointing an agent at Ollama-served models, at a quality cost in the synthesis and linking steps.
