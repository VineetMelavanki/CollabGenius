const express =require("express");
const {CreateProject,Getallprojects}=require("../controllers/Project");
const ProjectRouter = express.Router();
ProjectRouter.post("/create",CreateProject);
ProjectRouter.get("/getallprojects",Getallprojects);

module.exports=ProjectRouter;