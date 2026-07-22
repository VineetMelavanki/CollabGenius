const Chat=require("../model/Chat");
const User = require("../model/User");
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

async function getalluserchats(req,res)
{
   try{
     const{userId}=req.params;
     const userexists=await User.findById(userId);

     if(!userexists)
     {
      return res.status(404).json({msg:"User not found",success:false});
     }

     const allchats=await Chat.find({userId:userId});

     if(allchats.length==0)
     {
      return res.status(200).json({msg:"User have not created any chats",success:true});
     }

     return res.status(200).json({msg:"All chats fetched successfully",chats:allchats,success:true});
   }catch(error)
   {
      console.log(error);

      return res.status(500).json({msg:"Internal server error",success:false});
   }
}
module.exports={CreateChat,getChatbyId,getalluserchats};