const express=require("express");
const{authmiddleware}=require("../middleware/authmiddleware");
const {CreateTask,GetallTasks,DeleteTask}=require("../controllers/ReseachTask")
const ResearchTaskRouter=new express.Router();
ResearchTaskRouter.post("/create-task/:projectId/:workId",authmiddleware,CreateTask);
ResearchTaskRouter.get("/get-all-tasks/:projectId/:workId",authmiddleware,GetallTasks);
ResearchTaskRouter.delete("/delete-task/:projectId/:workId/:TaskId",authmiddleware,DeleteTask);
module.exports=ResearchTaskRouter;