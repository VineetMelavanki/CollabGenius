const client = require("./chromadb");

async function getcollection() {
    // Try to get collection first, create if not exists
    try {
        return await client.getCollection({ name: "CollabGenius" });
    } catch (error) {
        // Collection doesn't exist, create it without specifying embedding function (we provide our own)
        return await client.createCollection({ name: "CollabGenius" });
    }
}

module.exports = { getcollection };
