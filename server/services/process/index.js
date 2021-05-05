const processReddit = require('./processReddit');
const processIndeed = require('./processIndeed');
const processKununu = require('./processKununu');
const { processOverall } = require('./processOverall');

exports.processAll = async input => {
    const result = {};

    // console.log(input);

    // process all API results individually
    result.reddit = await processReddit(input.reddit);
    result.kununu = await processKununu(input.kununu);
    result.indeed = await processIndeed(input.indeed);

    // console.log(result.reddit);
    // console.log(result.indeed);

    // process the results overall
    result.overall = processOverall(result);

    // console.log(result.overall);
    // console.log(result);

    return result;
};

exports.processKununu = processKununu;
exports.processIndeed = processIndeed;
exports.processReddit = processReddit;
exports.processOverall = processOverall;
