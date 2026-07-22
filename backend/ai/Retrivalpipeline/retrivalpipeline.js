const { getcollection } = require("../chromadb/getcollection");
const { buildcontext } = require("./Buildcontext");
const { queryProcessor } = require("./Queryprocess");
const { embeddedquery } = require("./queryembedding");
const { CreatePrompt } = require("./CreatePrompt");
const { askollama } = require("../../services/ollamaservice");

async function Retrivalpipeline(prompt) {
     
    const processedQuery = await queryProcessor(prompt);

    const vectors = await embeddedquery(processedQuery);

    const collection = await getcollection();

    const results = await collection.query({
        queryEmbeddings: [vectors],
        include: ["documents", "metadatas"],
        nResults: 5,
    });

    const docs = results.documents?.[0] || [];
    const metadatas = results.metadatas?.[0] || [];

    const context = await buildcontext(docs, metadatas);

    const Prompt = await CreatePrompt(processedQuery, context);

    const finalresults = await askollama(Prompt);

    return JSON.parse(finalresults);
}
module.exports = { Retrivalpipeline };