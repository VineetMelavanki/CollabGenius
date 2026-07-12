const client = require("./chromadb");

async function getcollection() {
    try {
        return await client.getCollection({
            name: "CollabGenius",
        });
    } catch (e) {
        // If collection doesn't exist, create it with explicit empty embedding function
        return await client.createCollection({
            name: "CollabGenius",
            embeddingFunction: {
                generate: () => [] // Dummy function since we provide our own embeddings
            }
        });
    }
}

module.exports = { getcollection };
