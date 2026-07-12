const Project = require("../../model/project");

async function fetchProjects() {
    try {
        const Projects = await Project.find({}, {
            title: 1,
            description: 1,
            ownerId: 1,
            members: 1,
            status: 1,
        }).lean();

        return Projects;
    } catch (error) {
        console.log("Error fetching projexts : ", error);
        throw error;
    }
}

module.exports = { fetchProjects };