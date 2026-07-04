import {embeddocuments} from "../embeddings/embeddings"
import {documentbuider} from "../ingestionpipeline/documentBuilder"
export const generateembeddings=async()=>{
    const documents=await documentbuider();

    const texts=documents.map(doc=>doc.pageContent);

    const vectors=await embeddocuments(texts);
    
    return{
        documents,
        vectors
    };
};