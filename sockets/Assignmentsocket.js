const Assignment = require("../model/Assignment");
const Project=require("../model/project");
const socketmiddleware=require("../middleware/socketmiddleware")
const User=require("../model/User");

const assignmentsocket=(io)=>{
    io.use(socketmiddleware);
    io.on("connection",(socket)=>{
        console.log("User connected : ",socket.id);
        socket.on('join-notify-room',async({receiver})=>{
            try{
               const Projectexists=await Project.findOne({members:socket.user.id});
        if(!Projectexists)
        {
            socket.emit("error",{msg:"No project found"});
            return;
        }
        socket.join(Projectexists._id.toString());
        socket.join(socket.user.id);
        socket.data.projectId=Projectexists.id;
        const isMember=Projectexists.members.some(
            (id)=>id.toString()===socket.user.id,
        );
        if(!isMember)
        {
            socket.emit("error",{msg:"User is not an member of the team"});
            return;
        }
        const Assignment_history=await Assignment.find({receiver:socket.user.id})
        .populate("sender","name email")
        .populate("receiver","name email")
        .populate("projectId","_id title");
        socket.emit("All-assignments",Assignment_history);
            }catch(error)
            {
                console.log("join-notify-room-error",error);
                socket.emit("error",{msg:"Internal server error"});
            }
    });
    socket.on("assign-task",async({task,receiver})=>{
        try{
          const projectId=socket?.data?.projectId;
        if(!projectId)
        {
            socket.emit("error",{msg:"No project found"});
            return ;
        }
        const receiverexists=await User.findById(receiver);
        if(!receiverexists)
        {
            socket.emit("error",{msg:"Receiver does not exists"});
            return ;
        }
        if(!task.trim())
        {
            return ;
        }
        const newAssignment=await Assignment.create({
            sender:socket.user.id,
            receiver:receiverexists.id,
            projectId:projectId,
            task,
            status:"pending",
        });
        const PopulatedAssignment=await Assignment.findById(newAssignment._id)
        .populate("receiver","name email")
        .populate("sender","name email")
        .populate("projectId","_id title");
        io.to(receiverexists.id).emit("receive-assignment",PopulatedAssignment);
        }catch(error)
        {
         console.log("assign-task-error",error);
         socket.emit("error",{msg:"Internal server error"});
        }
    });
    socket.on("remove-task",async({receiver,task})=>{

        try{
          const Assignmentexists=await Assignment.find({receiver,task})

        if(!Assignmentexists)
        {
            socket.emit("error",{msg:"NO Assignment found"});
            return;
        }
        await Assignment.deleteMany({receiver,task});
        
        const UpdatedAssignmnt=await Assignment.find({receiver})
        .populate("sender","name email")
        .populate("receiver","name email")
        .populate("projectId","_id title");

        io.to(receiver).emit("All-assignments",UpdatedAssignmnt);
        }catch(error)
        {
            console.log("Error : ",error);
            socket.emit("error",{msg:"Internal server error"});
        }
    })
    socket.on("disconnect",()=>{
        console.log("User disconnected",socket.id);
    })
    });
}
module.exports=assignmentsocket;