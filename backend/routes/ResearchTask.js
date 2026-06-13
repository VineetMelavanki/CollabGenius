const express=require("express");
const{authmiddleware}=require("../middleware/authmiddleware");
const {CreateTask,GetallTasks,DeleteTask,AddSavedRepositories}=require("../controllers/ReseachTask")
const ResearchTaskRouter=new express.Router();
ResearchTaskRouter.post("/create-task/:projectId/:workId",authmiddleware,CreateTask);
ResearchTaskRouter.get("/get-all-tasks/:projectId/:workId",authmiddleware,GetallTasks);
ResearchTaskRouter.delete("/delete-task/:projectId/:workId/:TaskId",authmiddleware,DeleteTask);
ResearchTaskRouter.post("/add-related-repos/:projectId/:workId/:TaskId/:repoId",authmiddleware,AddSavedRepositories)
module.exports=ResearchTaskRouter;