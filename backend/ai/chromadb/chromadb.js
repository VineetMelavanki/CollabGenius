const { ChromaClient } = require("chromadb");

const client = new ChromaClient({
    host: "localhost",
    port: 8001,
    ssl: false,
});

module.exports = client;