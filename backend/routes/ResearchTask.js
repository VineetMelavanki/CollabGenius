const express=require("express");
const{authmiddleware}=require("../middleware/authmiddleware");
const {CreateTask,GetallTasks,DeleteTask,AddSavedRepositories,assignTask}=require("../controllers/ReseachTask")
const ResearchTaskRouter=new express.Router();
ResearchTaskRouter.post("/create-task/:projectId/:workId",authmiddleware,CreateTask);
ResearchTaskRouter.get("/get-all-tasks/:projectId/:workId",authmiddleware,GetallTasks);
ResearchTaskRouter.delete("/delete-task/:projectId/:workId/:TaskId",authmiddleware,DeleteTask);
ResearchTaskRouter.post("/add-related-repos/:projectId/:workId/:TaskId/:repoId",authmiddleware,AddSavedRepositories);
ResearchTaskRouter.post("/assign-task/:projectId/:workId/:TaskId/:memberId",authmiddleware,assignTask);
module.exports=ResearchTaskRouter;