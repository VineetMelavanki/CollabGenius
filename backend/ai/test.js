import client from "./chromadb/chromadb.js";

async function test(){
    try{
      const heartbeat=await client.heartbeat();
      console.log("connected");
      console.log(heartbeat);
    }catch(error)
    {
        console.log(error);
    }
}
test();