const { buildcontext } = require("./Buildcontext");
const { queryProcessor } = require("./Queryprocess");
const { CreatePrompt } = require("./CreatePrompt");
const { getEnsembleRetriever } = require("./hybridRetriever");
const { askollama } = require("../../services/ollamaservice");
async function Retrivalpipeline(prompt) {
     
    const processedQuery = await queryProcessor(prompt);

    const ensembleRetriever = getEnsembleRetriever();
    const retrievedDocs = await ensembleRetriever.invoke(processedQuery);

    const docs = retrievedDocs.map((doc) => doc.pageContent);
    const metadatas = retrievedDocs.map((doc) => doc.metadata);

    const context = await buildcontext(docs, metadatas);

    const Prompt = await CreatePrompt(processedQuery, context);

    const finalresults = await askollama(Prompt);

    return JSON.parse(finalresults);
}
module.exports = { Retrivalpipeline };