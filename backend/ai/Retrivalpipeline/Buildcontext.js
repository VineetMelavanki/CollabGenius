async function buildcontext(documents) {
   return documents.map(doc=>`${doc.pageContent} Metadata:${JSON.stringify(doc.metadata)}`).join("\n\n");
}

module.exports = { buildcontext };