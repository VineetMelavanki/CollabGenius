const mongoose=require("mongoose");
const SaveRepoSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    TeamId:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team",
        required:true,
    },
    workId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Work",
        required:true,
    },
    repourl:{
        type:String,
    },
    savedby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
});
const SavedRepo=new mongoose.model("SavedRepo",SaveRepoSchema);
module.exports=SavedRepo;