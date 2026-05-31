const express=require("express");
const RequestRouter=new express.Router();
const{authmiddleware}=require("../middleware/authmiddleware");
const{sendRequest,getallRequests}=require("../controllers/Requests")
RequestRouter.post("/send-request/:projectId",authmiddleware,sendRequest);
RequestRouter.get("/get-all-requests",authmiddleware,getallRequests);

module.exports=RequestRouter;