const express=require("express");
const{authmiddleware}=require("../middleware/authmiddleware");
const {CreateTask,GetallTasks,DeleteTask,AddSavedRepositories,assignTask}=require("../controllers/ReseachTask")
const ResearchTaskRouter=new express.Router();
ResearchTaskRouter.post("/create-task/:TeamId/:workId",authmiddleware,CreateTask);
ResearchTaskRouter.get("/get-all-tasks/:TeamId/:workId",authmiddleware,GetallTasks);
ResearchTaskRouter.delete("/delete-task/:TeamId/:workId/:TaskId",authmiddleware,DeleteTask);
ResearchTaskRouter.post("/add-related-repos/:TeamId/:workId/:TaskId/:repoId",authmiddleware,AddSavedRepositories);
ResearchTaskRouter.post("/assign-task/:TeamId/:workId/:TaskId/:memberId",authmiddleware,assignTask);
module.exports=ResearchTaskRouter;