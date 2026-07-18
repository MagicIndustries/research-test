# Resources: Orchestrated Multi-Agent Pipelines

## Primary — engineering posts and repos

- [How we built our multi-agent research system (Anthropic, June 2025)](https://www.anthropic.com/engineering/multi-agent-research-system) — the canonical primary source: orchestrator–worker architecture, 90.2% internal-eval gain [vendor self-reported], 15× token cost, eight prompt principles, LLM-as-judge rubric, production lessons (checkpoints, tracing, rainbow deployments).
- [langchain-ai/open_deep_research (GitHub)](https://github.com/langchain-ai/open_deep_research) — MIT-licensed supervisor/researcher implementation on LangGraph; configurable models, Tavily default search, MCP support.
- [Open Deep Research (LangChain blog)](https://blog.langchain.com/open-deep-research/) — architecture rationale (brief → supervisor → parallel researchers → one-shot synthesis) and RACE 0.4344 / #6 DeepResearch Bench result (framework-reported).
- [langchain-ai/deep_research_from_scratch (GitHub)](https://github.com/langchain-ai/deep_research_from_scratch) — tutorial repo building the same system stepwise; the fastest way to internalize the pattern.
- [The-Swarm-Corporation/AdvancedResearch (GitHub)](https://github.com/The-Swarm-Corporation/AdvancedResearch) — open reimplementation of Anthropic's pattern on the swarms framework; activity signal for the pattern's spread (quality unverified).

## Primary — academic

- [Deep Research Agents: A Systematic Examination And Roadmap (arXiv:2506.18096)](https://arxiv.org/abs/2506.18096) — taxonomy of single- vs multi-agent DRAs, static vs dynamic workflows, tool-use frameworks; benchmark critique.
- [Deep Research: A Systematic Survey (arXiv:2512.02038)](https://arxiv.org/abs/2512.02038) — four-component decomposition (query planning, information acquisition, memory management, answer generation); prompting/SFT/RL optimization families.

## Secondary — analyses and walkthroughs (label: secondary)

- [How Anthropic Built a Multi-Agent Research System (ByteByteGo)](https://blog.bytebytego.com/p/how-anthropic-built-a-multi-agent) — clear architectural retelling.
- [Langchain Open Deep Research Internals (Bolshchikov)](https://www.bolshchikov.com/p/open-deep-research-internals-a-step) — step-by-step code-level guide to the LangGraph implementation.
- [DeepWiki: open_deep_research workflow](https://deepwiki.com/langchain-ai/open_deep_research/3.1-langgraph-implementation) — auto-generated but useful graph-level documentation.
