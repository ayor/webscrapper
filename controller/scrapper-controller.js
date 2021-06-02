
const AnalyzeReview = require('../util/util');
const NUM_OF_COMMENTS_PER_PAGE = 20;
const redis = require('redis');
const REDIS_URL = 6379; // process.env.REDIS_URL || 

let client;
if (process.env.REDISCLOUD_URL) {
    let redisURL = url.parse(process.env.REDISCLOUD_URL);
    client = redis.createClient(redisURL)
} else {
    client = redis.createClient(REDIS_URL)
};


exports.getComments = async (req, res, next) => {
    try {
        const company_name = req.body.company_name.trim();
        // const pageId = +req.query.pageId;
        let goodPageId = +req.query.goodPageId;
        let badPageId = +req.query.badPageId;

        if (!company_name) {
            const err = new Error('Kindly enter a company name');
            err.status = 422;
            throw err;
        }

        if (!goodPageId) {
            goodPageId = 1;
        }

        if (!badPageId) {
            badPageId = 1;
        }
        const START_INDEX_GD_COMMENTS = (NUM_OF_COMMENTS_PER_PAGE * +goodPageId) - NUM_OF_COMMENTS_PER_PAGE;
        const START_INDEX_BD_COMMENTS = (NUM_OF_COMMENTS_PER_PAGE * +badPageId) - NUM_OF_COMMENTS_PER_PAGE;

        client.get(company_name, async (err, data) => {
            if (err) {
                console.log(err);
            }

            if (!data) {
                const { goodComments, badComments, numberReviews } = await AnalyzeReview(company_name);

                let goodPercent = ((goodComments.length / (goodComments.length + badComments.length)) * 100).toFixed(2);
                let badPercent = (100 - goodPercent).toFixed(2);


                client.set(company_name, JSON.stringify({
                    company_name,
                    comments: { badComments, goodComments },
                    goodPercent,
                    goodPageId,
                    badPageId,
                    badPercent,
                    totalReviews: numberReviews
                }));

                res.status(200).json({
                    comments: {
                        goodComments: goodComments.splice(START_INDEX_GD_COMMENTS, NUM_OF_COMMENTS_PER_PAGE),
                        badComments: badComments.splice(START_INDEX_BD_COMMENTS, NUM_OF_COMMENTS_PER_PAGE)
                    },
                    totalReviews: numberReviews,
                    goodPageId,
                    badPageId,
                    goodPercent,
                    badPercent
                })
            } else {
                data = JSON.parse(data);
                if (data.company_name == company_name && (data.goodPageId === goodPageId || data.badPageId === badPageId)) {
                    let { goodComments, badComments } = data.comments;

                    
                    client.set(company_name, JSON.stringify({

                        ...data,
                        goodPageId,
                        badPageId,

                    }));
                    res.status(200).json({
                        ...data,
                        goodPageId,
                        badPageId,
                        comments: {
                            goodComments: goodComments.splice(START_INDEX_GD_COMMENTS, NUM_OF_COMMENTS_PER_PAGE),
                            badComments: badComments.splice(START_INDEX_BD_COMMENTS, NUM_OF_COMMENTS_PER_PAGE)
                        }
                    });
                }
            }


        })
    } catch (error) {
        // console.log("Could not resolve the browser instance => ", error);
        if (!error.status) {
            error.status = 500;
            error.message = "Could not resolve the browser instance";
        }
        next(error);
    }
}
