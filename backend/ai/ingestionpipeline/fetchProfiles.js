const Profile = require("../../model/Profile");

async function fetchProfiles() {
    try {
        const allProfiles = await Profile.find({}, {
            userId: 1,
            name: 1,
            Bio: 1,
            skills: 1,
            skillevel: 1,
            github_link: 1,
            photo: 1,
            domains: 1,
            friends: 1,
        }).lean();

        return allProfiles;
    } catch (error) {
        console.log("The error is : ", error);
        throw error;
    }
}

module.exports = { fetchProfiles };