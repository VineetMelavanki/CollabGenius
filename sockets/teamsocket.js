const jwt=require("jsonwebtoken");
const {Messages}=require("../model/Messages");
const project=require("../model/project");
const User=require("../model/User");
const socketmiddleware=require("../middleware/socketmiddleware")
const teamsockets=(io)=>{
    io.use(socketmiddleware);
    io.on("connection",(socket)=>{
         console.log("New user connected : ",socket.id);
       socket.on('join-room',async({projectId})=>{
        console.log("joined-room recieved :",projectId);
        console.log("User connected : ",socket.user);
           const Project=await project.findById(projectId);

           if(!Project)
           {
            socket.emit("error",{msg:"No project found"});
            return;
           }
           const isMember=Project.members.some(
           (id)=>id.toString()===socket.user.id,
           );
           if(!isMember)
           {
            socket.emit("error",{msg:"User is not a member of this project"});
            return;
           }
           socket.join(projectId);
           socket.data.projectId=projectId;

           const history=await Messages.find({projectId})
           .sort({createdAt:-1})
           .limit(50)
           .lean();
           socket.emit("chat-history",history.reverse());
       });
    socket.on('send-message',async({content})=>{
        const projectId=socket?.data?.projectId;
        if(!projectId)
        {
            socket.emit("error",{msg:"No project Found"});
            return;
        }
        if(!content.trim())
        {
            return;
        }
        const message=await Messages.create({
            projectId:projectId,
            userId:socket.user.id,
            username:socket.user.name,
            content,
        });
        io.to(projectId).emit("receive-message",message);
    });
    
    socket.on("disconnect",()=>{
        const {projectId}=socket.data ||{};
        if(projectId && socket.user.id)
        {
             socket.to(projectId).emit("user-left",{
                username:socket.user.name,
             });
        }
        console.log("User disconnected : ",socket.id);
    });
    });
}
module.exports=teamsockets;