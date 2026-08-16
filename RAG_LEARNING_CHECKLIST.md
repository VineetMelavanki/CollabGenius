# RAG + LangChain Learning Checklist for CollabGenius

## Phase 1: Understanding Your Current Pipeline (Week 1)
Essential for knowing what you have before optimizing.

- [ ] **Embeddings fundamentals**
  - How embeddings represent text as vectors
  - Why cosine similarity measures relevance
  - How your Ollama + nomic-embed-text model works
  - Action: Test embedding identical vs different queries

- [ ] **Vector databases basics**
  - Collections, metadata, IDs in ChromaDB
  - Add vs upsert vs update
  - Similarity search and top-k retrieval
  - Action: Query your ChromaDB manually, understand metadata filtering

- [ ] **Your ingestion flow**
  - How profiles and projects become Documents
  - Why metadata matters (userId, ownerId, type)
  - Current data structure: what info is lost?
  - Action: Print raw documents before embedding

---

## Phase 2: Quick Wins with Chunking (Week 2)
**Most impactful change for retrieval quality.**

- [ ] **Text chunking concepts**
  - Why splitting long text improves retrieval
  - Chunk size vs overlap tradeoffs
  - How chunking affects retrieval quality
  - Action: Read one blog post on chunking

- [ ] **LangChain RecursiveCharacterTextSplitter**
  - How to use it
  - Why recursive splitting preserves meaning better
  - Tuning chunk size and overlap for your data
  - Action: Install @langchain/textsplitters and test it

- [ ] **Apply to your documentBuilder.js**
  - Split project descriptions into chunks
  - Keep profile info as single chunks (likely too short to split)
  - Preserve metadata through chunking
  - Action: Refactor documentBuilder.js to use splitter

- [ ] **Test retrieval quality improvement**
  - Compare results with/without chunking
  - Observe if relevance improves
  - Action: Run 5 test queries, compare top results

---

## Phase 3: Better Metadata & Filtering (Week 3)
**Often overlooked but dramatically improves accuracy.**

- [ ] **Metadata design**
  - What fields make retrieval more accurate?
  - Filtering capabilities (type, userId, status)
  - Hierarchical metadata (project → members → skills)
  - Action: Review your current metadata in ChromaDB

- [ ] **Filtering and search strategies**
  - Exact match vs semantic + filter
  - How to use metadata filters in ChromaDB queries
  - When to filter before vs after retrieval
  - Action: Add type-based filtering to your retrieval

- [ ] **Improve your fetchProfiles and fetchProjects**
  - Add more useful fields (createdAt, lastUpdated, tags)
  - Consider denormalization for faster embedding
  - Action: Add 2-3 more fields to improve document richness

- [ ] **Better document formatting in documentBuilder.js**
  - Structured text for better semantic understanding
  - Markdown-style formatting for clarity
  - Action: Improve pageContent formatting

---

## Phase 4: Hybrid Retrieval & Reranking (Week 4)
**Advanced retrieval: combine vector + keyword search.**

- [ ] **Hybrid search concept**
  - Why BM25 + vector search is often better than just vectors
  - Recall vs precision tradeoffs
  - Alpha weighting between hybrid sources
  - Action: Read one article on hybrid search

- [ ] **Reranking results**
  - Why top-5 might not be best-5
  - Simple reranking strategies
  - Using semantic similarity for reranking
  - Action: Add basic reranking to your retrieval

- [ ] **Query expansion & rewriting**
  - Your current queryProcessor is too simple
  - Query expansion techniques
  - Multi-query retrieval
  - Action: Enhance queryProcessor.js

- [ ] **Implement in retrivalpipeline.js**
  - Add reranking before sending to Ollama
  - Filter by relevance threshold
  - Action: Modify retrivalpipeline.js with reranking

---

## Phase 5: Prompt Engineering for Your Use Case (Week 5)
**How to extract better answers from Ollama.**

- [ ] **Context assembly best practices**
  - Optimal context length for Ollama
  - Token counting
  - What information to prioritize
  - Action: Analyze your current Prompt in CreatePrompt.js

- [ ] **Few-shot examples**
  - Adding examples to your prompt
  - Making the expected JSON output clearer
  - Action: Improve your CreatePrompt template

- [ ] **Structured output handling**
  - Your code expects JSON; make it more robust
  - Error handling for invalid JSON
  - Fallback responses
  - Action: Add JSON validation to retrieval response

- [ ] **Test different prompt templates**
  - Does the assistant role matter?
  - How much context is too much?
  - Action: Run A/B tests with Ollama

---

## Phase 6: LangChain Integration (Week 6)
**Now solidify everything with LangChain abstractions.**

- [ ] **LangChain Document class**
  - Already using it, but understand it deeper
  - Document and field structure
  - Action: Review @langchain/core/documents

- [ ] **LangChain text splitters**
  - RecursiveCharacterTextSplitter
  - MarkdownTextSplitter (if switching to markdown docs)
  - Action: Replace your chunking with LangChain splitter

- [ ] **LangChain embeddings wrapper**
  - Already using OllamaEmbeddings
  - Understand embedding caching
  - Action: No change needed, already correct

- [ ] **LangChain retrieval chains**
  - RetrievalQA concept
  - How to compose retrieval + generation
  - Action: Consider refactoring retrivalpipeline into LangChain chain

- [ ] **LangChain prompts**
  - PromptTemplate instead of string templates
  - ChatPromptTemplate for multi-turn
  - Action: Refactor CreatePrompt.js to use PromptTemplate

---

## Phase 7: Incremental Ingestion & Cleanup (Week 7)
**Make ingestion robust and not redundant.**

- [ ] **Idempotent ingestion**
  - Detecting duplicates before embedding
  - Upsert vs add in ChromaDB
  - Action: Add deduplication to vectorupLoader.js

- [ ] **Incremental updates**
  - Only re-embed changed profiles/projects
  - Tracking update timestamps
  - Action: Add lastUpdated field to models

- [ ] **Error recovery**
  - What if embedding fails mid-pipeline?
  - Partial ingestion rollback
  - Action: Add retry logic to ingestionPipeline.js

- [ ] **Cleanup old data**
  - Removing deleted profiles/projects from vector DB
  - Maintenance scripts
  - Action: Create cleanup script

---

## Phase 8: Evaluation & Metrics (Week 8)
**How to know if you're actually improving.**

- [ ] **Precision @ k**
  - Are top-5 results relevant?
  - Action: Manual evaluation of 10 queries

- [ ] **Recall @ k**
  - Are you missing important results?
  - Action: Manual evaluation of 10 queries

- [ ] **Latency metrics**
  - How fast is ingestion?
  - How fast is retrieval?
  - Action: Add timing logs to both pipelines

- [ ] **Quality scoring**
  - Does retrieved context help Ollama give better answers?
  - Human evaluation
  - Action: Create test suite of 20 queries with expected results

---

## Priority Order (Start Here)

### Immediate (This Week)
1. **Phase 2: Chunking** ← Most bang for buck
2. **Phase 3: Metadata** ← Quick to implement

### Next 2 Weeks
3. **Phase 4: Reranking** ← Noticeable quality improvement
4. **Phase 5: Prompt tweaking** ← Small tweaks, big impact

### After That
5. **Phase 6: LangChain solidification** ← Cleanup & best practices
6. **Phase 7: Robustness** ← Incremental, cleanup, recovery
7. **Phase 8: Evaluation** ← Measure what actually improved

---

## Files to Focus On (In Priority Order)

1. **[backend/ai/ingestionpipeline/documentBuilder.js](backend/ai/ingestionpipeline/documentBuilder.js)** ← Add chunking here first
2. **[backend/ai/Retrivalpipeline/retrivalpipeline.js](backend/ai/Retrivalpipeline/retrivalpipeline.js)** ← Add reranking + filtering
3. **[backend/ai/Retrivalpipeline/CreatePrompt.js](backend/ai/Retrivalpipeline/CreatePrompt.js)** ← Improve template
4. **[backend/ai/Retrivalpipeline/Queryprocess.js](backend/ai/Retrivalpipeline/Queryprocess.js)** ← Enhance normalization
5. **[backend/ai/ingestionpipeline/vectorupLoader.js](backend/ai/ingestionpipeline/vectorupLoader.js)** ← Add idempotency

---

## Success Criteria

By end of Phase 5 (after 1 month), you should see:
- Retrieval returns more relevant results
- Ollama generates more accurate responses
- Ingestion/retrieval latency is acceptable
- No duplicate data in ChromaDB

By end of Phase 8, you should have:
- Measurable quality metrics
- Robust error handling
- Incremental update capability
- Clear understanding of your RAG bottlenecks
