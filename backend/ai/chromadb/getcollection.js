const client = require("./chromadb");

async function getcollection() {
    // Try to get collection first, create if not exists
    try {
        return await client.getOrCreateCollection({name:"CollabGenius"});
    } catch (error) {
        // Collection doesn't exist, create it without specifying embedding function (we provide our own)
        return await client.createCollection({ name: "CollabGenius" });
    }
}

async function deletecollection(){
    try{
        return await client.deleteCollection({name:"CollabGenius"});
    }catch(error)
    {
        console.log("The error is : ",error);
        throw error;
    }
}
module.exports = { getcollection ,deletecollection};
