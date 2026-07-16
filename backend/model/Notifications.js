const mongoose=require("mongoose");

const NotificationSchema=new mongoose.Schema({
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["accepted","pending","declined"],
        default:"pending",
    },
    Team:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});
const Notifications=mongoose.model("Notification",NotificationSchema);

module.exports={Notifications};