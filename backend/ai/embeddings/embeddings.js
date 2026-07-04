import {OllamaEmbeddings}from "@langchain/ollama"

const embeddings=new OllamaEmbeddings({
    model:"nomic-embed-text",
    baseUrl:"http://localhost:11434"
});

export const embeddocuments=async(texts)=>{
    return await embeddings.embedDocuments(texts);
}
export const embedquery=async(query)=>{
    return await embeddings.embedQuery(query);
}