const Team = require("../../model/Team");

async function fetchTeams() {
    try {
        const Teams = await Team.find({}, {
            title: 1,
            description: 1,
            ownerId: 1,
            members: 1,
            status: 1,
        }).lean();

        return Teams;
    } catch (error) {
        console.log("Error fetching projexts : ", error);
        throw error;
    }
}

module.exports = { fetchTeams };