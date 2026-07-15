const {deletecollection}=require("./chromadb/getcollection")
async function deletechromacollection(){
  try{
     const collection =await deletecollection();
     console.log("The collection is deleted successfully");
  }catch(error)
  {
    console.log("The error is : ",error);
    throw error;
  }
}

deletechromacollection();