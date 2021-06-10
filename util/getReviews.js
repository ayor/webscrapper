const pageScraper = require('../scrapper/pageScrapper');
const puppeteerBrowser = require('../scrapper/browser');
const analyzeReviews = require('./analyzeReviews');
const scrapeProcess = require("../queues/scrape-queue");

const getReviews = async (data) => {
    try {
        let { company_name, isFirstScrape } = data
        let browser = await puppeteerBrowser();
        let { reviews, numberReviews } = await pageScraper.scrapper.indeed_scrapper(browser, company_name, isFirstScrape);

        /**
         * run background job to store the glassdoor reads on redis
         * 
         */
         await scrapeProcess(data);
        /* 
        */

        //analysis each review comment 
        return analyzeReviews(reviews, numberReviews);
    } catch (error) {
        console.log(error);
    }
}

module.exports = getReviews;