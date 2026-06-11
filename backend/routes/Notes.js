const express=require("express");
const NotesRouter=new express.Router();
const{CreateGithubRepoNotes,getallnotes}=require("../controllers/Notes")
const {authmiddleware}=require("../middleware/authmiddleware")
NotesRouter.post("/create-notes/:repoId",authmiddleware,CreateGithubRepoNotes);
NotesRouter.get("/get-all-notes/:repoId",authmiddleware,getallnotes);
module.exports=NotesRouter;