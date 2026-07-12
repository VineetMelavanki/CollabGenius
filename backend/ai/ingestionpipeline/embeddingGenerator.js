const { embeddocuments } = require("../embeddings/embeddings");
const { documentbuider } = require("../ingestionpipeline/documentBuilder");

async function generateembeddings() {
    const documents = await documentbuider();
    const texts = documents.map(doc => doc.pageContent);
    const vectors = await embeddocuments(texts);
    
    return {
        documents,
        vectors
    };
}

module.exports = { generateembeddings };