const { fetchProfiles } = require("../ingestionpipeline/fetchProfiles");
const { Document } = require("@langchain/core/documents");
const { fetchTeams } = require("../ingestionpipeline/fetchProjects");
const {fetchResearch}=require("../ingestionpipeline/FetchWork");
async function documentbuilder() {
    try {
        const Profiles = await fetchProfiles();
        const Teams = await fetchTeams();
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
       
        const Teamdocuments = Teams.map((Team) => {
            return new Document({
                pageContent: `
                title:${Team.title}
                description:${Team.description}`,
                metadata: {
                     id: Team._id.toString(),
                     ownerId: Team.ownerId.toString(), // Convert ObjectId to string
                     type: "Team"
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
                    Team:research.Team.toString(),
                }
            });
        });
        return [...profiledocuments, ...Teamdocuments,...Researchdocuments];
    } catch (error) {
       console.log('Error creating documents', error);
       throw error;
    }
}

module.exports = { documentbuilder };