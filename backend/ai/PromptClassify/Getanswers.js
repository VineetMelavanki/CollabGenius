const {detectIntent}=require("../PromptClassify/DetectIntent");
const {Retrivalpipeline}=require("../Retrivalpipeline/retrivalpipeline");
const Aimessage=require("../../model/AIMessages");
const Chat=require("../../model/Chat");
async function getanswers(req,res)
{
       try{
          const {chatId}=req.params;
          const{prompt}=req.body;
          const chatexists=await Chat.findById(chatId);
          if(!chatexists)
          {
            return res.status(404).json({msg:"No such chat exists",success:false});
          }
          
          if(!prompt)
          {
            return res.status(409).json(({msg:"Prompt not entered",success:false}));
          }

           const userMessage=await Aimessage.create({
            chatId:chatId,
            role:"user",
            content:prompt,
          });
          
          console.log("Generating intent...");
          const intent=await detectIntent(prompt);
          console.log("Generated intent successfully");
          let assistanceResponse;
          let intenttype;
          switch(intent)
          {
            case "GREETING":
                assistanceResponse="Hello! 👋 How can I help you today?";
                intenttype="GREETING";
                break;

            case "COLLABORATION_SEARCH": 
                assistanceResponse = await Retrivalpipeline(prompt);
                intenttype="COLLABORATION_SEARCH";
                break;

            default:
                assistanceResponse = "I am not sure to help with that.";
                break;
            }
            const botmessage=await Aimessage.create({
              chatId:chatId,
              role:"chat-bot",
              content:JSON.stringify(assistanceResponse),
            });
            return res.status(201).json({msg:"All messages fetched successfully",userMessage:userMessage,botMessage:botmessage,intenttype:intenttype,success:true});
          }
       catch(error)
       {
        console.log("The error is : ",error);
        return res.status(500).json({msg:"Internal server error",success:false});
       }
}
module.exports={getanswers};