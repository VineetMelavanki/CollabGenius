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
         console.log("Embedded query succesfully");
        const collection = await getcollection();
        const results = await collection.query({
            queryEmbeddings: [vectors],
            include:["documents","metadatas"],
            nResults: 5,
        });
        
        // ChromaDB returns documents as an array of arrays [[doc1, doc2...]]
        const docs = results.documents?.[0] || [];
        const metadatas=results.metadatas?.[0] ||[];
        const context = await buildcontext(
            docs.map((pageContent,index)=>({
                pageContent,
                metadata:metadatas[index],
            })),
        );
        console.log("The context is : ",context);
        const Prompt = await CreatePrompt(processedQuery, context);
         console.log("Prompt created successfully : ",Prompt);
        const finalresults = await askollama(Prompt);
        console.log("The final results are : ",finalresults);
        const parsedResults=JSON.parse(finalresults);
        return res.status(200).json({ msg: "Results fetched successfully", finalresults:parsedResults, success: true });
    } catch (error) {
        console.error("Error in retrieval pipeline: ", error);
        return res.status(500).json({ msg: "Internal server error", success: false });
    }
}

module.exports = { Retrivalpipeline };