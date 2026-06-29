const express=require("express");
const FriendRequestRouter=new express.Router();
const {SendFriendRequest,fetchAllfriendRequests,acceptFriendRequest,declineFriendRequest}=require("../controllers/FriendRequest")
const {authmiddleware} =require("../middleware/authmiddleware")
FriendRequestRouter.post("/send-request/:profileId/:receiverId",authmiddleware,SendFriendRequest);
FriendRequestRouter.get("/get-all-requests",authmiddleware,fetchAllfriendRequests);
FriendRequestRouter.post("/accept-request/:requestId",authmiddleware,acceptFriendRequest);
FriendRequestRouter.post("/decline-request/:requestId",authmiddleware,declineFriendRequest);
module.exports=FriendRequestRouter;