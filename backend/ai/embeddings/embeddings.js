const { OllamaEmbeddings } = require("@langchain/ollama");

const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
    baseUrl: "http://localhost:11434",
});

async function embeddocuments(texts) {
    return embeddings.embedDocuments(texts);
}

async function embedquery(query) {
    return embeddings.embedQuery(query);
}

module.exports = { embeddocuments, embedquery };