
const AnalyzeReview = require('../util/util');
const NUM_OF_COMMENTS_PER_PAGE = 20;
const redis = require('redis');
const setClient = require('../util/setClient');
let client = redis.createClient(process.env.REDIS_URL, { no_ready_check: true });


exports.getComments = async (req, res, next) => {
    try {
        const company_name = req.body.company_name.trim();
        // const pageId = +req.query.pageId;
        let _goodPageId = +req.query.goodPageId;
        let _badPageId = +req.query.badPageId;


        //check if expected params are sent
        if (!company_name) {
            const err = new Error('Kindly enter a company name');
            err.status = 422;
            throw err;
        }

        if (!_goodPageId) {
            _goodPageId = 1;
        }

        if (!_badPageId) {
            _badPageId = 1;
        }
        const START_INDEX_GD_COMMENTS = (NUM_OF_COMMENTS_PER_PAGE * +_goodPageId) - NUM_OF_COMMENTS_PER_PAGE;
        const START_INDEX_BD_COMMENTS = (NUM_OF_COMMENTS_PER_PAGE * +_badPageId) - NUM_OF_COMMENTS_PER_PAGE;
        //check the redis cache
        client.get(company_name, async (err, data) => {
            if (err) {
                console.log(err);
            }
            //scrape for comments if data does not exist on the redis cache
            if (!data) {
                let { goodComments, badComments, numberReviews } = await AnalyzeReview(company_name);

                let goodPercent = ((goodComments.length / (goodComments.length + badComments.length)) * 100).toFixed(2) || 0;
                let badPercent = (100 - goodPercent).toFixed(2) || 0;

                //stores scrapped results/reviews on redis 
                setClient(company_name, {
                    company_name,
                    comments: { badComments, goodComments },
                    goodPercent,
                    goodPageId,
                    badPageId,
                    badPercent,
                    totalReviews: numberReviews || 0,
                });

                //sends reviews to user 
                res.status(200).json({
                    comments: {
                        goodComments: goodComments.splice(START_INDEX_GD_COMMENTS, NUM_OF_COMMENTS_PER_PAGE),
                        badComments: badComments.splice(START_INDEX_BD_COMMENTS, NUM_OF_COMMENTS_PER_PAGE)
                    },
                    totalReviews: numberReviews || 0,
                    goodPageId: _goodPageId,
                    badPageId: _badPageId,
                    goodPercent,
                    badPercent
                })
            } else {
                data = JSON.parse(data);
                let { comments: { goodComments, badComments }, goodPageId, badPageId, } = data;
                //if data exists and does not have some value try to scrape again 
                if (data.company_name == company_name && (data.goodPageId === goodPageId || data.badPageId === badPageId)) {
                    if (!data.comments) {
                        let { goodComments, badComments, numberReviews } = await AnalyzeReview(company_name);
                        setClient(company_name, {
                            ...data,
                            goodPageId,
                            badPageId,

                        });
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
                setClient(company_name, {
                    ...data,
                    goodPageId: _goodPageId,
                    badPageId: _badPageId,

                });
                res.status(200).json({
                    ...data,
                    goodPageId: _goodPageId,
                    badPageId: _badPageId,
                    comments: {
                        goodComments: goodComments.splice(START_INDEX_GD_COMMENTS, NUM_OF_COMMENTS_PER_PAGE),
                        badComments: badComments.splice(START_INDEX_BD_COMMENTS, NUM_OF_COMMENTS_PER_PAGE)
                    }
                });
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
