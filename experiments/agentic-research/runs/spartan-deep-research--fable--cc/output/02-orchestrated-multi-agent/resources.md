# Resources: Orchestrated Multi-Agent Pipelines

## Primary

- [Anthropic: How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) — 2025-06-13. The canonical engineering account: orchestrator–worker, 90.2% gain, 15× tokens, 8 prompting principles, rubric-based LLM-judge eval. Vendor engineering but with concrete internal measurements; the single most load-bearing document for this approach.
- [LangChain blog: Open Deep Research](https://www.langchain.com/blog/open-deep-research) — 2025. Scope/research/report phases, supervisor pattern, why parallel section-writing failed, context engineering for token costs.
- [langchain-ai/open_deep_research](https://github.com/langchain-ai/open_deep_research) — MIT, ~12k stars. Runnable reference; configurable model roles, Tavily/native search/MCP; self-reported RACE 0.4943 (GPT-5) on Deep Research Bench. Legacy folder preserves the older plan-and-execute and multi-agent variants — useful comparative reading.
- [langchain-ai/deep_research_from_scratch](https://github.com/langchain-ai/deep_research_from_scratch) — tutorial repo that builds the architecture step by step; companion [LangChain Academy course](https://academy.langchain.com/courses/deep-research-with-langgraph/).
- [SkyworkAI/DeepResearchAgent](https://github.com/SkyworkAI/DeepResearchAgent) — hierarchical planner over specialized lower-level agents; generalizes the pattern beyond research.
- [arXiv:2506.18096 — Deep Research Agents: A Systematic Examination and Roadmap](https://arxiv.org/abs/2506.18096) — academic framing of single- vs multi-agent DR architectures, API vs browser retrieval, tool use, and training paradigms.

## Secondary

- [ByteByteGo: How Anthropic built a multi-agent research system](https://blog.bytebytego.com/p/how-anthropic-built-a-multi-agent) — clear walkthrough/diagrams of the Anthropic post.
- [Shrivu Shankar: Building Multi-Agent Systems (Part 2)](https://blog.sshh.io/p/building-multi-agent-systems-part) — practitioner counterpoints on when multi-agent is overkill.
- [The AI Engineer: Anthropic's multi-agent research architecture explained](https://theaiengineer.substack.com/p/how-anthropic-built-multi-agent-deep) — secondary explainer.
- [ZenML LLMOps database: Anthropic multi-agent case study](https://www.zenml.io/llmops-database/building-a-multi-agent-research-system-for-complex-information-tasks) — production-lens summary.
- [MindStudio: the /deep research command in Claude Code](https://www.mindstudio.ai/blog/what-is-deep-research-command-claude-code) — community pattern of parallel subagent research inside Claude Code; error-compounding argument.

## Video / course

- [LangChain Academy: Deep Research with LangGraph](https://academy.langchain.com/courses/deep-research-with-langgraph/) — hands-on build of the supervisor architecture (vendor course, free).
