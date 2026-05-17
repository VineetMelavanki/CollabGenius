const axios=require("axios");
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
    `&scope=user:email read:user`+
    `&state=${state}`;
    return res.status(200).redirect(githubAuthURL);
   }catch(error)
   { 
      console.log(error);
      return res.status(500).json({msg:"OAuth login failed"});
   }
}
module.exports={GithubLogin};