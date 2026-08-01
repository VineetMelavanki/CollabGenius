const { generateembeddings } = require("../ingestionpipeline/embeddingGenerator");
const { getcollection } = require("../chromadb/getcollection");

async function vectoruploads(documents) {
    try {
        const vectors= await generateembeddings(documents);
        
        if (documents.length === 0) {
            console.log("No documents found to embed");
            return;
        }
        
        const ids = documents.map(doc => doc.metadata.id);
        const texts = documents.map(doc => doc.pageContent);
        const metadatas = documents.map(doc => doc.metadata);
    
        const collection = await getcollection();
        await collection.add({
            ids,
            embeddings: vectors,
            documents: texts,
            metadatas,
        });

        console.log("Vectors uploaded successfully:", documents.length, "documents embedded");
    } catch (error) {
        console.log("Error uploading vectors", error);
        throw error;
    }
}

module.exports = { vectoruploads };
