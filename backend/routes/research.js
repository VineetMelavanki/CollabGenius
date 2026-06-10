const express=require("express");
const researchRouter=new express.Router();
const{SaveGithubRepo,fetchAllsavedRepos,DeletesavedRepos} =require("../controllers/SavedStuff")
const {arXivResearch,githubResearch}=require("../controllers/research")
const {authmiddleware} =require("../middleware/authmiddleware")
researchRouter.get("/search-topic",authmiddleware,arXivResearch);
researchRouter.get("/github-search",authmiddleware,githubResearch);
researchRouter.post("/save-github-repo/:projectId/:workId",authmiddleware,SaveGithubRepo);
researchRouter.get("/saved-github-repos/:projectId/:workId",authmiddleware,fetchAllsavedRepos);
researchRouter.delete("/delete-github-repo/:projectId/:workId/:repoId",authmiddleware,DeletesavedRepos);
module.exports=researchRouter;