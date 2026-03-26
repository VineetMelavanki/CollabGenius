const mongoose=require("mongoose");
const MessageSchema=new mongoose.Schema({
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    content:
    {
        type:String,
        required:true,
    },
},{timestamps:true});
const Messages=mongoose.model("Messages",MessageSchema);
module.exports={Messages};