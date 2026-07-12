const { embedquery } = require("../embeddings/embeddings");

async function embeddedquery(query) {
    console.log("Entering embeddings");
    const vector = await embedquery(query);
    console.log("Embeddings stores successfully");
    console.log(vector);
    return vector;
}

module.exports = { embeddedquery };

