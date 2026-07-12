const express = require("express");
const { Retrivalpipeline } = require("../ai/Retrivalpipeline/retrivalpipeline");
const { authmiddleware } = require("../middleware/authmiddleware");
const AiserviceRouter = new express.Router();
AiserviceRouter.post("/get-answers", authmiddleware, Retrivalpipeline);
module.exports = AiserviceRouter;