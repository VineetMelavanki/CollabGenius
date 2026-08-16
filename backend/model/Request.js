const mongoose=require("mongoose");
const RequestSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    TeamId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team",
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:['requested','pending','declined'],
        default:'requested',
    }
},{timestamps:true,});
const Request=mongoose.model("Request",RequestSchema);
module.exports=Request;