const express = require("express");
const {getanswers}=require("../ai/PromptClassify/Getanswers");
const { authmiddleware } = require("../middleware/authmiddleware");
const AiserviceRouter = new express.Router();
AiserviceRouter.post("/get-answers", authmiddleware, getanswers);
module.exports = AiserviceRouter;