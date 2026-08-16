const axios=require("axios");
const User=require("../model/User");
const GithubRepo=require("../model/GitRepo");
async function GithubLogin(req,res)
{
   try{
    const client_id=process.env.GITHUB_CLIENT_ID;
    const redirect_url=process.env.GITHUB_CALLBACK_URL;
    const state=Math.random().toString(36).substring(2);
    const githubAuthURL=
    `https://github.com/login/oauth/authorize`+
    `?client_id=${client_id}`+
    `&redirect_uri=${redirect_url}`+
    `&scope=user:email,repo`+
    `&state=${state}`;
    return res.status(200).redirect(githubAuthURL);
   }catch(error)
   { 
      console.log(error);
      return res.status(500).json({msg:"OAuth login failed"});
   }
}
async function CreateRepo(req,res)
{
   try{
      const{name,description,private:isPrivate}=req.body;
      const{TeamId,workId}=req.params;

      if(!name || !description)
      {
         return res.status(409).json({msg:"All fields are required",success:false});
      }
      const user=await User.findById(req.user.id);
      if(!user)
      {
         return res.status(404).json({msg:"User not found",success:false});
      }
      const access_token=user.githubaccess_token;
      if(!access_token)
      {
         return res.status(404).json({msg:"Github account not created",success:false});

      }
      const response=await axios.post(
         "https://api.github.com/user/repos",
         {
            name,
            description,
            private:Boolean(isPrivate)
         },
         {
            headers:{
               Authorization:`Bearer ${access_token}`,
                Accept: "application/vnd.github+json"
            }
         },
      );
      const githubRepo=response.data;
      const newGithubRepo=await GithubRepo.create({
         name:githubRepo.name,
         TeamId:TeamId,
         workId:workId,
         description:description,
         createdby:req.user.id,
         repourl:githubRepo.html_url,
         cloneurl:githubRepo.clone_url,
         githubRepoId:githubRepo.id,
         visibility:githubRepo.private?"private":"public",
      });
      return res.status(200).json({msg:"Git Repo created successfully",repo:newGithubRepo,success:true});
   }catch(error)
   {
     console.log(error.response?.data || error.message);

     return res.status(500).json({msg:"Repository cannot be created"});
   }
}
async function GetAllRepo(req,res)
{
   try{
    const{TeamId,workId}=req.params;
    const GithubRepos=await GithubRepo.find({TeamId:TeamId,workId:workId});

    if(!GithubRepo)
    {
      return res.status(404).json({msg:"No github repo for this Team",success:false});
    }
    const user=await User.findById(req.user.id);
    if(!user)
    {
      return res.status(404).json({msg:"User is not member of this group",success:false});
    }

    return res.status(200).json({msg:"All repositories fetched successfully",allrepo:GithubRepos,success:true});
   }catch(error)
   {
      return res.status(500).json({msg:"Internal server error",success:false});
   } 
}
async function AddContributor(req,res)
{
   try{
      
       const{repoOwner,repoName,collaboratorUserName}=req.params;
       
       console.log("The repoName :",repoName);
       console.log("The collaboratorName : ",collaboratorUserName);
       const collaborator=await User.findOne({name:collaboratorUserName});
       if(!collaborator || !collaborator?.githubaccess_token)
       {
         return res.status(409).json({msg:"Account not connected to github",success:false});
       }

       const owner=await User.findById(repoOwner);
        console.log("The repoOwner :",owner?.name);
       if(!owner || !owner.githubaccess_token)
       {
         return res.status(404).json({msg:"Leaders github account isnt connected",success:false});
       }
       const ownername=owner?.name;
       const userToken=collaborator.githubaccess_token;
       const githubUrl =`https://api.github.com/repos/${ownername}/${repoName}/collaborators/${collaboratorUserName}`;
       
       const response=await axios.put(
         githubUrl,{},
         {
            headers :{
               Authorization:`Bearer ${owner.githubaccess_token}`,
               Accept: "application/vnd.github+json",
               "X-GitHub-Api-Version": "2022-11-28",
               "User-Agent": "CollabGenius-App",
            }
         }
       );
       return res.status(200).json({msg:"Sent request to contributor successfully",data:response?.data,success:true});
   }catch(error)
   {
      console.log("The Add contributor error is : ",error);

      return res.status(500).json({msg:"Internal server error",success:false});
   }
}
module.exports={GithubLogin,CreateRepo,GetAllRepo,AddContributor};