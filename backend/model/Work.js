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
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
        required:true,
    },
},{timestamps:true});

const Work=mongoose.model("Work",WorkSchema);
module.exports=Work;