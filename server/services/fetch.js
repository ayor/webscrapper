const { redditAPI, indeedAPI, indeedScrape, careerBlissScrape, kununuScrape } = require('../apis');

module.exports = async query => {
    const result = {};

    // fetch all API results and return
    result.reddit = await redditAPI(query);
    result.kununu = await kununuScrape(query);
    result.indeed = await indeedScrape(query);
    // result.indeed = await indeedAPI(query);
    // result.career_bliss = await careerBlissScrape(query);

    // console.log(result);

    return result;
};