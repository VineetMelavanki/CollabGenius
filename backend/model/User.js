const mongoose= require("mongoose");
const UserSchema = new mongoose.Schema({
      Name :{
        type: String,
        required: true,
      },
      email :
      {
        type : Email,
        required: true,
        unique: true,
      },
      password :
      {
        type: Password,
        required : true,
      },
});
const User= mongoose.model("UserSChema",UserSchema);
module.exports= User;