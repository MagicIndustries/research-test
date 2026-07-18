# Resources — Agent-Managed Memory

Star counts and activity checked via the GitHub API on 2026-07-18.

## Repos & official docs

- [mem0ai/mem0](https://github.com/mem0ai/mem0) — 61.1k★, Apache-2.0, very active. Universal memory layer; hosted platform + OSS. [Docs/quickstart](https://docs.mem0.ai/quickstart) · [Mem0 research paper (arXiv 2504.19413)](https://arxiv.org/abs/2504.19413).
- [getzep/graphiti](https://github.com/getzep/graphiti) — 28.8k★, Apache-2.0, very active. Temporal KG memory engine behind Zep. [Quickstart](https://help.getzep.com/graphiti/graphiti/quick-start) · [Zep paper (arXiv 2501.13956)](https://arxiv.org/abs/2501.13956) · [Zep platform](https://www.getzep.com).
- [letta-ai/letta](https://github.com/letta-ai/letta) — 23.8k★, Apache-2.0, active. Stateful-agents platform descended from MemGPT. [Docs](https://docs.letta.com) · [MemGPT paper (arXiv 2310.08560)](https://arxiv.org/abs/2310.08560).
- [topoteretes/cognee](https://github.com/topoteretes/cognee) — 28.0k★, Apache-2.0, very active. KG+vector memory pipelines. [Docs](https://docs.cognee.ai).
- [Anthropic: memory & context management docs](https://docs.anthropic.com/en/docs/build-with-claude/memory) — first-party pattern for file-based memory with the Claude API memory tool.
- [Anthropic: Claude memory announcement](https://www.anthropic.com/news/memory) — consumer-side Claude memory.
- [OpenAI: ChatGPT Memory FAQ](https://help.openai.com/en/articles/8590148-memory-faq) — how ChatGPT's auto-memory works and its controls.
- [LangMem (LangChain)](https://langchain-ai.github.io/langmem/) — memory utilities if you're already in the LangGraph ecosystem.

## Comparisons & testing (2026)

- [AI Agent Memory 2026 — Comparing Mem0, Zep, Graphiti, Letta, LangMem (Medium)](https://medium.com/@wasowski.jarek/i-compared-5-ai-agent-memory-systems-across-6-dimensions-none-wins-6a658335ed0a) — six-dimension comparison; conclusion "none wins."
- [Agent Memory Frameworks Tested: Mem0 vs Zep vs Letta vs cognee (Particula)](https://particula.tech/blog/agent-memory-frameworks-tested-mem0-zep-letta-cognee-2026) — hands-on benchmark including the LongMemEval numbers cited in the overview.
- [Survey of AI Agent Memory Frameworks (Graphlit)](https://www.graphlit.com/blog/survey-of-ai-agent-memory-frameworks) — taxonomy of the whole space (memory vs context).
- [AI Agent Memory Systems in 2026 (Dev Genius)](https://blog.devgenius.io/ai-agent-memory-systems-in-2026-mem0-zep-hindsight-memvid-and-everything-in-between-compared-96e35b818da8) — broader sweep incl. newer entrants (Hindsight, Memvid).
- [Best AI Agent Memory Providers in 2026 (Developers Digest)](https://www.developersdigest.tech/blog/best-ai-agent-memory-providers-2026) — hosted-provider angle (incl. Cloudflare).

## Benchmarks (what the numbers mean)

- [LOCOMO](https://github.com/snap-research/locomo) — long-conversation memory QA; the benchmark behind Mem0's headline numbers.
- [LongMemEval (arXiv 2410.10813)](https://arxiv.org/abs/2410.10813) — time-anchored long-term memory eval where temporal graphs (Zep) lead.

## The file-based pattern

- [Karpathy's llm-wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — the maximal version of file-based agent memory (see [../llm-generated-wikis/](../llm-generated-wikis/overview.md)).
- [Claude Code memory docs](https://docs.anthropic.com/en/docs/claude-code/memory) — `CLAUDE.md` hierarchy and auto-memory as shipped in the CLI you may already be using.
