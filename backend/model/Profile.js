const mongoose=require("mongoose");
const ProfileSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true,
    },
    Bio:{
        type:String,
        required:true,
    },
    skills:{
        type:String,
        required:true,
    },
    skillevel:{
        type:String,
        enum:["Beginner","Intermediate","Advanced"],
        default:"Beginner",
    },
    github_link:{
        type:String,
        required:true,
    },
    photo:{
        url:String,
        public_id:String,
    },
    domains:[{
        type:String,
        enum: [
            "CLI Tools",
            "Web Frameworks",
            "Mobile Development",
            "AI/ML",
            "Backend Development",
            "Frontend Development",
            "DevOps",
            "Blockchain",
            "Data Science",
            "Cybersecurity",
            "Research",
            "Game Development",
            "IoT",
            "Computer Vision",
            "Natural Language Processing",
            "Full Stack",
            "Others"
        ],
        trim:true
    }]
});
ProfileSchema.index({domains:1});
ProfileSchema.index({skills:1});
ProfileSchema.index({skillevel:1});
ProfileSchema.index({domains:1,skillevel:1});
const Profile=mongoose.model("Profile",ProfileSchema);
module.exports=Profile;