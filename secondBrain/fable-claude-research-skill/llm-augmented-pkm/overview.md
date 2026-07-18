# Classic PKM, Augmented with LLMs (Obsidian / Logseq + AI)

The evolutionary path: keep a proven personal-knowledge-management methodology — Tiago Forte's **Building a Second Brain (BASB/PARA)** or **Zettelkasten** — in a local-first Markdown tool (Obsidian, Logseq), and bolt AI on via plugins for semantic search, chat-with-your-vault, and text generation.

## The methodologies

**BASB / PARA / CODE** (Tiago Forte). Organize by *actionability* into **P**rojects, **A**reas, **R**esources, **A**rchive; process information through **C**apture → **O**rganize → **D**istill → **E**xpress. Forte's own 2026 position ([The AI Second Brain](https://www.buildingasecondbrain.com/ai-second-brain)) is that AI shifts the game to **personal context management**: "better results come from better context," not better prompts — your second brain becomes the context store you feed to an LLM (his course now teaches a "Master Prompt" + PARA-for-AI workflow).

**Zettelkasten** (Luhmann). Atomic notes, densely linked, ideas emerge from the link structure. LLMs change the economics: link-suggestion and note-connection — the laborious part — can now be automated ([Smart Connections](https://smartconnections.app) exists for exactly this).

A 2026-specific insight worth internalizing: your notes now have a *second audience* — the LLM you point at them. Notes with implicit context ("meeting went well, do the thing") retrieve badly; good notes for AI make context explicit ([Atlas 2026 PKM guide](https://www.atlasworkspace.ai/blog/personal-knowledge-management)).

## The tools

**[Obsidian](https://obsidian.md)** — local Markdown vault, 1,500+ community plugins, free for personal use (closed-source core, but your data is plain files). The de-facto standard for this approach.

Key AI plugins (per the [2026 plugin comparisons](https://anthemcreation.com/en/artificial-intelligence/ai-plugins-obsidian-2026-comparison/), [wetheflywheel radar](https://wetheflywheel.com/en/radar/obsidian-ai-plugins/)):

- **[Copilot for Obsidian](https://github.com/logancyang/obsidian-copilot)** (7.4k★, AGPL-3.0, very active) — the strongest all-rounder: chat-with-your-vault, semantic search, inline generation; supports cloud *and* local models. Free core, paid "Plus" tier for advanced modes.
- **[Smart Connections](https://github.com/brianpetro/obsidian-smart-connections)** (5.3k★, active) — passive, zero-prompt recall: surfaces related notes automatically as you write, using a *local* embedding model with no API key. The lowest-friction AI addition to a vault.
- **[Text Generator](https://github.com/nhaouari/obsidian-textgenerator-plugin)** (2k★, MIT) — template-driven text generation with any provider.
- The common 2026 stack: Smart Connections for discovery + Copilot for conversation covers ~80% of "second brain" use cases ([comparison](https://wetheflywheel.com/en/radar/obsidian-ai-plugins/)).

**[Logseq](https://github.com/logseq/logseq)** (43.9k★, AGPL-3.0) — open-source, outline-based, privacy-first alternative with block-level granularity. Caveat: development energy has gone into a long-running database-version rewrite; plugin AI ecosystem is thinner than Obsidian's.

**Local-model option**: run [Ollama](https://ollama.com) and point Copilot/Smart Connections at it for a fully offline AI vault ([guide](https://www.promptquorum.com/power-local-llm/local-llm-with-obsidian-2026)).

## Trade-offs

**Strengths**
- Your notes are plain Markdown on your disk — maximum longevity, privacy, and portability; AI is swappable.
- Mature methodology + mature tool; enormous community, tutorials, templates.
- Incremental: start with zero AI and add it plugin by plugin.

**Weaknesses**
- *You* are still the librarian: PARA filing, distilling, and linking discipline is required, and most abandoned second brains die exactly here.
- Plugin AI is bolted-on: quality varies, configuration fiddling is real, and vault-wide RAG in a plugin is weaker than dedicated tools.
- Obsidian sync/publish are paid add-ons (or DIY via git/iCloud).

## Who it's for

People who want to *own their notes for decades*, enjoy (or at least tolerate) gardening their system, and want AI as an assistant rather than the author. If the maintenance burden is precisely what kills your systems, look at [llm-generated-wikis](../llm-generated-wikis/overview.md) (agent does the gardening) or [llm-native-note-apps](../llm-native-note-apps/overview.md) (app does the organizing).

## Getting started (concrete)

1. Install [Obsidian](https://obsidian.md); create a vault; make four folders: `1 Projects / 2 Areas / 3 Resources / 4 Archive` (PARA).
2. Install **Smart Connections** from Community Plugins — it works immediately with local embeddings, no key needed.
3. Install **Copilot**, add an API key (Claude/OpenAI/Gemini) or point it at Ollama; try "chat with vault" on your first 20 notes.
4. Adopt one capture habit (Web Clipper + a daily note) and one weekly 15-minute review. Method beats tooling.
5. Optional reading: Forte's *Building a Second Brain* book; [effortlessacademic.com's Smart Connections + Copilot workflow](https://effortlessacademic.com/adding-ai-to-your-obsidian-notes-with-smartconnections-and-copilot/) for an academic-flavored setup.
