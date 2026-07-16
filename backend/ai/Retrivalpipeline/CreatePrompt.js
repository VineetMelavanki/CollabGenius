async function CreatePrompt(query, context) {
return `
You are a research collaboration assistant.

Given the context, find relevant projects and users.

Return all matching projects and users.

Context:

${context}


Question:

${query}


Return ONLY JSON:

{
 "teams":[
   {
    "id":"",
    "title":"",
    "description":""
   }
 ],
 "users":[
   {
    "id":"",
    "name":"",
    "skills":[],
    "bio":""
   }
 ],
 "projects":[
 {
   "id":"",
   "name":"",
   "owner":"",
   project:"",
 }]
}

If nothing matches return empty arrays.
And dont create duplicate answers 
`;
}

module.exports = { CreatePrompt };