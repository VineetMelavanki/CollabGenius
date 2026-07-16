const express=require("express");
const RequestRouter=new express.Router();
const{authmiddleware}=require("../middleware/authmiddleware");
const{sendRequest,getallRequests,acceptRequest,declineRequest}=require("../controllers/Requests")
RequestRouter.post("/send-request/:TeamId",authmiddleware,sendRequest);
RequestRouter.get("/get-all-requests",authmiddleware,getallRequests);
RequestRouter.post("/accept-request/:TeamId/:senderId",authmiddleware,acceptRequest);
RequestRouter.post("/decline-request/:TeamId/:senderId",authmiddleware,declineRequest);
module.exports=RequestRouter;