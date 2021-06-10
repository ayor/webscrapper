// const scrapeReviews = require("../util/scrapeReviews");
const setClient = require('../util/setClient');
const getReviews = require('../util/getReviews');
const redis = require('redis');
let client = redis.createClient(process.env.REDIS_URL, { no_ready_check: true });
const NUM_OF_COMMENTS_PER_PAGE = 20;

const scrapeReviews = async ({ res, company_name, _badPageId, _goodPageId }) => {

    const START_INDEX_GD_COMMENTS = (NUM_OF_COMMENTS_PER_PAGE * +_goodPageId) - NUM_OF_COMMENTS_PER_PAGE;
    const START_INDEX_BD_COMMENTS = (NUM_OF_COMMENTS_PER_PAGE * +_badPageId) - NUM_OF_COMMENTS_PER_PAGE;

    client.get(company_name, async (err, data) => {
        if (err) {
            console.log(err);
        }
        //scrape for comments if data does not exist on the redis cache
        if (!data) {
            let { goodComments, badComments, numberReviews } = await getReviews({ 
                company_name, 
                _badPageId, 
                _goodPageId,
                isFirstScrape: true,
                Page: 1
                 });

            let goodPercent = ((goodComments.length / (goodComments.length + badComments.length)) * 100).toFixed(2) || 0;
            let badPercent = (100 - goodPercent).toFixed(2) || 0;

            //stores scrapped results/reviews on redis 
            setClient(company_name, {
                company_name,
                comments: { badComments, goodComments },
                goodPercent,
                goodPageId: _goodPageId,
                badPageId: _badPageId,
                badPercent,
                reviewStatus: "PEN",
                numberReviews: numberReviews || "0"
            });

            //sends reviews to user 
            res.status(200).json({
                comments: {
                    goodComments: goodComments.splice(START_INDEX_GD_COMMENTS, NUM_OF_COMMENTS_PER_PAGE),
                    badComments: badComments.splice(START_INDEX_BD_COMMENTS, NUM_OF_COMMENTS_PER_PAGE)
                },
                numberReviews: numberReviews || 0,
                goodPageId: _goodPageId,
                badPageId: _badPageId,
                goodPercent,
                badPercent,
                reviewStatus: "PEN"
            })
        } else {
            data = JSON.parse(data);
            // let __oldGoodComments = data.comments.goodComments;
            // let __oldBadComments = data.comments.badComments;

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
                    goodComments: data.comments.goodComments.splice(START_INDEX_GD_COMMENTS, NUM_OF_COMMENTS_PER_PAGE),
                    badComments: data.comments.badComments.splice(START_INDEX_BD_COMMENTS, NUM_OF_COMMENTS_PER_PAGE)
                }
              
            });


        }
    })

}

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
        await scrapeReviews({ res, company_name, _badPageId, _goodPageId });
    } catch (error) {
        // console.log("Could not resolve the browser instance => ", error);
        if (!error.status) {
            error.status = 500;
            error.message = "Could not resolve the browser instance";
        }
        next(error);
    }
}


exports.getMore = async (req,res, next)=>{
    try {
        const company_name = req.body.company_name.trim();
        // const pageId = +req.query.pageId;
        let _goodPageId = +req.query.goodPageId;
        let _badPageId = +req.query.badPageId;

        const START_INDEX_GD_COMMENTS = (NUM_OF_COMMENTS_PER_PAGE * +_goodPageId) - NUM_OF_COMMENTS_PER_PAGE;
        const START_INDEX_BD_COMMENTS = (NUM_OF_COMMENTS_PER_PAGE * +_badPageId) - NUM_OF_COMMENTS_PER_PAGE;
       
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

        let {
            goodComments,
            badComments,
            numberReviews
        } = await getReviews({company_name, isFirstScrape: false, Page: _badPageId  > _goodPageId ? _badPageId : _goodPageId});
        
        let goodPercent = ((goodComments.length / (goodComments.length + badComments.length)) * 100).toFixed(2) || 0;
        let badPercent = (100 - goodPercent).toFixed(2) || 0;


        res.status(200).json({
            comments: {
                goodComments: goodComments.splice(START_INDEX_GD_COMMENTS, NUM_OF_COMMENTS_PER_PAGE),
                badComments: badComments.splice(START_INDEX_BD_COMMENTS, NUM_OF_COMMENTS_PER_PAGE)
            },
            numberReviews: numberReviews || 0,
            goodPageId: _goodPageId,
            badPageId: _badPageId,
            goodPercent,
            badPercent,
            reviewStatus: "PEN"
        }); 
    } catch (error) {
         // console.log("Could not resolve the browser instance => ", error);
         if (!error.status) {
            error.status = 500;
            error.message = "Could not resolve the browser instance";
        }
        next(error);
    }
}