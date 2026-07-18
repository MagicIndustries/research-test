# Knowledge-Graph-Based Approaches (GraphRAG, LightRAG, temporal KGs)

Instead of (or alongside) vector similarity, these systems have an LLM **extract entities and relationships** from your documents into a graph, then answer questions by traversing structure. The payoff: multi-hop reasoning ("how does X relate to Z via Y?") and corpus-level questions ("what are the main themes across everything I've saved?") that plain RAG fumbles.

## The core techniques

**[Microsoft GraphRAG](https://github.com/microsoft/graphrag)** (34.5k★, MIT, active). The reference implementation: LLM extracts an entity/relation graph from text → community-detection clusters entities into thematic groups → LLM writes a summary of each community → queries run at entity level ("local") or corpus level ("global") over these summaries ([project page](https://microsoft.github.io/graphrag/), [research paper](https://arxiv.org/abs/2404.16130)). Powerful but token-hungry at indexing time; **LazyGraphRAG** (in the same repo) defers summarization to query time, cutting indexing cost dramatically.

**[LightRAG](https://github.com/HKUDS/LightRAG)** (37.8k★, MIT, EMNLP 2025). The pragmatic middle ground: extracts entities/relations with short descriptions, then serves fast dual-level (local+global) retrieval. Far cheaper to index than full GraphRAG; the trade-off is shallower structure — retrieval leans on similarity over graph elements, so deeply relational questions can come back fragmentary ([2026 comparison](https://callsphere.ai/blog/vw6g-microsoft-graphrag-knowledge-graph-2026)). Rule of thumb from that comparison: GraphRAG shines on modest corpora with heavy cross-referencing; LightRAG wins on cost as the corpus grows.

**Temporal knowledge graphs — [Graphiti](https://github.com/getzep/graphiti)** (28.8k★, Apache-2.0, by Zep). Builds a *real-time, time-aware* KG: every fact carries validity intervals, so the graph can answer "what did I believe in March?" and handle facts that change (job, address, opinions) without corruption — the property a longitudinal *personal* brain actually needs. Doubles as agent memory (see [agent-memory-systems](../agent-memory-systems/overview.md)).

**Graph construction tooling — [Neo4j LLM Graph Builder](https://github.com/neo4j-labs/llm-graph-builder)** (5k★, Apache-2.0): point-and-click PDFs/web pages/YouTube → Neo4j knowledge graph with a chat interface; the easiest way to *see* your corpus as a graph. Also notable: [cognee](https://github.com/topoteretes/cognee) (28k★, Apache-2.0), which pipelines documents → embeddings + KG and markets itself as "memory for agents"; [nano-graphrag](https://github.com/gusye1234/nano-graphrag) (3.9k★, MIT) — a hackable ~1k-line GraphRAG for learning the internals; [fast-graphrag](https://github.com/circlemind-ai/fast-graphrag) (3.8k★, MIT, ⚠️ quiet since Nov 2025).

## Where this fits a second brain

Honest assessment: KG-RAG is **infrastructure, not a note-taking practice**. As of mid-2026 nobody ships a polished "personal GraphRAG app" — you run these over an existing corpus (your vault, bookmarks, journals) to get better question-answering, or you adopt a tool that embeds the technique (Zep/Graphiti under an agent; Khoj and AnythingLLM remain vector-first). The 2026 production consensus is *hybrid*: vectors + graph traversal + structured lookup together ([Atlan](https://atlan.com/know/knowledge-graphs-vs-rag-for-ai/), [Kloia](https://www.kloia.com/blog/knowledge-base-vs-knowledge-graph-llm)).

## Trade-offs

**Strengths**
- Best-in-class for multi-hop and thematic/corpus-level questions; answers reflect *structure*, not just proximity.
- The graph itself is inspectable — you can browse what the system believes.
- Temporal variants model change over time, which vectors fundamentally don't.

**Weaknesses**
- Indexing cost: full GraphRAG can burn many dollars of tokens on a modest corpus (hence Lazy/Light variants).
- Extraction quality varies; garbage entities pollute the graph silently.
- DIY territory: expect Python, config files, and evaluation work. No turnkey personal product yet.

## Who it's for

Developers/researchers whose corpus is rich in entities and relationships (research fields, competitive landscapes, people networks) and who ask *analytical* questions of it — or anyone whose plain-RAG assistant keeps failing multi-hop questions.

## Getting started (concrete)

1. **Feel the idea first**: load 10 PDFs into [Neo4j LLM Graph Builder's hosted demo](https://llm-graph-builder.neo4jlabs.com/) and browse the resulting graph.
2. **Cheap real setup**: `pip install lightrag-hku`, index a folder of Markdown, compare its answers to your current RAG on the same 10 questions ([repo quickstart](https://github.com/HKUDS/LightRAG)).
3. **Full GraphRAG**: follow the [official quickstart](https://microsoft.github.io/graphrag/get_started/) on a *small* corpus first and watch token spend; try LazyGraphRAG mode.
4. **Longitudinal personal memory**: run [Graphiti's quickstart](https://help.getzep.com/graphiti/graphiti/quick-start) with Neo4j via Docker and feed it dated journal entries; query point-in-time facts.
