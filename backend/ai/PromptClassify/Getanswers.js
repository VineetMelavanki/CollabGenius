const {detectIntent}=require("../PromptClassify/DetectIntent");
const {Retrivalpipeline}=require("../Retrivalpipeline/retrivalpipeline")
async function getanswers(req,res)
{
       try{
          const {prompt}=req.body;
          if(!prompt)
          {
            return res.status(409).json(({msg:"Prompt not entered",success:false}));
          }
          console.log("Generating intent...");
          const intent=await detectIntent(prompt);
          console.log("Generated intent successfully");
          switch(intent)
          {
            case "GREETING":
                return res.status(200).json({
                    type: "GREETING",
                    response: "Hello! 👋 How can I help you today?"
                });

            case "COLLABORATION_SEARCH": {
                const result = await RetrievalPipeline(prompt);
                console.log('fetched collaboration search successfully');
                return res.status(200).json({
                    type: "COLLABORATION_SEARCH",
                    finalresults: result
                });
            }
          }
       }catch(error)
       {
        return res.status(500).json({msg:"Internal server error",success:false});
       }
}

module.exports={getanswers};