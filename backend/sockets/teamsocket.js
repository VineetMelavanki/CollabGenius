const jwt=require("jsonwebtoken");
const {Messages}=require("../model/Messages");
const Team=require("../model/Team");
const User=require("../model/User");
const socketmiddleware=require("../middleware/socketmiddleware")
const teamsockets=(io)=>{
    io.use(socketmiddleware);
    io.on("connection",(socket)=>{
         console.log("New user connected : ",socket.id);
       socket.on('join-room',async({TeamId})=>{
        console.log("joined-room recieved :",TeamId);
        console.log("User connected : ",socket.user);
           const team=await Team.findById(TeamId);

           if(!team)
           {
            socket.emit("error",{msg:"No Team found"});
            return;
           }
           const isMember=team.members.some(
           (id)=>id.toString()===socket.user.id,
           );
           if(!isMember)
           {
            socket.emit("error",{msg:"User is not a member of this Team"});
            return;
           }
           socket.join(TeamId);
           socket.data.TeamId=TeamId;

           const history=await Messages.find({TeamId})
           .sort({createdAt:-1})
           .limit(50)
           .lean();
           socket.emit("chat-history",history.reverse());
       });
    socket.on('send-message',async({content})=>{
        const TeamId=socket?.data?.TeamId;
        if(!TeamId)
        {
            socket.emit("error",{msg:"No Team Found"});
            return;
        }
        if(!content.trim())
        {
            return;
        }
        const message=await Messages.create({
            TeamId:TeamId,
            userId:socket.user.id,
            username:socket.user.name,
            content,
        });
        io.to(TeamId).emit("receive-message",message);
    });
    
    socket.on("disconnect",()=>{
        const {TeamId}=socket.data ||{};
        if(TeamId && socket.user.id)
        {
             socket.to(TeamId).emit("user-left",{
                username:socket.user.name,
             });
        }
        console.log("User disconnected : ",socket.id);
    });
    });
}
module.exports=teamsockets;