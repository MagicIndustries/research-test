# Knowledge Graphs & GraphRAG — Resources

## Core repos

- [microsoft/graphrag](https://github.com/microsoft/graphrag) — reference GraphRAG implementation + [docs site](https://microsoft.github.io/graphrag/)
- [HKUDS/LightRAG](https://github.com/hkuds/lightrag) — EMNLP 2025; graph+vector dual-layer, incremental updates
- [gusye1234/nano-graphrag](https://github.com/gusye1234/nano-graphrag) — minimal hackable GraphRAG
- [neo4j-labs/llm-graph-builder](https://github.com/neo4j-labs/llm-graph-builder) — no-code KG construction ([hosted app](https://llm-graph-builder.neo4jlabs.com/))
- [DEEP-PolyU/Awesome-GraphRAG](https://github.com/DEEP-PolyU/Awesome-GraphRAG) — curated surveys, papers, benchmarks, projects — **the** literature index for this space

## Personal/second-brain graph projects

- [Jallermax/knowledge-nexus](https://github.com/Jallermax/knowledge-nexus) — Notion/Pocket → Neo4j GraphRAG second brain
- [M0nkeyFl0wer/second-brain-hybrid-graph](https://github.com/M0nkeyFl0wer/second-brain-hybrid-graph) — local-first hybrid graph-RAG (DuckDB, Ollama, NetworkX)
- [raold/second-brain](https://github.com/raold/second-brain) — fully local multimodal (pgvector, LLaVA, CLIP)
- [violettance/second_brain](https://github.com/violettance/second_brain) — AI notes + dynamic KG visualization
- [cristianleoo/rag-knowledge-graph](https://github.com/cristianleoo/rag-knowledge-graph) — tutorial repo

## Courses and tutorials

- **[Neo4j GraphAcademy: Building Knowledge Graphs with LLMs](https://graphacademy.neo4j.com/courses/llm-knowledge-graph-construction/)** — free, hands-on, includes customizing the data model and Cypher querying.
- [Intro to the Neo4j LLM Knowledge Graph Builder — Neo4j blog](https://neo4j.com/blog/developer/llm-knowledge-graph-builder/) · [Labs page](https://neo4j.com/labs/genai-ecosystem/llm-graph-builder/) · [neo4j-graphrag-python KG Builder guide](https://neo4j.com/docs/neo4j-graphrag-python/current/user_guide_kg_builder.html)
- [Creating Knowledge Graphs from Unstructured Data — Neo4j developer guide](https://neo4j.com/developer/genai-ecosystem/importing-graph-from-unstructured-data/)
- [Step-by-step Neo4j KG for RAG — Pondhouse Data](https://www.pondhouse-data.com/blog/create-knowledge-graph-with-neo4j)
- [Neo4j LLM Knowledge Graph Builder DEMO — YouTube](https://www.youtube.com/watch?v=LlNy5VmV290)

## Analyses and comparisons

- [GraphRAG vs LightRAG — Maarga Systems](https://www.maargasystems.com/2025/05/12/understanding-graphrag-vs-lightrag-a-comparative-analysis-for-enhanced-knowledge-retrieval/)
- [5 Best Open Source Graph RAG Tools (2026) — TypeGraph](https://typegraph.ai/blog/best-open-source-graph-rag-tools)
- [12 Best GraphRAG Alternatives (2025) — Sider](https://sider.ai/blog/ai-tools/best-graphrag-alternatives-to-try-in-2025)
- [nano-graphrag breakdown — Go Nam Lui](https://gonamlui.com/blog/brief-breakdown-of-nano-graphrag-a-lightweight-alternative-to-graphrag)

## Trial instructions

**Zero-code taste (~30 min):** create a free Neo4j Aura instance → open the [hosted graph builder](https://llm-graph-builder.neo4jlabs.com/) → upload 3–5 PDFs or paste article URLs → build with your preferred LLM → explore the graph visually, then take the GraphAcademy course to learn Cypher queries over it.

**Code path (~2 hrs):** `pip install lightrag-hku` → follow the LightRAG README quickstart against a folder of your markdown notes (works with OpenAI/Anthropic/Ollama) → compare `local` vs `global` vs `hybrid` query modes on a question that spans several notes.

**Understanding path (an evening):** read nano-graphrag's source top-to-bottom with the breakdown article beside it.
