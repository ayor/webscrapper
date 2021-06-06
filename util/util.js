const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const redis = require('redis');

const pageScraper = require('../scrapper/pageScrapper');
const puppeteerBrowser = require('../scrapper/browser');
const REDIS_URL = process.env.REDIS_URL;
const client = redis.createClient(REDIS_URL);

const analyzeReview = async (company_name) => {
    try {
        let goodComments = [];
        let badComments = [];

        let browser = await puppeteerBrowser();
        let {reviews, numberReviews} = await pageScraper.scrapper.glassdoor_scrapper(browser, company_name);

        if (reviews.length < 20 || !numberReviews) {
            let response = await pageScraper.scrapper.glassdoor_scrapper(browser, company_name);
            reviews.concat(response.reviews);
            numberReviews = +response.numberReviews + +numberReviews
        }
//analysis each review comment 
        reviews.forEach(com => {
            let resp = sentiment.analyze(com.comment);
            if (resp.score < 1) {
                badComments.push(com);
                return;
            }
            goodComments.push(com);
        });
        // updatedReviews.reduce((acc, val) => acc.concat[val],[])
        return {
            goodComments,
            badComments,
            numberReviews
        }
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = analyzeReview;