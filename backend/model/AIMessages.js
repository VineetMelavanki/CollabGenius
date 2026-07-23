const mongoose=require("mongoose");
const AimessagesSchema=new mongoose.Schema({
    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat",
        required:true,
    },
    role:{
        type:String,
        enum:["user","chat-bot"],
        default:"user",
    },
    content:{
        type:String,
        required:true,
    },
    intent:{
        type:"String",
        enum:["GREETING","COLLABORATION_SEARCH"],
        default:"GREETING",
    },
},{timestamps:true});

const Aimessage=mongoose.model("Aimessage",AimessagesSchema);

module.exports=Aimessage;