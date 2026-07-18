# LLM Wiki Pattern — Resources

## Primary source

- **[Karpathy's llm-wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)** — the pattern specification. Intentionally abstract; Karpathy's advice is to hand the gist to your agent and instantiate it together. The gist comments contain notable production extensions (team wikis with PR review gates, verification-status tracking, JSON-Schema structured entities).
- [karpathy's gists index](https://gist.github.com/karpathy) — for related follow-ups.

## GitHub implementations (clone-and-go)

- [NicholasSpisak/second-brain](https://github.com/NicholasSpisak/second-brain) — LLM-maintained personal knowledge base for Obsidian, directly based on the pattern; drop sources in a folder, agent compiles the wiki.
- [supachai-j/llm-wiki-101](https://github.com/supachai-j/llm-wiki-101) — worked example incl. an archived copy of the gist in its own `raw/` layer (nicely self-demonstrating).
- [LLM Wiki v2 gist (rohitg00)](https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2) — extends the pattern with lessons from building agentmemory.
- [eugeniughelbur/obsidian-second-brain](https://github.com/eugeniughelbur/obsidian-second-brain) — cross-CLI *skill* (Claude Code, Codex, Gemini, OpenCode…) with 44 commands: self-rewriting notes, local+hybrid semantic search, scheduled agents that maintain the vault overnight. The most turnkey option in this list.

## Written guides / tutorials

- [Step-by-step guide — The Tool Nerd](https://www.thetoolnerd.com/p/step-by-step-guide-build-your-own-second-brain-obsidian-kaparthy) — full walkthrough, Obsidian + Karpathy pattern.
- [Build an AI Second Brain with Claude Code and Obsidian — MindStudio](https://www.mindstudio.ai/blog/build-ai-second-brain-claude-code-obsidian) and their [Karpathy-specific guide](https://www.mindstudio.ai/blog/andrej-karpathy-llm-wiki-obsidian-ai-second-brain) ("in 1 hour").
- [Karpathy's LLM Wiki Method, Step by Step — Professor Glitch](https://www.askglitch.com/blog/build-a-second-brain)
- [How I Took Karpathy's LLM Wiki and Built an AI-Powered Second Brain — AI Maker](https://aimaker.substack.com/p/llm-wiki-obsidian-knowledge-base-andrej-karphaty)
- [LLM Wiki: 3-Layer Pattern vs RAG — DecodeTheFuture](https://decodethefuture.org/en/llm-wiki-karpathy-pattern/) — the best architectural analysis, incl. scale ceilings.
- [I rebuilt Karpathy's LLM Wiki: what's missing — The AI Operator](https://theaioperator.io/p/i-rebuilt-karpathys-llm-wiki-heres) — useful critical take.
- [Complete Guide to AI-Maintained Knowledge Bases — Starmorph](https://blog.starmorph.com/blog/karpathy-llm-wiki-knowledge-base-guide)
- [LLM Wiki Setup Guide — Kunal Ganglani](https://www.kunalganglani.com/blog/llm-wiki-karpathy-local-knowledge-base)
- [Karpathy's Instructions for an AI-Driven Second Brain — Techstrong.ai](https://techstrong.ai/features/karpathys-instructions-for-building-an-ai-driven-second-brain/) — good conceptual overview.
- [How I Built My Second Brain with Obsidian + Claude Code — Evgeni Rusev](https://medium.com/@evgeni.n.rusev/how-i-built-my-second-brain-with-obsidian-claude-code-9fb54b7665ca) and [Syed Ali Turab's MCP-included version](https://medium.com/@syedturab97/how-i-built-my-second-brain-with-obsidian-and-claude-mcp-included-66bf656a3179) — practitioner writeups with inbox-processing and session-log continuity workflows.
- [From Notes to Knowledge: Claude + Obsidian setup — Towards AI](https://pub.towardsai.net/from-notes-to-knowledge-the-claude-and-obsidian-second-brain-setup-37af4f47486f)

## Videos (all 2026)

- [How To Build An AI Second Brain OS (Claude Code + Obsidian)](https://www.youtube.com/watch?v=C6b1bX1HNg8)
- [Build a Second Brain in Obsidian and Claude Code](https://www.youtube.com/watch?v=zjrSoXtlunU)
- [How To Build The ULTIMATE AI Second Brain (Obsidian + Claude Code)](https://www.youtube.com/watch?v=4l8MXYUqGaA) — includes a free vault template.
- [Claude Code + Obsidian: Build a Second Brain That Actually Learns](https://www.youtube.com/watch?v=XuRfik_tHd4)
- [How To Build Your Second Brain With AI (Claude Code + Obsidian)](https://www.youtube.com/watch?v=IwpqZ5gA0ng)
- [How to Build an AI Second Brain | Obsidian + Claude Code](https://www.youtube.com/watch?v=HHTRAQXQRxM)
- [Obsidian AI Second Brain that ACTUALLY Works! (Codex, Claude Code)](https://www.youtube.com/watch?v=slkO_QAkqlc) — agent-agnostic angle.
- [Build a Second Brain in Obsidian and Codex](https://www.youtube.com/watch?v=zzggJanBCJw) — the OpenAI-CLI variant.

## Trial instructions (recommended path)

1. Read the gist (10 min). 2. Follow The Tool Nerd or MindStudio guide (~1 hr). 3. Alternatively clone `NicholasSpisak/second-brain` or install `eugeniughelbur/obsidian-second-brain` for a pre-built schema. 4. Commit to a 30-day capture habit before judging results — the compounding is the point.
