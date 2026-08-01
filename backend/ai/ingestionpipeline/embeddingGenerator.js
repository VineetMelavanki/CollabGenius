const { embeddocuments } = require("../embeddings/embeddings");

async function generateembeddings(documents) {
    if(!documents || documents.length===0)
    {
        throw new Error("generateembeddings requires a non empty documents array");
    }
    const texts=documents.map(doc=>doc.pageContent);
    const vectors = await embeddocuments(texts);
    return vectors;
}

module.exports = { generateembeddings };