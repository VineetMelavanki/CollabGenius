const express=require("express");
const {getrequests,acceptrequest,declinereq}=require("../controllers/Notification");
const { authmiddleware } = require("../middleware/authmiddleware");
const NotificationRouter=new express.Router();
NotificationRouter.get("/Notifications",authmiddleware,getrequests);
NotificationRouter.post("/accept-request/:projectId",authmiddleware,acceptrequest);
NotificationRouter.post("/decline-request/:projectId",authmiddleware,declinereq);
module.exports=NotificationRouter;