const Project=require("../../model/project");
export const fetchProjects=async()=>{

    try{
        const Projects=await Project.find({},{
        title:1,
        description:1,
        ownerId:1,
        members:1,
        status:1,
     }).lean();

     return Projects;
    }catch(error)
    {
       console.log("Error fetching projexts : ",error);
       throw error;
    }
}