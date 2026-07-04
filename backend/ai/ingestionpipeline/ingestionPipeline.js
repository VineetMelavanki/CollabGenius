import { vectoruploads } from "./vectorupLoader";
export const ingestionpipeline=async()=>{
    try{
       console.log("Ingesting data intot vectordb");

       await vectoruploads();

       console.log("Ingestion pipeline completed successfully");
    }catch(error)
    {
       console.log("Cannot complete ingestion pipeline",error);
       throw error;
    }
}