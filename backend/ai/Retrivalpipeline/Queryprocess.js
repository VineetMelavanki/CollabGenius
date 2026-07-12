async function queryProcessor(query) {
    return query.trim().replace(/\s+/g, " ").toLowerCase();
}

module.exports = { queryProcessor };