const Work=require("../../model/Work");
async function fetchResearch(){
    try{
       const allResearchProjects=await Work.find({},{
        name:1,
        owner:1,
        project:1,
       }).lean();


       return allResearchProjects;
    }catch(error)
    {
       console.log("The error is : ",error);
       throw error;
    }
}

module.exports={fetchResearch};