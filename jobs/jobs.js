const redis = require('redis');
let client = redis.createClient(process.env.REDIS_URL, { no_ready_check: true });
const pageScraper = require('../scrapper/pageScrapper');
const puppeteerBrowser = require('../scrapper/browser');
const analyzeReviews = require('../util/analyzeReviews');

const scrapeProcess = async ({ data }) => {
    try {
        let { company_name, _badPageId, _goodPageId } = data;
        let browser = await puppeteerBrowser();
        let { reviews, numberReviews } = await pageScraper.scrapper.glassdoor_scrapper(browser, company_name);
        //         let response = await pageScraper.scrapper.indeed_scrapper( browser, company_name, false );
        
                let { goodComments, badComments } = analyzeReviews([...reviews], numberReviews); //, ...response.reviews

        let goodPercent = ((goodComments.length / (goodComments.length + badComments.length)) * 100).toFixed(2) || 0;
        let badPercent = (100 - goodPercent).toFixed(2) || 0;
        client.get(company_name, (err, data) => {
            let __totalReviews;
            if (err) {
                throw new Error(err);
            }
            data = JSON.parse(data);
            /**
             * add the total number of reviews
             * concat the good and bad reviews
             */
            let ind_reviews = numberReviews.toString().split("K");
            let old_reviews = data.numberReviews.toString().split("K");


            if (ind_reviews.length > 1 || old_reviews.length > 1) {
                __totalReviews = +ind_reviews[0] + +old_reviews[0] + "K";
            } else {
                __totalReviews = +ind_reviews[0] + +old_reviews[0]
            }

            let _updatedBadCommments = [...data.comments.badComments, ...badComments];
            let _updatedGoodCommments = [...data.comments.goodComments, ...goodComments];


            client.setex(company_name,3600, JSON.stringify({
                company_name,
                comments: { badComments: _updatedBadCommments, goodComments: _updatedGoodCommments },
                goodPercent,
                goodPageId: _goodPageId,
                badPageId: _badPageId,
                badPercent,
                reviewStatus: "ACT",
                numberReviews: __totalReviews || 0,
            }));
        })

        // console.log(job.id);

    } catch (error) {
        console.log(error)
    }


}


module.exports = scrapeProcess;