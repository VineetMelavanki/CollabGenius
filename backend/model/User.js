const mongoose= require("mongoose");
const UserSchema = new mongoose.Schema({
      Name :{
        type: String,
        required: true,
      },
      email :
      {
        type : String,
        required: true,
        unique: true,
      },
      password :
      {
        type: String,
        required : true,
      },
});
const User= mongoose.model("UserSChema",UserSchema);
module.exports= User;