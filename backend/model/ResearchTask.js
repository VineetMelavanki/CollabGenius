const mongoose=require("mongoose");
const ResearchTaskSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true,
    },
    workId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Work",
        required:true,
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true,
    },
    relatedrepos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SavedRepo",
    }],
    assignedto:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    createdby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
},{timestamps:true});
const ResearchTask=mongoose.model("ResearchTask",ResearchTaskSchema);
module.exports=ResearchTask;