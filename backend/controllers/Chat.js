const Chat=require("../model/Chat");
async function CreateChat(req,res)
{
     try{
        console.log("Request received successfully");
         const {prompt}=req.body;

         const userId=req.user.id;

         if(!prompt)
         {
            return res.status(409).json({msg:"Please enter a prompt",success:false});
         }
         
         const NewChat=await Chat.create({
            title:prompt,
            userId:userId,
         });
         console.log("New chat created successfully");
         console.log("The created chat id is : ",NewChat._id);
         return res.status(201).json({msg:"New chat created successfully",newChat:NewChat,success:true});
     }catch(error)
     {
        console.log(error);

        return res.status(500).json({msg:"Internal server error",success:false});
     }
}
async function getChatbyId(req,res)
{
   try{
      const{chatId}=req.params;
      const chatexists=await Chat.findById(chatId);
      if(!chatexists)
      {
         return res.status(404).json({msg:"No chat exists",success:false});
      }

      return res.status(200).json({msg:"Chat fetched successfully",chat:chatexists,success:true});
   }catch(error)
   {
        console.log(error);
        return res.status(500).json({msg:"Internal server error",success:false});
   }
}
module.exports={CreateChat,getChatbyId};