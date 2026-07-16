const mongoose=require("mongoose");
const WorkSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    
    Team:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team',
        required:true,
    },
},{timestamps:true});

const Work=mongoose.model("Work",WorkSchema);
module.exports=Work;