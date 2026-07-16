const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
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
const Team= mongoose.model("Team", TeamSchema);
module.exports = Team;