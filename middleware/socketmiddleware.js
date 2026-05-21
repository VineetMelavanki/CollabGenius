const User=require("../model/User");
const jwt=require("jsonwebtoken");

function parseCookies(cookieHeader) {
    const cookies = {};
    if (!cookieHeader) return cookies;
    cookieHeader.split(';').forEach(cookie => {
        const [name, ...rest] = cookie.split('=');
        cookies[name.trim()] = rest.join('=').trim();
    });
    return cookies;
}

const socketmiddleware=async(socket,next)=>{
   const cookieHeader=socket.handshake.headers.cookie;
   const cookies=parseCookies(cookieHeader);
   const token=cookies.token;

   if(!token)
   {
    return next(new Error("No token provided"));
   }
   try{
       const decoded=jwt.verify(token,process.env.JWT_SECRET);
       socket.user=decoded;
       next();
   }catch(error)
   {
    return next(Error("Internal server error"));
   }
}
module.exports=socketmiddleware;