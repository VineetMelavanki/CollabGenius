const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
    title :
    {
        type : String,
        required : true,
    },
    description : String,
    ownerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    members : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        }
    ],
    status : {
        type : String,
        enum:['active','archived','deleted'],
        default: 'active',
    },
},
{
    timestamps:true,
}
);
const Project = mongoose.model("Project",projectSchema);
module.exports=Project;