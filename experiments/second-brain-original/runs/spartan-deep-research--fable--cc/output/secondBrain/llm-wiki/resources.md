# LLM Wiki — Resources

All links accessed 2026-07-18. Star counts marked "verified" were fetched from the live repo that day.

## Primary source

- **Karpathy's LLM Wiki gist** (2026-04-03) — the original pattern definition: three-layer architecture, ingest/query/lint, index.md/log.md conventions, Memex lineage.
  https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f

## GitHub repos & templates

- **eugeniughelbur/obsidian-second-brain** — 3.4k stars (verified), MIT. Cross-CLI skill (Claude Code, Codex, Gemini CLI, OpenCode, Hermes, Pi): 44 commands, self-rewriting notes, local+hybrid semantic search, scheduled nightly maintenance agents, "Open Knowledge Metabolism" freshness framework. v0.12 "The Stress Test" July 2026. Install: `/plugin marketplace add eugeniughelbur/obsidian-second-brain`.
  https://github.com/eugeniughelbur/obsidian-second-brain
- **NicholasSpisak/second-brain** — LLM-maintained personal knowledge base template for Obsidian, explicitly based on Karpathy's pattern. Good minimal starting schema.
  https://github.com/NicholasSpisak/second-brain
- **basicmachines-co/basic-memory** — MCP server storing agent memory as human-readable markdown that integrates with Obsidian; the "LLM wiki as a protocol" take. (Detailed in [../memory-layers/resources.md](../memory-layers/resources.md).)
  https://github.com/basicmachines-co/basic-memory

## Articles & tutorials (text)

- Professor Glitch, "Build a Second Brain: Karpathy's LLM Wiki Method, Step by Step" — the most complete independent step-by-step walkthrough, including the ~100 articles/400k words result.
  https://www.askglitch.com/blog/build-a-second-brain
- Codersera, "Karpathy's LLM Knowledge Base: Build Your Second Brain" — virality context (16M views, star growth) and architecture recap.
  https://codersera.com/blog/karpathy-llm-knowledge-base-second-brain/
- Techstrong.ai, "Karpathy's Instructions for Building an AI-Driven Second Brain" — why maintenance burden is the core problem being solved.
  https://techstrong.ai/features/karpathys-instructions-for-building-an-ai-driven-second-brain/
- AI Maker (Substack), "How I Took Karpathy's LLM Wiki and Built an AI-Powered Second Brain in Obsidian" — practitioner build log, Obsidian-specific.
  https://aimaker.substack.com/p/llm-wiki-obsidian-knowledge-base-andrej-karphaty
- MindStudio, "What Is Andrej Karpathy's LLM Wiki? How to Build a Personal Knowledge Base With Claude Code."
  https://www.mindstudio.ai/blog/andrej-karpathy-llm-wiki-knowledge-base-claude-code
- Kunal Ganglani, "LLM Wiki Setup: Karpathy's Knowledge Base [2026 Guide]" — local-model angle.
  https://www.kunalganglani.com/blog/llm-wiki-karpathy-local-knowledge-base
- Urvil Joshi (Medium), "Andrej Karpathy's LLM Wiki: Create your own knowledge base."
  https://medium.com/@urvvil08/andrej-karpathys-llm-wiki-create-your-own-knowledge-base-8779014accd5
- doit.com, "From Karpathy's LLM Wiki to a Working Second Brain" — implementation notes.
  https://www.doit.com/blog/llm-wiki-second-brain-implementation
- ivgraph, "LLM Wiki for Notion: Claude Second Brain + 3D Knowledge Graph" — applying the pattern outside markdown/Obsidian.
  https://ivgraph.com/journal/second-brain-llm-notion-claude-code/
- innobu, "Karpathy's LLM Wiki: Second Brain and the Enterprise Reality Check 2026" — enterprise-adoption caveats.
  https://www.innobu.com/en/articles/karpathy-llm-wiki-second-brain-enterprise-reality.html

## Critical / skeptical views (read these too)

- WenHao Yu, "What Is Karpathy's LLM Wiki? A Zettelkasten User's Honest Review" — rewrite drift / homogenization critique.
  https://yu-wenhao.com/en/blog/karpathy-zettelkasten-comparison/
- Howz Nguyen, "Karpathy's Second Brain — actually useful or just FOMO?" — cognitive-offloading and verification concerns.
  https://howznguyen.dev/blog/second-brain-karpathy-applying-or-just-fomo
- Tony Demol (Medium, May 2026), "Karpathy's 'LLM wiki' with a single brain" — emphasizes the human-as-operator reality.
  https://medium.com/@tony.demol/karpathys-llm-wiki-with-a-single-brain-975df9c84be6
- arXiv:2604.04387, "Gradual Cognitive Externalization: From Modeling Cognition to Constituting It" — academic framing of the externalization concern.
  https://arxiv.org/pdf/2604.04387
- LLBBL Blog, "Karpathy's LLM Wiki: Your Second Brain, Maintained by the Machine" (2026-06-29) — balanced practitioner assessment.
  https://llbbl.blog/2026/06/29/karpathys-llm-wiki-your-second.html

## Videos

- "Build an AI Second Brain with Claude + Obsidian — Karpathy's LLM Wiki Method (Full Guide)" (YouTube, ~late June 2026).
  https://www.youtube.com/watch?v=HuREI6lks4s
- "How To Build An AI Second Brain OS (Claude Code + Obsidian)" (YouTube, ~late June 2026).
  https://www.youtube.com/watch?v=C6b1bX1HNg8
- "Every Way To Set Up A Claude Second Brain Explained" (YouTube, ~late June 2026) — surveys the integration options.
  https://www.youtube.com/watch?v=l8MWXsYk6Mo

## Related directories

- Human-friendly front end for the same files: [../obsidian-ai/](../obsidian-ai/README.md)
- Graph-index the wiki for retrieval at scale: [../knowledge-graphs/](../knowledge-graphs/README.md)
