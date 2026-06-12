const express=require("express");
const{authmiddleware}=require("../middleware/authmiddleware");
const {CreateTask,GetallTasks}=require("../controllers/ReseachTask")
const ResearchTaskRouter=new express.Router();
ResearchTaskRouter.post("/create-task/:projectId/:workId",authmiddleware,CreateTask);
ResearchTaskRouter.get("/get-all-tasks/:projectId/:workId",authmiddleware,GetallTasks);
module.exports=ResearchTaskRouter;