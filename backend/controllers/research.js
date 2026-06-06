const axios=require("axios");
const xml2js=require("xml2js");
const User = require("../model/User");
async function arXivResearch(req,res)
{
     const {topic}=req.query;
     if(!topic)
     {
      return res.status(409).json({msg:"Please enter a topic",success:false});
     }
     const url =`http://export.arxiv.org/api/query?search_query=all:${topic}&start=0&max_results=5`;

     try{
        const response=await axios.get(url,{
         headers:{
            "User-Agent":"Mozilla/5.0"
         }
        });
         xml2js.parseString(response.data,(err,result)=>{
            if(err)
            {
                return res.status(404).json({msg:"An error occurred",success:false});
            }
             const entries = result.feed.entry;

         const papers = entries.map((paper) => ({
            title: paper.title[0],
            summary: paper.summary[0],
            link: paper.id[0]
         }));
            return res.status(201).json({msg:"Research papers fetched successfully",results:papers,success:true});
         });
     }catch(error)
     {
        return res.status(500).json({msg:"Internal server error"});
     }
}
async function githubResearch(req,res)
{
   try{
     const{topic}=req.query;
     const user=await User.findById(req.user.id);
     if(!topic)
     {
      return res.status(409).json({msg:"Please enter a topic",success:false});
     }
     if(!user)
     {
      return res.status(404).json({msg:"User not found",success:false});
     }
     const access_token=user?.githubaccess_token;
     const config={
        params:{
            q:topic,
            sort:"stars",
            order:"desc",
            per_page:20,
         },
     }

     if(access_token)
     {
      config.headers={
         Authorization:`Bearer ${access_token}`,
      };
     }
     const response=await axios.get(
      "https://api.github.com/search/repositories",
      config
     );
     return res.status(200).json({msg:"All repositories fetched successfully",repositories:response.data.items,success:true});
   }catch(error)
   {
      return res.status(500).json({msg:"Internal server error",success:false});
   }
}
module.exports={arXivResearch,githubResearch};