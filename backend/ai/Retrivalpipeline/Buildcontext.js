async function buildcontext(documents) {
    return documents.map((doc) => doc.pageContent).join("\n\n");
}

module.exports = { buildcontext };