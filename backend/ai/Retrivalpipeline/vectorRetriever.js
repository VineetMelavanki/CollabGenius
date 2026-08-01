const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { CustomEmbeddings } = require("./embeddingsAdapter");

async function getVectorRetriever() {
    const vectorStore = await Chroma.fromExistingCollection(
        new CustomEmbeddings(),
        {
            collectionName: "CollabGenius",
            url: "http://localhost:8001",
        }
    );
    return vectorStore.asRetriever({ k: 5 });
}

module.exports = { getVectorRetriever };
