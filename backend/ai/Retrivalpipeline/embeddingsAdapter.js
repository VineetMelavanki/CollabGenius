const { Embeddings } = require("@langchain/core/embeddings");
const { embeddedquery } = require("./queryembedding");
const { embeddocuments } = require("../embeddings/embeddings");

class CustomEmbeddings extends Embeddings {
    async embedQuery(text) {
        return await embeddedquery(text);
    }

    async embedDocuments(texts) {
        return await embeddocuments(texts);
    }
}

module.exports = { CustomEmbeddings };
