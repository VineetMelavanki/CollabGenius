const connectmongodb = require("../connection/user.js");
const { ingestionpipeline } = require("./ingestionpipeline/ingestionPipeline.js");

async function runIngestion() {
    try {
        console.log("Connecting to MongoDB...");
        await connectmongodb();
        console.log("Connected to MongoDB");
        console.log("Starting ingestion pipeline...");
        await ingestionpipeline();
        console.log("Ingestion pipeline completed!");
        process.exit(0);
    } catch (error) {
        console.error("Error running ingestion pipeline:", error);
        process.exit(1);
    }
}

runIngestion();