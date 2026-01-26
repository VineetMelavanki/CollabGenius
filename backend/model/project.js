const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
    title :
    {
        type : String,
        unique : true,
        required : true,
    },
    description : String,
    teamid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Team',
        required : true,
    },
    ownerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    status : {
        type : String,
        enum:['active','archived','deleted'],
        default: 'active',
    },
    createdAt : {
        type : Date,
        default : Date.now,
    },
    updatedata: Date,
    deadline : Date,
});
const Project = mongoose.model("Project",projectSchema);
module.exports=Project;