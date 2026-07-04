
import {generateembeddings} from "../ingestionpipeline/embeddingGenerator"
import client from "../chromadb/chromadb";
export const vectoruploads=async()=>{

    try{
       const {documents,vectors}=await generateembeddings();
    const ids=documents.map(doc=>doc.metadata.id);

    const texts=documents.map(doc=>doc.pageContent);

    const metadatas=documents.map(doc=>doc.metadata);

    const collection=await client.getOrCreateCollection({
        name:"collabgenius",
    });

    await collection.add({
        ids,
        embeddings:vectors,
        documents:texts,
        metadatas,
    });

    console.log("Vectors uplaoded successfully");
    }catch(error)
    {
       console.log("Error uploading vectors",error);
       throw error;
    }
}
