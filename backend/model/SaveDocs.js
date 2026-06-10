const mongoose=require("mongoose");
const SaveDocsSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
    },
    summary:{
        type:String,
        required:true,
        unique:true,
    },
    link:{
        type:String,
        required:true,
    },
},{timestamps:true});
const SavedDocs=new mongoose.model("SaveDocs",SaveDocsSchema);
module.exports=SavedDocs;