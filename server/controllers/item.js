const { sendFailure, sendSuccess, sendError } = require('./../util/helpers')

// send in the id of the dealer 
// (anyone can see what's for sale, no restrictions - think Amazon)
function getItemById(req, res) {
    let db = req.app.get('db');
    let { id } = req.body;
    return db.items.find({ id })
        .then(items => {
            if (!items[0])
                return sendFailure(res, 'No such item exists');
            return sendSuccess(res, items[0]);
        })
        .catch(e => sendError(res, e, 'getItemById'))
}

// send in a limit and an offset to get a page of results
// (anyone can see what's for sale, no restrictions - think Amazon)
function allItems(req, res) {
    let db = req.app.get('db');
    let limit = req.body.limit || 50;
    let offset = req.body.offset || 0;
    return db.query(`SELECT * from items limit $1 offset $2`, [limit, offset])
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
        .catch(e => sendError(res, e, 'allItems'))
}

// send in the id of the dealer as well as limit and offset to get a page of results
// (anyone can see what's for sale, no restrictions - think Amazon)
function allItemsForDealer(req, res) {
    let db = req.app.get('db');
    let id = req.body.id;
    let limit = req.body.limit || 50;
    let offset = req.body.offset || 0;
    if (!id) return sendFailure(res, 'Please provide an id for a dealer');

    return db.query(`SELECT * from items where userid = $1 limit $2 offset $3`, [id, limit, offset])
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
        .catch(e => sendError(res, e, 'allItemsForDealer'))
}

// send in the id of the item as well as an updates obj
function updateItemListing(req, res) {
    let db = req.app.get('db');
    let { id, updates } = req.body;
    let loggedInUser = req.session.user;

    // I don't think we want to allow updates to ownership for an item
    delete updates.userid;

    if (updates.description && updates.description.length > 255)
        updates.description = udpates.description.substring(0, 255);

    return db.items.findOne({ id }, { fields: ['userid'] })
        .then(item => {
            if (loggedInUser.access_level < 10 && item.userid !== loggedInUser.id)
                return sendFailuer(res, 'Cannot edit another user\'s items')
            return db.items.update({ id }, updates)
                .then(items => sendSuccess(res, items[0]))
        })
        .catch(e => sendError(res, e, 'updateItemListing'))
}

// send in the gender, clothingType, age, price, description, & eligibleForClearance
function createItemListing(req, res) {
    let db = req.app.get('db');
    let { gender, clothingType, age, price, description, eligibleForClearance } = req.body;
    let loggedInUser = req.session.user;

    if (description.length > 255) description = description.substring(0, 255);

    return db.items.insert({
        gender,
        clothing_type: clothingType,
        age,
        price,
        description,
        eligible_for_clearance: eligibleForClearance,
        userid: loggedInUser.id
    })
        .then(item => sendSuccess(res, item))
        .catch(e => sendError(res, e, 'createItemListing'))
}

// send in the id of the item to delete
function deleteItemListing(req, res) {
    let db = req.app.get('db');
    let { id, updates } = req.body;
    let loggedInUser = req.session.user;

    return db.items.findOne({ id }, { fields: ['userid'] })
        .then(item => {
            if (loggedInUser.access_level < 10 && item.userid !== loggedInUser.id)
                return sendFailuer(res, 'Cannot delete another user\'s items')
            return db.items.destroy({ id })
                .then(items => sendSuccess(res, items[0], 'Deleted successfully'))
        })
        .catch(e => sendError(res, e, 'deleteItemListing'))
}

module.exports = {
    getItemById,
    allItems,
    allItemsForDealer,
    updateItemListing,
    createItemListing,
    deleteItemListing
}