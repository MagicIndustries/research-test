# Methodologies: The Organizing Frameworks Under Every Second Brain

*Method documentation. Resource list: [resources.md](resources.md). Researched 2026-07-18.*

## Why methodology comes first

Every tool in this pack fails without an organizing philosophy: capture without resurfacing is a junk drawer, and tool-hopping without habits just relocates the mess. The frameworks below are tool-agnostic — they transfer between Obsidian, Notion, wikis, and even agent-maintained systems (an [LLM Wiki](../llm-wiki/) CLAUDE.md schema is, in effect, a methodology encoded for a machine to follow).

## CODE — the master workflow (Tiago Forte)

From *Building a Second Brain* (2022), the four-stage loop ([Aftertone explainer](https://www.aftertone.io/productivity-guides/second-brain-para-method)):

1. **Capture** — collect ideas and information from every source, with low friction.
2. **Organize** — structure captured material for retrieval (this is where PARA plugs in).
3. **Distill** — progressively summarize down to the valuable essence (bold key lines, then highlight the bold, then executive-summarize).
4. **Express** — the point of the system: use the knowledge to create and communicate.

In AI-era terms: RAG assistants automate parts of *Organize* (retrieval), LLMs automate much of *Distill*, and the LLM Wiki automates *Organize + Distill* entirely, leaving humans *Capture* (curation) and *Express*.

## PARA — organizing by actionability

Forte's filing scheme, used at the Organize step ([Calmevo beginner's guide](https://calmevo.com/how-to-build-a-second-brain/)):

- **Projects** — short-term efforts with a goal and deadline.
- **Areas** — ongoing responsibilities with a standard to maintain (health, finances, team).
- **Resources** — topics of ongoing interest (reference material).
- **Archives** — inactive items from the other three.

The key idea: organize by **actionability**, not by topic taxonomy — information lives where you'll use it, and everything degrades gracefully into Archives. Works identically as folders in Obsidian, top-level pages in Notion, or namespaces in a wiki.

## Zettelkasten — organizing by connection

Luhmann's slip-box method: **atomic notes** (one idea per note), written **in your own words**, each **linked** to related notes at creation time, with occasional **structure/hub notes** indexing entry points. Insight emerges from the link network, not from hierarchy. Deep treatment and the canonical comparison with Forte's approach: [zettelkasten.de on combining BASB and Zettelkasten](https://zettelkasten.de/posts/building-a-second-brain-and-zettelkasten/); method comparison: [brainfo, Zettelkasten vs PARA vs CODE](https://brainfo.ai/blog/second-brain-methods-zettelkasten-para-code/).

**PARA vs Zettelkasten is a false choice.** PARA categorizes by actionability; Zettelkasten links contextually. The common modern practice is PARA as the folder skeleton with Zettelkasten-style atomic linked notes inside it — trivial in Obsidian, where bidirectional links are native ([brainfo, which method is right for you](https://brainfo.ai/blog/zettelkasten-para-and-beyond/)).

## Maps of Content (MOC) — emergent indexes

The Obsidian-community pattern (Nick Milo's "Linking Your Thinking"): instead of rigid hierarchy, create **index notes that link to related notes** around a theme, growing them only when a cluster of notes demands one. MOCs are the human ancestor of the LLM Wiki's agent-maintained `index.md`.

## Digital gardening — organizing in public

A publishing philosophy as much as an organizing one: notes are evergreen, topology-organized, and labeled by maturity (seedling → growing → evergreen), with imperfection accepted as part of learning in public ([Maggie Appleton's digital-gardeners](https://github.com/MaggieAppleton/digital-gardeners); tooling in [wikis-digital-gardens/](../wikis-digital-gardens/)).

## Progressive summarization & spaced resurfacing

Two answers to "how does anything ever come back to me?":

- **Progressive summarization** (Forte): distill notes opportunistically each time you touch them, so the best material becomes progressively easier to re-absorb.
- **Spaced repetition**: schedule notes to resurface (Logseq has flashcards built in; Obsidian via plugins). AI adds a third answer: semantic surfacing (Smart Connections) and agent lint/synthesis passes.

## How methodology maps to the AI-era methods

| Framework | Human-first home | AI-era descendant |
|---|---|---|
| CODE | Any PKM app | Human captures/curates; LLM organizes & distills ([llm-wiki/](../llm-wiki/)) |
| PARA | Folder structure | Workspace/project boundaries in RAG tools; project notebooks in NotebookLM |
| Zettelkasten | Obsidian/Logseq atomic notes | Atomic, consistently-templated, explicitly-linked pages = LLM-readable wiki ([codersera](https://codersera.com/blog/karpathy-llm-knowledge-base-second-brain/)); entities/relations in [knowledge graphs](../knowledge-graphs/) |
| MOC | Hub notes | Agent-maintained index.md |
| Digital gardening | Public notes | Publishing layer over agent-maintained vaults |

## Trial instructions

1. **Week 1 — capture only.** Pick one inbox (a single note, an app's inbox, a folder). Capture everything; organize nothing. This builds the only habit that matters first.
2. **Week 2 — PARA pass.** Create the four folders; empty the inbox into them; notice which items are actually project-bound (most are).
3. **Week 3 — atomic linking.** Each day, turn one captured item into an atomic note in your own words and link it to at least two others. When three-plus notes cluster, start a MOC.
4. **Week 4 — express.** Write something (a post, a doc, a decision memo) *from the notes only*. Where the notes fail you reveals what your capture and distill steps are missing.
5. Then layer tooling: AI plugins ([pkm-apps/](../pkm-apps/)) for resurfacing, or hand the maintenance to an agent ([llm-wiki/](../llm-wiki/)).
