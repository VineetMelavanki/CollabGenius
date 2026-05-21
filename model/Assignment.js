const mongoose=require("mongoose");
const AssignmentSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
        required:true,
    },
    task:{
        type:String,
        required:true,
    },
    status:
    {
        type:String,
        enum:["pending","in-progress","completed","cancelled"],
        default:"pending",
    }
},{timestamps:true});
const Assignment=mongoose.model("Assignment",AssignmentSchema);
module.exports=Assignment;