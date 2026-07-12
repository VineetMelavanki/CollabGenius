async function CreatePrompt(query, context) {
    return `

You are an AI assistant.

Answer ONLY using the provided context.

Context:

${context}

Question:

${query}

If the answer is not in context,
say "No information found."

`;
}

module.exports = { CreatePrompt };