const mongoose=require("mongoose");
const TeamSchema= new mongoose.Schema({
    name :
    {
        type : String,
        required : true,
        unique : true,
    },
    owner :
    {
        type :mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required :true,
    },
    members :[
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    }
],
    roles :
    {
        type : Map,
        of : String,
    },
});
const Team= mongoose.model("TeamSchema",TeamSchema);
module.exports= Team;
