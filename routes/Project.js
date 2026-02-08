const express =require("express");
const {CreateProject,Getallprojects,ViewProject}=require("../controllers/Project");
const {authmiddleware} =require("../middleware/authmiddleware")
const ProjectRouter = express.Router();
ProjectRouter.post("/Create-Project",authmiddleware,CreateProject);
ProjectRouter.get("/getallprojects",Getallprojects);
ProjectRouter.get("/View-Project",authmiddleware,ViewProject);

module.exports=ProjectRouter;