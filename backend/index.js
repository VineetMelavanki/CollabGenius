require('dotenv').config();
const {Server}=require("socket.io")
const mongoose=require("mongoose");
const express=require("express");
const cookieParser = require("cookie-parser");
const app=express();
const http=require("http");
const fs=require("fs");
const port=8000;
const cors=require("cors");
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',  // React/Vite dev server URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))
const { swaggerUi, swaggerSpec } = require('./config/swagger');
const Userroutes=require("./routes/User");
app.use(express.json());
const server=http.createServer(app);
const io=new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    methods:["GET","POST"],
    credentials:true
  }
});
const AuthRoutes=require("./routes/Auth");
const ResearchRoutes=require("./routes/research");
const connectmongodb= require("./connection/user");
const Teamroutes= require("./routes/Team");
const Profileroutes=require("./routes/Profile");
const Workroutes=require("./routes/Work");
const NotificationRoutes=require("./routes/Notifications");
const NotesRoutes=require('./routes/Notes');
const DescriptionRoutes=require("./routes/Description");
const RequestRoutes=require("./routes/Request");
const ReseachTaskroutes=require("./routes/ResearchTask");
const teamsockets=require("./sockets/teamsocket");
const assignmentsocket=require("./sockets/Assignmentsocket");
const FriendRequestRoutes=require("./routes/FriendReq");
const AiserviceRoutes=require("./routes/Aiservices");
const ChatRoutes=require("./routes/Chat");
const githubRoutes=require("./routes/Github");
const { ingestionpipeline } = require("./ai/ingestionpipeline/ingestionPipeline");
app.use("/api/User",Userroutes);
app.use("/api/Team",Teamroutes);
app.use("/api/Profile",Profileroutes);
app.use("/api/My",NotificationRoutes);
app.use("/api/Work",Workroutes);
app.use("/api/Desription",DescriptionRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/research",ResearchRoutes);
app.use("/auth",AuthRoutes);
app.use("/api/Request",RequestRoutes);
app.use("/api/Notes",NotesRoutes);
app.use("/api/ResearchTask",ReseachTaskroutes);
app.use("/api/FriendRequest",FriendRequestRoutes);
app.use("/api/ai",AiserviceRoutes);
app.use("/api/chat",ChatRoutes);
app.use("/api/github",githubRoutes);
console.log("JWT Secret :", process.env.JWT_SECRET);
teamsockets(io);
assignmentsocket(io);
connectmongodb("mongodb://127.0.0.1:27017/")
.then(async ()=>
{
    console.log("MOngodb connected");
    server.listen(8000,()=>console.log(`Server started at ${port}`));
    setTimeout(async () => {
      try {
        console.log("Starting AI ingestion pipeline...");
        await ingestionpipeline();
        console.log("AI ingestion pipeline completed successfully");
      } catch (err) {
        console.log("AI ingestion pipeline error:", err.message);
      }
    }, 2000);
})
.catch((err)=>console.log("Error",err));
