const mongoose=require("mongoose");
const ProfileSchema = new mongoose.Schema({
    name:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
        unique:true,
    },
    Bio:{
        type:"String",
        required:true,
        unique:true,
    },
    skills:{
        type:"String",
        required:true,
        unique:true,
    },
    skillevel:{
        type:"String",
        enum:["Beginner","Intermediate","Advanced"],
        default:"Beginner",
    },
    github_link:{
        type:"String",
        unique:true,
        required:true,
    },
});
const Project=mongoose.model("Profile : ",ProfileSchema);
module.exports=Project;