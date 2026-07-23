const express=require("express");
const { authmiddleware } = require("../middleware/authmiddleware");
const { CreateChat, getChatbyId ,getalluserchats,getchatmessages} = require("../controllers/Chat");
const ChatRouter=new express.Router();
ChatRouter.post("/create-chat",authmiddleware,CreateChat);
ChatRouter.get("/get-chat-by-id",authmiddleware,getChatbyId);
ChatRouter.get("/get-all-user-chats/:userId",authmiddleware,getalluserchats);
ChatRouter.get("/get-chat-messages/:chatId",authmiddleware,getchatmessages);
module.exports=ChatRouter;