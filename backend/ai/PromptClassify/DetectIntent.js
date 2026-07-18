const axios=require("axios");
const {PrompttodetectIntent}=require("../PromptClassify/PromptDetectIntent");
async function detectIntent(prompt){
     try{
        const NewPrompt=await PrompttodetectIntent(prompt);
        console.log("The prompt to detect intent is : ",NewPrompt);
        const response=await axios.post("http://localhost:11434/api/generate",{
            model: "llama3.1:8b",
            prompt:NewPrompt,
            stream:false,
        });
         console.log("The response is generated successfully");
         console.log("The intent is : ", response.data.response.trim().toUpperCase())
         return response.data.response.trim().toUpperCase();
     }catch(error)
     {
        console.log(error.response.data);
     }
}

module.exports={detectIntent};