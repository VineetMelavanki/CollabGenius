const mongoose=require("mongoose");
const FriendReqSchema=new mongoose.Schema({
    profile:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
        required:true,
    },
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
    message:{
        type:String,
        required:true,
    },
    
});
FriendReqSchema.index(
    { sender: 1, receiver: 1 },
    { unique: true }
);
const FriendRequest=mongoose.model("FriendRequest",FriendReqSchema);
module.exports=FriendRequest;