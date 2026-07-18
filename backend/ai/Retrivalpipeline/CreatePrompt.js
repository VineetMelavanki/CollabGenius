async function CreatePrompt(query, context) {
return `
You are a research collaboration assistant.

Given the context, find relevant Work and users and teams , and the context consist of exact this database.

Return all matching teams, users and work.

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
 "Work":[
 {
   "id":"",
   "name":"",
   "owner":"",
   "Team":"",
 }]
}

If nothing matches return empty arrays.

`;
}

module.exports = { CreatePrompt };