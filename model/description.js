const mongoose=require("mongoose");
const DescriptionSchema=new mongoose.Schema({
    TeamId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true,
    },
    ProjectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Work",
        required:true,
    },
    content:{
        type:String,
        required:true,
    }
},{timestamps:true});

const Description=mongoose.model("Description",DescriptionSchema);
module.exports=Description;