const { BM25Retriever } = require("@langchain/community/retrievers/bm25");
let bm25Retriever=null;
async function BM25indexer(documents){
   if(!documents || documents.length===0)
   {
    throw new Error("BM25index requires a non empty documents array");
   }
   bm25Retriever=BM25Retriever.fromDocuments(documents,{
    k:5
   });
   return bm25Retriever;

}

function getBM25Retriever(){
    if(!bm25Retriever)
    {
        throw new Error(
            "BM25 retriever has not been initialized",
        );
    }
    return bm25Retriever;
}
module.exports={BM25indexer,getBM25Retriever};