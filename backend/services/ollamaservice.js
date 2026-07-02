const axios=require("axios");
async function askollama(prompt)
{
    const response=await axios.post("http://localhost:11434/api/generate",{
        model:"llama3.1:8b",
        prompt:prompt,
        stream:false,
    });

    return response.data.response;
}
module.exports=askollama;