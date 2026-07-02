const express=require("express");
const {authmiddleware}=require("../middleware/authmiddleware")
const {AIrecommendations}=require("../controllers/Ollama");
const AiserviceRouter=new express.Router();
AiserviceRouter.post("/get-answers",authmiddleware,AIrecommendations);
module.exports=AiserviceRouter