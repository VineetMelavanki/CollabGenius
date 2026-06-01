const express=require("express");
const RequestRouter=new express.Router();
const{authmiddleware}=require("../middleware/authmiddleware");
const{sendRequest,getallRequests,acceptRequest,declineRequest}=require("../controllers/Requests")
RequestRouter.post("/send-request/:projectId",authmiddleware,sendRequest);
RequestRouter.get("/get-all-requests",authmiddleware,getallRequests);
RequestRouter.post("/accept-request/:projectId/:senderId",authmiddleware,acceptRequest);
RequestRouter.post("/decline-request/:projectId/:senderId",authmiddleware,declineRequest);
module.exports=RequestRouter;