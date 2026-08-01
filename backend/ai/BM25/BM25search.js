const {getBM25Retriever}=require("../BM25/BM25indexer")
async function searchBM25(query)
{
  const bm25Retriever=getBM25Retriever();

  const results=await bm25Retriever.invoke(query);

  return results;
}

module.exports={searchBM25};