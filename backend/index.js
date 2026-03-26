require('dotenv').config();
const {Server}=require("socket.io")
const mongoose=require("mongoose");
const express=require("express");
const app=express();
const http=require("http");
const fs=require("fs");
const port=8000;
const cors=require("cors");
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
const connectmongodb= require("./connection/user");
const Projectroutes= require("./routes/Project");
const Profileroutes=require("./routes/Profile");
const NotificationRoutes=require("./routes/Notifications");
const teamsockets=require("./sockets/teamsocket");
const assignmentsocket=require("./sockets/Assignmentsocket");
app.use("/api/User",Userroutes);
app.use("/api/Project",Projectroutes);
app.use("/api/Profile",Profileroutes);
app.use("/api/My",NotificationRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log("JWT Secret :", process.env.JWT_secret);
teamsockets(io);
assignmentsocket(io);
connectmongodb("mongodb://127.0.0.1:27017/")
.then(async ()=>
{
    console.log("MOngodb connected");
})
.catch((err)=>console.log("Error",err));
server.listen(8000,()=>console.log(`Server started at ${port}`));
