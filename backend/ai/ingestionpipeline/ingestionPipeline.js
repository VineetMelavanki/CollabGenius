const { vectoruploads } = require("./vectorupLoader");
const {documentbuilder}=require("../ingestionpipeline/documentBuilder")
const {BM25indexer}=require("../BM25/BM25indexer")
const { initEnsembleRetriever } = require("../Retrivalpipeline/hybridRetriever");
async function ingestionpipeline() {
    try {
        console.log("Fetching source documents...");
        const documents=await documentbuilder();

        if(documents.length===0)
        {
            console.log("No documents found-skipping ingestion");
            return ;
        }
        console.log("Ingesting data into vectordb");
        await vectoruploads(documents);
        console.log("Ingestion pipeline completed successfully");
        console.log("BM25 indexing started...");
        await BM25indexer(documents);
        console.log("BM25 indexing completed");
        console.log("Hybrid ensemble retriever initialization started...");
        await initEnsembleRetriever();
        console.log("Hybrid ensemble retriever initialization completed");
    } catch (error) {
        console.log("Cannot complete ingestion pipeline", error);
        throw error;
    }
}

module.exports = { ingestionpipeline };