const { vectoruploads } = require("./vectorupLoader");

async function ingestionpipeline() {
    try {
        console.log("Ingesting data into vectordb");
        await vectoruploads();
        console.log("Ingestion pipeline completed successfully");
    } catch (error) {
        console.log("Cannot complete ingestion pipeline", error);
        throw error;
    }
}

module.exports = { ingestionpipeline };