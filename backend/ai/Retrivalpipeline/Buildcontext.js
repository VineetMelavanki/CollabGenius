async function buildcontext(documents, metadatas) {
    return documents
        .map((doc, index) => {
            return `
Document:
${doc}

Metadata:
${JSON.stringify(metadatas[index], null, 2)}
`;
        })
        .join("\n----------------------\n");
}

module.exports = { buildcontext };