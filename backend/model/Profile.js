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
    }
});
const Profile=mongoose.model("Profile",ProfileSchema);
module.exports=Profile;