const mongoose=require("mongoose");
const RepoNotesSchema=new mongoose.Schema({
    
    repoId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SavedRepo",
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
},{timestamps:true});
RepoNotesSchema.index({
    repoId:1,
});
const RepoNotes=mongoose.model("RepoNotes",RepoNotesSchema);
module.exports=RepoNotes;