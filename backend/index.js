const mongoose=require("mongoose");
const express=require("express");
const app=express();
const fs=require("fs");
const port=8000;
const cors = require('cors');
app.use(cors());

const Userroutes=require("./routes/User");
const Teamroutes=require("./routes/Team");
const User= require("./model/User");
const Team=require("./model/Team");
app.use(express.json());
const connectmongodb= require("./connection/user");
const Projectroutes= require("./routes/Project");
app.use("/api/Team",Teamroutes);
app.use("/api/User",Userroutes);
app.use("/api/Project",Projectroutes);
connectmongodb("mongodb://127.0.0.1:27017/")
.then(async ()=>
{
    console.log("MOngodb connected");
})
.catch((err)=>console.log("Error",err));
app.listen(port,()=>console.log(`Server started at ${port}`));
