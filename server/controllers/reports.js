const { sendSuccess, sendError } = require('./../util/helpers');

// send in a limit and cursor to get a page of all sold items
// send in a sort attribute (price, category, etc) and sort order (asc/desc) to sort the results
function salesReport(req, res) {
    let db = req.app.get('db');
    let limit = req.body.limit || 50;
    let offset = req.body.offset || 0;
    let baseQuery = `SELECT * from items where sold = true`;

    // if sortAttr is provided, add sort command to the query
    let sortAttr = req.body.sortAttr;
    let sortOrder = req.body.sortOrder || 'asc';
    if (sortAttr) baseQuery += ` order by ${sortAttr} ${sortOrder}`

    // add limit and offset to the query
    baseQuery += ` limit $1 offset $2`

    return db.query(baseQuery, [limit, offset])
        .then(items => {
            let numResults = items.length;
            let offsetForNextPage = offset + numResults;
            let offsetForPrevPage = offset - limit;
            if (offsetForPrevPage < 0) offsetForPrevPage = 0;
            // If we dont get a full set of results back, we're at the end of the data
            if (numResults < limit) offsetForNextPage = null;
            let data = {
                items,
                offsetForPrevPage: offsetForPrevPage,
                offsetForNextPage, offsetForNextPage
            }
            return sendSuccess(res, data);
        })
        .catch(e => sendError(res, e, 'salesReport'))
}

module.exports = {
    salesReport,
}