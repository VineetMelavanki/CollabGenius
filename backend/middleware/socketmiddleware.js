const User=require("../model/User");
const jwt=require("jsonwebtoken");
const socketmiddleware=async(socket,next)=>{
   const token=socket.handshake.auth.token;

   if(!token)
   {
    return next(new Error("No token provided"));
   }
   try{
       const decoded=jwt.verify(token,process.env.JWT_secret);
       socket.user=decoded;
       next();
   }catch(error)
   {
    return next(Error("Internal server error"));
   }
}
module.exports=socketmiddleware;