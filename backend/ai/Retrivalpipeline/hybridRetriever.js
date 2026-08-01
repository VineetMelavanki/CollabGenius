const { EnsembleRetriever } = require("@langchain/classic/retrievers/ensemble");
const { getBM25Retriever } = require("../BM25/BM25indexer");
const { getVectorRetriever } = require("./vectorRetriever");

let ensembleRetriever = null;

async function initEnsembleRetriever() {
    const bm25Retriever = getBM25Retriever();
    const vectorRetriever = await getVectorRetriever();

    ensembleRetriever = new EnsembleRetriever({
        retrievers: [bm25Retriever, vectorRetriever],
        weights: [0.5, 0.5],
    });

    return ensembleRetriever;
}

function getEnsembleRetriever() {
    if (!ensembleRetriever) {
        throw new Error("Ensemble retriever has not been initialized");
    }
    return ensembleRetriever;
}

module.exports = { initEnsembleRetriever, getEnsembleRetriever };
