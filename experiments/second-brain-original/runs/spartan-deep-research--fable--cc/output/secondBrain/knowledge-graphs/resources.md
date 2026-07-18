# Knowledge Graphs & GraphRAG — Resources

All links accessed 2026-07-18; stars verified that day where noted.

## GitHub repos

- **microsoft/graphrag** — reference graph-RAG system; CLI (`init`/`index`/`query`), Local/Global/DRIFT/Basic search. https://github.com/microsoft/graphrag
- **HKUDS/LightRAG** — ~37.8k stars (verified), MIT, EMNLP 2025. Graph+vector dual-layer RAG, ~10x cheaper than GraphRAG, server + Web UI + API, many storage backends, Docker. https://github.com/HKUDS/LightRAG
- **getzep/graphiti** — temporal knowledge graphs for agent memory; fact validity windows, provenance. https://github.com/getzep/graphiti
- **neo4j-labs/llm-graph-builder** — visual KG construction from PDFs/web/YouTube via LLMs into Neo4j; local Docker deploy. https://github.com/neo4j-labs/llm-graph-builder
- **Jallermax/knowledge-nexus** — GraphRAG for second brains / PKM corpora. https://github.com/Jallermax/knowledge-nexus
- **junhewk/simple-graph-builder** — Obsidian plugin: LLM entity extraction + graph + RAG search in-vault. https://github.com/junhewk/simple-graph-builder
- **DEEP-PolyU/Awesome-GraphRAG** — curated list of GraphRAG surveys, papers, benchmarks, projects. https://github.com/DEEP-PolyU/Awesome-GraphRAG
- **ChristopherLyon/graphrag-workbench** — interactive 3D visualization of GraphRAG output graphs. https://github.com/ChristopherLyon/graphrag-workbench
- **aexy-io/graphzep** — TypeScript implementation of the Zep temporal-KG memory paper. https://github.com/aexy-io/graphzep

## Papers

- Zep: "A Temporal Knowledge Graph Architecture for Agent Memory" (Jan 2025). https://arxiv.org/abs/2501.13956
- "Knowledge Graph-Guided Retrieval Augmented Generation" (Feb 2025). https://arxiv.org/pdf/2502.06864
- "GraphRAG-Router: Learning Cost-Efficient Routing over GraphRAGs and LLMs with RL" (2026). https://arxiv.org/pdf/2604.16401
- "PersonalAI 2.0: Enhancing knowledge graph traversal/retrieval with planning for Personalized LLM Agents" (2026). https://arxiv.org/pdf/2605.13481

## Documentation & official guides

- GraphRAG docs home + getting started: https://microsoft.github.io/graphrag/ ; https://microsoft.github.io/graphrag/get_started/
- GraphRAG local search notebook: https://microsoft.github.io/graphrag/examples_notebooks/local_search/
- Microsoft Research project page: https://www.microsoft.com/en-us/research/project/graphrag/
- Microsoft Research announcement blog: https://www.microsoft.com/en-us/research/blog/graphrag-new-tool-for-complex-data-discovery-now-on-github/
- Neo4j LLM Knowledge Graph Builder guide: https://neo4j.com/labs/genai-ecosystem/llm-graph-builder/ ; hosted app: https://llm-graph-builder.neo4jlabs.com/
- Neo4j blog: "LLM knowledge graph builder — first release of 2025." https://neo4j.com/blog/developer/llm-knowledge-graph-builder-release/
- Neo4j blog: "Graphiti: Knowledge graph memory for an agentic world." https://neo4j.com/blog/developer/graphiti-knowledge-graph-memory/

## Articles & tutorials

- Claudiu Branzan (Medium), "From LLMs to Knowledge Graphs: Building Production-Ready Graph Systems in 2025" — hybrid routing, LazyGraphRAG cost data, agentic Graph RAG trend. https://medium.com/@claudiubranzan/from-llms-to-knowledge-graphs-building-production-ready-graph-systems-in-2025-2b4aff1ec99a
- Kloia, "Knowledge Base vs Knowledge Graph for LLM Systems (2026 Guide)" — when a graph is and isn't worth it. https://www.kloia.com/blog/knowledge-base-vs-knowledge-graph-llm
- DEV Community, "LightRAG Tutorial: A Practical Guide to Knowledge Graph-Based RAG." https://dev.to/therabbithole/lightrag-tutorial-a-practical-guide-to-knowledge-graph-based-rag-4oa0
- Pankaj (Medium), "LightRAG: When Our RAG Pipeline Needs a Knowledge Graph." https://medium.com/@pankaj_pandey/lightrag-when-our-rag-pipeline-needs-a-knowledge-graph-85cddaaec41a
- Pelin Balci (Medium), "Understanding GraphRAG Through Hands-On Implementation." https://medium.com/@balci.pelin/understanding-graphrag-ef62fe357571
- npiedy, "One Note at a Time: Turning Notes Into a Personal Jarvis" — custom Obsidian -> Neo4j -> MCP pipeline (EMMA/CLARA). https://www.npiedy.com/building-second-brain-with-ai/

## Deployment shortcuts

- LightRAG one-click deploy on Railway: https://railway.com/deploy/light-rag

## Related directories

- Temporal graphs as agent memory: [../memory-layers/](../memory-layers/README.md)
- The wiki alternative to graph pre-compilation: [../llm-wiki/](../llm-wiki/README.md)
