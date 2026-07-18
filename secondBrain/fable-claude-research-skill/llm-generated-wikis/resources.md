# Resources — LLM-Generated Wikis

Star counts and activity checked against the GitHub API on 2026-07-18.

## Primary sources

- [karpathy/llm-wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — **the** canonical document (April 4, 2026). Defines the three-layer architecture (sources / wiki / schema), the ingest–query–lint workflows, and the `index.md`/`log.md` conventions. Read this first; everything else is commentary.
- [Cognition — DeepWiki announcement](https://cognition.com/blog/deepwiki) — first-party post on DeepWiki, the same "agent writes the wiki" idea applied to codebases at scale.
- [DeepWiki docs (Devin)](https://docs.devin.ai/work-with-devin/deepwiki) — official usage docs; swap `github.com` → `deepwiki.com` in any repo URL to view its generated wiki.

## Repos & code

- [NicholasSpisak/second-brain](https://github.com/NicholasSpisak/second-brain) — 618★, updated Apr 2026. A ready-made Obsidian vault template implementing the Karpathy pattern: schema file, folder layout, workflows. The fastest way to start without writing your own `CLAUDE.md` from scratch.
- [tobi/qmd](https://github.com/tobi/qmd) — 27.9k★, MIT, active. Tobi Lütke's mini CLI search engine (BM25 + vector + MCP server) for exactly this use case: letting an agent search your Markdown knowledge base quickly. Mentioned by name in Karpathy's gist.
- [AsyncFuncAI/deepwiki-open](https://github.com/AsyncFuncAI/deepwiki-open) — 17.3k★, MIT, very active. Open-source DeepWiki clone: point it at any GitHub/GitLab/Bitbucket repo (including private ones) and it generates a wiki with diagrams locally, using your choice of model. Useful if you want the DeepWiki experience for private corpora.
- [obsidian.md](https://obsidian.md) + [Obsidian Web Clipper](https://obsidian.md/clipper) — the standard human-side browser for the wiki and the standard way to capture web articles into `sources/` as clean Markdown.

## Articles & tutorials

- [How I Took Karpathy's LLM Wiki and Built an AI-Powered Second Brain in Obsidian](https://aimaker.substack.com/p/llm-wiki-obsidian-knowledge-base-andrej-karphaty) — practitioner walkthrough wiring the gist to Obsidian + Claude Code.
- [Karpathy's Second Brain: A Wiki the AI Writes For You](https://angelo-lima.fr/en/karpathy-second-brain-obsidian-claude-en/) — clear explanation of the three layers with an Obsidian + Claude setup.
- [Build a Second Brain: Karpathy's LLM Wiki Method, Step by Step](https://www.askglitch.com/blog/build-a-second-brain) — step-by-step tutorial.
- [MindStudio: Build a Self-Updating AI Second Brain with Obsidian in 1 Hour](https://www.mindstudio.ai/blog/andrej-karpathy-llm-wiki-obsidian-ai-second-brain) — includes the "~100 articles / 400k words" account of Karpathy's own vault.
- [Karpathy's "LLM wiki" with a single brain (Medium, May 2026)](https://medium.com/@tony.demol/karpathys-llm-wiki-with-a-single-brain-975df9c84be6) — a variation using one agent session for everything.
- [Karpathy's LLM Wiki: Your Second Brain, Maintained by the Machine (LLBBL, June 2026)](https://llbbl.blog/2026/06/29/karpathys-llm-wiki-your-second.html) — recent reflection on how the pattern holds up after months of use.
- [What Is DeepWiki? AI Code Docs for Any GitHub Repo](https://ghost.codersera.com/blog/what-is-deepwiki-ai-code-documentation-github-repository/) — overview of DeepWiki's features (diagrams, chat, 50k+ repos indexed).

## Related in this repo

The `understand-anything` skills installed in this workspace implement a closely related pattern (knowledge graphs + LLM wikis over codebases and Markdown corpora) — see `understand-anything:understand-knowledge` for the "Karpathy-pattern LLM wiki knowledge base" analyzer.
