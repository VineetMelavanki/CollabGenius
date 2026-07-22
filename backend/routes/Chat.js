const express=require("express");
const { authmiddleware } = require("../middleware/authmiddleware");
const { CreateChat, getChatbyId } = require("../controllers/Chat");
const ChatRouter=new express.Router();
ChatRouter.post("/create-chat",authmiddleware,CreateChat);
ChatRouter.get("/get-chat-by-id",authmiddleware,getChatbyId);
module.exports=ChatRouter;