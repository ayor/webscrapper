const pageScraper = require('../scrapper/pageScrapper');
const puppeteerBrowser = require('../scrapper/browser');
const analyzeReviews = require('./analyzeReviews');
const scrapeProcess = require("../queues/scrape-queue");

const getReviews = async (data) => {
    try {
        let { company_name, isFirstScrape } = data
        let totalReviews;
        let response = { reviews: [], numberReviews: 0 };
        let gd_reviews = [0];
        let browser = await puppeteerBrowser();
        let { reviews, numberReviews } = await pageScraper.scrapper.indeed_scrapper(browser, company_name, );

        /**
         * run background job to store the glassdoor reads on redis
         * 
         */
         await scrapeProcess(data)
        /* 
        */


        let ind_reviews = numberReviews.split("K");

        if (gd_reviews.length > 1 && ind_reviews.length > 1) {
            totalReviews = (+gd_reviews[0] + +ind_reviews[0]) + "K"
        } else {
            totalReviews = (+gd_reviews[0] + +ind_reviews[0]);
        }


        //analysis each review comment 
        return analyzeReviews([...reviews, ...response.reviews], totalReviews);
    } catch (error) {
        console.log(error);
    }
}

module.exports = getReviews;