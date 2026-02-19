const express =require("express");
const {CreateProject,Getallprojects,getprojectbyId,deleteproject}=require("../controllers/Project");
const {authmiddleware} =require("../middleware/authmiddleware")
const ProjectRouter = express.Router();
ProjectRouter.post("/Create-Project",authmiddleware,CreateProject);
ProjectRouter.get("/getallprojects",authmiddleware,Getallprojects);
ProjectRouter.delete("/delete/:id",authmiddleware,deleteproject);
ProjectRouter.get("/get-project/:id",authmiddleware,getprojectbyId);
module.exports=ProjectRouter;