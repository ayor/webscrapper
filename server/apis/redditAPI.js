const { reddit } = require('../config/const');

module.exports = async query => {
    const redditAPI = require('axios').create({ baseURL: reddit.BASE_URL });
    query = query + reddit.QUERY_STRING;
    let comments = [], submissions = [];

    try {
        const response = await redditAPI.get("comment/search", {
            params: {
                q: query,
                size: reddit.MAX_COMMENTS
            }
        });

        if (response && response.data.data && response.data.data.length > 0) comments = response.data.data;
    } catch (error) {
        console.log("Reddit Comments Error");
        console.log(error.response.data.message);
    }

    try {
        const response = await redditAPI.get("submission/search", {
            params: {
                q: query,
                size: reddit.MAX_SUBMISSIONS
            }
        });

        if (response && response.data.data && response.data.data.length > 0) submissions = response.data.data;
    } catch (error) {
        console.log("Reddit Submissions Error");
        console.log(error.response.data.message);
    }

    // console.log({ comments, submissions });

    return { comments, submissions };
};