import { ChromaClient } from "chromadb";

const client=new ChromaClient({
    host:"localhost",
    port:8001,
    ssl:false,
});
export default client;