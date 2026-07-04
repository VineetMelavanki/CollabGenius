const askollama=require("../services/ollamaservice");
const Project=require("../model/project");
const User=require("../model/User");
const Profile=require("../model/Profile");
async function AIrecommendations(req,res)
{
    try{
        const {prompt}=req.body;
         if(!prompt)
        {
            return res.status(409).json({msg:"Please enter a prompt",success:false});
        }
        const teams=await Project.find({});
        const skills=await Profile.distinct("skills");
        const domains=await Profile.distinct("domains");
        const users=await Profile.find({}).populate("userId");
        const aiprompt = `
          You are an AI assistant for CollabGenius.

          The platform contains these domains:

         ${domains.join(", ")}

          The platform contains these skills:

         ${skills.join(", ")}

          Current users:

         ${JSON.stringify(users)}

        Current teams:

         ${JSON.stringify(teams)}

         User request:

         "${prompt}"

         Your task:

         1. Understand the user's request.
         2. Find the best matching skills.
         3. Find the best matching domains.
         4. Recommend the best users and teams.
Return ONLY valid JSON in this exact format:

{
  "skills": [],
  "domains": [],
  "reasoning" :"give me a one line explaiantion of why you recommended this",
}

Do not include users.
Do not include teams.
Do not explain anything.
`;
       
        const answer=await askollama(aiprompt);
        console.log("The answer is : ",answer);
        const filters=JSON.parse(answer);
        const Profiles=await Profile.find({
            domains:{$in:filters.domains},
            skills:{$in:filters.skills},
        }).populate("name photo");
        return res.status(200).json({msg:"Results fetched successfully",Profiles:Profiles,reasoning:filters.reasoning,success:true});
    }catch(error)
    {
        console.log("The error is : ",error);
        return res.status(500).json({msg:"Internal server error",success:false});
    }
}

module.exports={AIrecommendations};