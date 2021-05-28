
const { default: axios } = require('axios');
const { WET_TRACKER } = require('../config/config');
const Analyze = require('../util/util');

// const pageScraper = require('../scrapper/pageScrapper');
// const puppeteerBrowser = require('../scrapper/browser');
// const NUM_OF_COMMENTS_PER_PAGE = 6;

exports.getComments = async (req, res, next) => {
    try {
        const company_name = req.body.company_name.trim();
        // const pageId = +req.query.pageId;
        let good_pageId = +req.query.goodPageId;
        let bad_pageId = +req.query.badPageId;


        if (!company_name) {
            const err = new Error('Kindly enter a company name');
            err.status = 422;
            throw err;
        }
        const response = await axios.get(WET_TRACKER.URL, {
            params:{
                auth_token: WET_TRACKER.AUTH_TOKEN,
                id: company_name,
                offset: good_pageId *10|| bad_pageId*10 || 0
            } 
        });

        if (!good_pageId) {
            good_pageId = 1;
        }

        if (!bad_pageId) {
            bad_pageId = 1;
        }

        // const START_INDEX_GD_COMMENTS = (NUM_OF_COMMENTS_PER_PAGE * +good_pageId) - NUM_OF_COMMENTS_PER_PAGE;
        // const START_INDEX_BD_COMMENTS = (NUM_OF_COMMENTS_PER_PAGE * +bad_pageId) - NUM_OF_COMMENTS_PER_PAGE;


        const { goodComments,
            badComments,
            goodPercent,
            badPercent } = Analyze(response.data.reviews); 

        res.status(200).json({
            comments: {
                goodComments,
                badComments
            },
            // totalReviews: numberReviews,
            goodPageId: good_pageId,
            badPageId: bad_pageId,
            goodPercent,
            badPercent
        })

    } catch (error) {
        // console.log("Could not resolve the browser instance => ", error);
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
}

/*
let browser = await puppeteerBrowser();


            let {reviews, numberReviews} = await pageScraper.scrapper.indeed_scrapper(browser, company_name);

            if(numberReviews < 20 || !numberReviews){
                let response = await pageScraper.scrapper.career_scrapper(browser, company_name);
                reviews.concat(response.reviews);
                numberReviews = +response.numberReviews + +numberReviews
            }

*/