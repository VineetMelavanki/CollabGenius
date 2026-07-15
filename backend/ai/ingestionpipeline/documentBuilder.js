const { fetchProfiles } = require("../ingestionpipeline/fetchProfiles");
const { Document } = require("@langchain/core/documents");
const { fetchProjects } = require("../ingestionpipeline/fetchProjects");
const {fetchResearch}=require("../ingestionpipeline/FetchWork");
async function documentbuider() {
    try {
        const Profiles = await fetchProfiles();
        const Projects = await fetchProjects();
        const researchs=await fetchResearch();
        const profiledocuments = Profiles.map((profile) => {
            return new Document({
                pageContent: `
                Name:${profile.name}
                Bio:${profile.Bio}
                skills:${profile.skills.join(", ")}
                skillevel:${profile.skillevel}`,
                metadata: {
                    id: profile._id.toString(),
                    userId: profile.userId.toString(), // Convert ObjectId to string
                    type: "profile",
                }
            });
        });

        const projectdocuments = Projects.map((project) => {
            return new Document({
                pageContent: `
                title:${project.title}
                description:${project.description}`,
                metadata: {
                     id: project._id.toString(),
                     ownerId: project.ownerId.toString(), // Convert ObjectId to string
                     type: "project"
                }
            });
        });
        
        const Researchdocuments=researchs.map((research)=>{
            return new Document({
                pageContent:`
                name:${research.name}`,
                metadata:{
                    id:research._id.toString(),
                    owner:research.owner.toString(),
                    project:research.project.toString(),
                }
            });
        });
        return [...profiledocuments, ...projectdocuments,...Researchdocuments];
    } catch (error) {
       console.log('Error creating documents', error);
       throw error;
    }
}

module.exports = { documentbuider };