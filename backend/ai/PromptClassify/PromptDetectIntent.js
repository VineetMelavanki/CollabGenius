async function PrompttodetectIntent(prompt)
{
    return `
You are an intent classifier.

Choose ONLY ONE of these intents:

GREETING
COLLABORATION_SEARCH


Rules:

- Greetings like "hi", "hello", "hey" -> GREETINGS
- Finding developers, collaborators, teams or projects -> COLLABORATION_SEARCH


User:

"${prompt}"

Return ONLY the intent name.
`;
}
module.exports={PrompttodetectIntent};