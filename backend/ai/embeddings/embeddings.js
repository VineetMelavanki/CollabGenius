import { OllamaEmbeddings } from "@langchain/ollama";

const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
    baseUrl: "http://localhost:11434",
});

export async function embeddocuments(texts) {
    return embeddings.embedDocuments(texts);
}

export async function embedquery(query) {
    return embeddings.embedQuery(query);
}