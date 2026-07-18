# Agent Memory Layers — Resources

All links accessed 2026-07-18; stars verified that day where noted.

## GitHub repos

- **mem0ai/mem0** — ~61.1k stars (verified), Apache-2.0. Universal memory layer: `pip install mem0ai`; vector+KV+graph hybrid storage; multi-level memory; April 2026 ADD-only algorithm with LoCoMo/LongMemEval/BEAM results. https://github.com/mem0ai/mem0 ; research: https://mem0.ai/research ; LLM-facing docs: https://github.com/mem0ai/mem0/blob/main/LLM.md
- **letta-ai/letta** (formerly MemGPT) — agent runtime with tiered memory (core/recall/archival). https://github.com/letta-ai/letta ; site: https://www.letta.com
- **getzep/graphiti** — temporal knowledge-graph memory engine behind Zep. https://github.com/getzep/graphiti
- **basicmachines-co/basic-memory** — local-first MCP memory as Obsidian-compatible markdown; `write_note`/`search_notes`/`build_context`. https://github.com/basicmachines-co/basic-memory ; docs: https://docs.basicmemory.com/welcome
- **basicmachines-co/basic-memory-skills** — reflection/defragmentation skills for AI memory management. https://github.com/basicmachines-co/basic-memory-skills
- **basicmachines-co/basic-memory-plugins** — official Claude Code plugins for knowledge management. https://github.com/basicmachines-co/basic-memory-plugins
- **NirDiamant/Agent_Memory_Techniques** — 30 runnable Jupyter notebooks: conversation buffers, vector stores, knowledge graphs, episodic/semantic memory, MemGPT, Mem0, Letta, Zep, Graphiti, LoCoMo benchmarking, production patterns. The best hands-on curriculum in the space. https://github.com/NirDiamant/Agent_Memory_Techniques
- **TeleAI-UAGI/Awesome-Agent-Memory** — curated systems/benchmarks/papers list for LLM memory. https://github.com/TeleAI-UAGI/Awesome-Agent-Memory
- **aexy-io/graphzep** — TypeScript Zep-paper implementation. https://github.com/aexy-io/graphzep

## Papers & benchmarks

- MemGPT paper (the origin of tiered agent memory): https://arxiv.org/abs/2310.08560
- Zep temporal-KG memory paper: https://arxiv.org/abs/2501.13956
- Mem0 reproducible benchmarks (vendor-published): https://mem0.ai/research

## Comparisons & articles

- Vectorize, "Mem0 vs Letta (MemGPT): AI Agent Memory Compared (2026)" — layer-vs-runtime distinction. https://vectorize.io/articles/mem0-vs-letta
- Vectorize, "Mem0 vs Zep (Graphiti): AI Agent Memory Compared (2026)." https://vectorize.io/articles/mem0-vs-zep
- Atlan, "Best AI Agent Memory Frameworks in 2026: Compared and Ranked." https://atlan.com/know/best-ai-agent-memory-frameworks-2026/
- Daily Dose of DS, "[Hands-on] Build an AI Agent With Human-like Memory" — Graphiti walkthrough. https://blog.dailydoseofds.com/p/hands-on-build-an-ai-agent-with-human
- MCP.Directory, "Claude Code Memory MCP Servers (2026)" — survey of memory MCP options. https://mcp.directory/blog/claude-code-memory-mcp-servers-2026
- TensorBlock awesome-mcp-servers, knowledge-management & memory section. https://github.com/TensorBlock/awesome-mcp-servers/blob/main/docs/knowledge-management--memory.md
- OpenTechHub, "Mem0: Strategic Open Source Memory Layer for AI Agents." https://www.opentechhub.io/mem0/

## Related directories

- Temporal graph details: [../knowledge-graphs/](../knowledge-graphs/README.md)
- Basic Memory as a human-readable vault: [../obsidian-ai/](../obsidian-ai/README.md), [../llm-wiki/](../llm-wiki/README.md)
