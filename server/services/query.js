// Loads constants from Config
const { RESPONSE } = require('../config/const');
// Loads Helper MicroServices for Fetching and Processing
const fetchAll = require('./fetch');
const { processAll } = require('./process');

/*
// Loads mongoose and the User Model Class
const mongoose = require('mongoose');
const Query = mongoose.model('queries');
*/

module.exports = async (req, res) => {
    // extract query from request
    let query = req.query.q;

    // return early if cached or invalid
    if (!query || query.length === 0) {
        res.send({ type: RESPONSE.TYPE.INVALID });
        return;
    }

    // check if query is cached?
    // TODO: Check mongo for a cached result
    const wasCached = false;
    // if so return the cached results
    if (wasCached) {
        // TODO: Fetch cached result
        const result = {};
        return res.send(result);
    }

    // call each of the search apis
    let result = await fetchAll(query);
    console.log(result);

    // process the results with processing apis
    result = await processAll(result);

    // assemble final response
    // TODO: Prepare result for final response

    // console.log(result);

    // store final response in cache
    // TODO: Insert the final result in cache

    // ship the response
    res.send(result);

    /*
    // This One Handles Circular Errors
    const cache = [];
    res.send(JSON.stringify(result, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            // Duplicate reference found, discard key
            if (cache.includes(value)) return;

            // Store value in our collection
            cache.push(value);
        }
        return value;
    }));
    */
};

