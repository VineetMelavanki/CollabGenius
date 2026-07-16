const Assignment = require("../model/Assignment");
const Team=require("../model/Team");
const socketmiddleware=require("../middleware/socketmiddleware")
const User=require("../model/User");

const assignmentsocket=(io)=>{
    io.use(socketmiddleware);
    io.on("connection",(socket)=>{
        console.log("User connected : ",socket.id);
        socket.on('join-notify-room',async({receiver})=>{
            try{
               const Teamexists=await Team.findOne({members:socket.user.id});
        if(!Teamexists)
        {
            socket.emit("error",{msg:"No Team found"});
            return;
        }
        socket.join(Teamexists._id.toString());
        socket.join(socket.user.id);
        socket.data.TeamId=Teamexists.id;
        const isMember=Teamexists.members.some(
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
        .populate("TeamId","_id title");
        socket.emit("All-assignments",Assignment_history);
            }catch(error)
            {
                console.log("join-notify-room-error",error);
                socket.emit("error",{msg:"Internal server error"});
            }
    });
    socket.on("assign-task",async({task,receiver})=>{
        try{
          const TeamId=socket?.data?.TeamId;
        if(!TeamId)
        {
            socket.emit("error",{msg:"No Team found"});
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
            TeamId:TeamId,
            task,
            status:"pending",
        });
        const PopulatedAssignment=await Assignment.findById(newAssignment._id)
        .populate("receiver","name email")
        .populate("sender","name email")
        .populate("TeamId","_id title");
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
        .populate("TeamId","_id title");

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