const mongoose=require("mongoose");
async function connectmongodb(url)
{
    mongoose.connect("mongodb://127.0.0.1:27017/");
}
module.exports=connectmongodb;