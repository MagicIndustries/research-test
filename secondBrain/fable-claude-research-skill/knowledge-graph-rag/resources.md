# Resources — Knowledge-Graph RAG

Star counts and activity checked via the GitHub API on 2026-07-18.

## Repos (primary)

- [microsoft/graphrag](https://github.com/microsoft/graphrag) — 34.5k★, MIT, active. Reference GraphRAG implementation incl. LazyGraphRAG. [Docs & quickstart](https://microsoft.github.io/graphrag/) · [Original paper: "From Local to Global" (arXiv 2404.16130)](https://arxiv.org/abs/2404.16130) · [MS Research blog intro](https://www.microsoft.com/en-us/research/blog/graphrag-unlocking-llm-discovery-on-narrative-private-data/).
- [HKUDS/LightRAG](https://github.com/HKUDS/LightRAG) — 37.8k★, MIT, very active. EMNLP 2025 paper; fast dual-level graph retrieval. [Paper (arXiv 2410.05779)](https://arxiv.org/abs/2410.05779).
- [getzep/graphiti](https://github.com/getzep/graphiti) — 28.8k★, Apache-2.0, very active. Real-time *temporal* knowledge graphs. [Quickstart](https://help.getzep.com/graphiti/graphiti/quick-start) · [Zep paper (arXiv 2501.13956)](https://arxiv.org/abs/2501.13956).
- [neo4j-labs/llm-graph-builder](https://github.com/neo4j-labs/llm-graph-builder) — 5.0k★, Apache-2.0, active. GUI: documents → Neo4j KG + chat. [Hosted demo](https://llm-graph-builder.neo4jlabs.com/) · [Neo4j GraphRAG docs](https://neo4j.com/docs/neo4j-graphrag-python/current/).
- [topoteretes/cognee](https://github.com/topoteretes/cognee) — 28.0k★, Apache-2.0, very active. Document→KG+vector "memory platform" with a pipeline API; sits between this family and agent memory. [Docs](https://docs.cognee.ai).
- [gusye1234/nano-graphrag](https://github.com/gusye1234/nano-graphrag) — 3.9k★, MIT. Minimal hackable GraphRAG — the best codebase to *read* to understand the technique.
- [circlemind-ai/fast-graphrag](https://github.com/circlemind-ai/fast-graphrag) — 3.8k★, MIT. ⚠️ No pushes since Nov 2025; ideas good, maintenance uncertain.

## Articles & analysis

- [GraphRAG and LightRAG in 2026: Knowledge Graphs for AI Agents (CallSphere)](https://callsphere.ai/blog/vw6g-microsoft-graphrag-knowledge-graph-2026) — current cost/accuracy comparison incl. LazyGraphRAG; source of the "GraphRAG for <1M tokens, LightRAG beyond" heuristic.
- [Knowledge Graph vs RAG: When Each One Wins (Atlan, 2026)](https://atlan.com/know/knowledge-graphs-vs-rag-for-ai/) — decision framework; argues for hybrid architectures.
- [Knowledge Base vs Knowledge Graph for LLM Systems (Kloia, 2026)](https://www.kloia.com/blog/knowledge-base-vs-knowledge-graph-llm) — practical guide.
- [Using GraphRAG to enhance LLM-based information retrieval for KM (RealKM, Feb 2026)](https://realkm.com/2026/02/19/using-graphrag-to-enhance-llm-based-information-retrieval-supporting-knowledge-management-km/) — knowledge-management-angle review.

## Recent research (for depth)

- [Knowledge Graph-Guided Retrieval Augmented Generation (arXiv 2502.06864)](https://arxiv.org/pdf/2502.06864)
- [TagRAG: Tag-guided Hierarchical KG RAG (arXiv 2601.05254)](https://arxiv.org/pdf/2601.05254)
- [AtomicRAG: Atom-Entity Graphs for RAG (arXiv 2604.20844)](https://arxiv.org/pdf/2604.20844)

## In this workspace

The locally-installed **GitNexus** MCP tools and **understand-anything** skills already build code/document knowledge graphs — worth trialing on your own corpus before standing up new infrastructure.
