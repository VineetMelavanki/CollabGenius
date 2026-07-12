const { getcollection } = require("../chromadb/getcollection");
const { buildcontext } = require("./Buildcontext");
const { queryProcessor } = require("./Queryprocess");
const { embeddedquery } = require("./queryembedding");
const { CreatePrompt } = require("./CreatePrompt");
const { askollama } = require("../../services/ollamaservice");

async function Retrivalpipeline(req, res) {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(409).json({ msg: "Please enter a prompt", success: false });
        }
        
        const processedQuery = await queryProcessor(prompt);
        const vectors = await embeddedquery(processedQuery);
        console.log(vectors);

        const collection = await getcollection();
        const results = await collection.query({
            queryEmbeddings: [vectors],
            nResults: 5,
        });
        
        console.log("The results are : ", results);
        // ChromaDB returns documents as an array of arrays [[doc1, doc2...]]
        const docs = results.documents?.[0] || [];
        const context = await buildcontext(docs.map(pageContent => ({ pageContent })));
        const Prompt = await CreatePrompt(processedQuery, context);

        const finalresults = await askollama(Prompt);

        return res.status(200).json({ msg: "Results fetched successsfully", finalresults: finalresults, success: true });
    } catch (error) {
        console.log("Error in retrieval pipeline: ", error);
        return res.status(500).json({ msg: "Internal server error", success: false });
    }
}

module.exports = { Retrivalpipeline };