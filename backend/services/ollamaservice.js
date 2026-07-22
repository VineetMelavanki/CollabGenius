const axios = require("axios");

async function askollama(prompt) {
    const response = await axios.post(process.env.OLLAMA_URL, {
        model: "llama3.1:8b",
        prompt: prompt,
        stream: false,
        format:"json",
    });

    return response.data.response;
}

module.exports = { askollama };
