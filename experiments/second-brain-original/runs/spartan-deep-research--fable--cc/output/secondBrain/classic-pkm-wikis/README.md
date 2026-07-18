# Method: Classic PKM Methodologies & Wikis, AI-Augmented

The pre-LLM second-brain traditions — **Zettelkasten**, **PARA/CODE (Building a Second Brain)**, and personal wikis (**Logseq, TiddlyWiki, Dendron, Foam**, plus open-source Notion-likes **SiYuan, AFFiNE, AppFlowy**) — did not become obsolete. In 2026 they function as the *ontology and discipline layer* that AI methods sit on: PARA gives the agent a folder scheme; Zettelkasten gives it a linking philosophy; the wiki tools give humans an interface. And each has grown its own AI integrations.

## The methodologies

### Zettelkasten (Luhmann)
Atomic notes, one idea each, densely linked; structure emerges from links rather than folders. Its virtue in the AI era: atomic linked notes are exactly what LLMs parse and traverse best. Its practitioners are also the sharpest critics of AI note-rewriting (voice homogenization, offloaded thinking) — see [zettelkasten.de](https://zettelkasten.de/posts/building-a-second-brain-and-zettelkasten/) and [a Zettelkasten user's review of the LLM Wiki](https://yu-wenhao.com/en/blog/karpathy-zettelkasten-comparison/).

### PARA + CODE (Tiago Forte)
**P**rojects / **A**reas / **R**esources / **A**rchives — action-based filing; **C**apture, **O**rganize, **D**istill, **E**xpress — the workflow ([buildingasecondbrain.com](https://www.buildingasecondbrain.com/)). Forte himself said Organize adds the least value of the four stages — pure overhead — which is precisely the stage AI now automates (auto-tagging, auto-filing, auto-linking) ([self.md analysis](https://self.md/articles/tiago-forte-second-brain-ai/)). Forte Labs now runs an "AI Second Brain" program taught with Claude, Claude Cowork, and Claude Code ([official page](https://www.buildingasecondbrain.com/ai-second-brain)) — the methodology franchise has formally merged with the agent approach. Combining PARA (organization) with Zettelkasten (synthesis) is a common 2026 layering ([Buildin.ai guide](https://buildin.ai/blog/building-high-performance-second-brain)).

## The tools

- **Logseq** — free, open-source, local-first outliner (Markdown/org-mode); every bullet is a referenceable block; whiteboards and built-in spaced-repetition flashcards ([logseq.com](https://logseq.com/); [overview](https://www.glukhov.org/knowledge-management/)). The open-source counterpart to Obsidian; AI via plugins + Ollama.
- **TiddlyWiki** — the original personal wiki (2004-): a single self-contained HTML file of linkable, taggable "tiddlers"; radically customizable and durable — no app to be discontinued ([tiddlywiki.com](https://tiddlywiki.com); [comparison vs Logseq](https://www.slant.co/versus/5116/39125/~tiddlywiki_vs_logseq)).
- **Dendron** & **Foam** — VS Code-extension PKM for developers: Dendron hierarchical, Foam Roam-style linked ([comparison context](https://www.dawidsblog.com/posts/tech_pkm_tools/)). Naturally agent-friendly since the notes live where coding agents already work.
- **SiYuan** — local-first, everything-is-a-block PKM (blocks referenceable/movable without breaking links); OpenAI-compatible AI hookup in settings ([openalternative.co roundup](https://openalternative.co/alternatives/notion)).
- **AFFiNE** — MIT, ~45k stars: docs + whiteboards + databases with "Edgeless" spatial canvas; built-in AI writing assistance ([comparison](https://www.bestalternative.dev/en/blog/best-notion-alternatives-2026-affine-appflowy-anytype-comparison)).
- **AppFlowy** — AGPL, ~60k stars, Rust/Flutter: the closest open-source match to Notion's workspace model (relational databases, kanban, team spaces), most integrated AI of the three (writing assistant, summarization, Q&A with your own API key), Docker self-hosting with E2E-encrypted sync ([appflowy.com](https://appflowy.com/compare/notion-vs-appflowy); [OSSAlt guide](https://ossalt.com/guides/notion-appflowy-affine-obsidian-2026)). *(Star counts here are as reported by the 2026 comparison articles, not independently verified.)*

## Getting started (method-first path)

1. **Choose the method before the tool.** Decide: action-based filing (PARA) for productivity, atomic linking (Zettelkasten) for research/writing, or both layered.
2. **Pick the tool by constraint**: open-source + outliner -> Logseq; maximal durability/portability -> TiddlyWiki; developer-in-VS-Code -> Foam or Dendron; Notion-shaped self-hosting -> AppFlowy; markdown ecosystem breadth -> Obsidian ([../obsidian-ai/](../obsidian-ai/README.md)).
3. **Encode the method in structure**: create the four PARA folders, or a Zettelkasten inbox + permanent-notes flow. Write the rules down in a note — that note later becomes your agent's schema file.
4. **Work manually for 2–4 weeks** so the structure reflects how you actually think.
5. **Then add AI**: local models via Ollama for search/chat, or graduate the vault to an agent-maintained [LLM Wiki](../llm-wiki/README.md) using your method-note as `CLAUDE.md`.

## When to choose this method

- You want a system that outlives any AI vendor or trend.
- You think the friction of manual note-making *is* the thinking (the strongest anti-automation argument).
- You need fully offline operation.

The honest trade-off: pure manual PKM has a well-documented abandonment problem — maintenance overhead — which is exactly the gap the agent methods close. The synthesis position most 2026 practitioners land on: keep the method, delegate the bookkeeping.

All links: **[resources.md](resources.md)**.
