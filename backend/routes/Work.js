const express=require("express");
const WorkRouter=new express.Router();
const {CreateWork,getWork,deletework,getWorkById}=require("../controllers/Work")
const {authmiddleware}=require("../middleware/authmiddleware")
WorkRouter.post("/create-work/:projectId",authmiddleware,CreateWork);
WorkRouter.get("/get-works/:projectId",authmiddleware,getWork);
WorkRouter.delete("/delete-work/:projectId/:workId",authmiddleware,deletework);
WorkRouter.get("/get-WORK/:workId",authmiddleware,getWorkById);
module.exports=WorkRouter;