const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const redis = require('redis');

const pageScraper = require('../scrapper/pageScrapper');
const puppeteerBrowser = require('../scrapper/browser');
const REDIS_URL = process.env.REDIS_URL;
const client = redis.createClient(REDIS_URL);

const analyzeReview = async (company_name) => {
    try {
        let test = sentiment.analyze("I really didn’t enjoy my time here. The workload was so heavy and I wasn’t treated well at all. I was basically just an errand boy for everyone else that was important, and all the other interns got treated the same way.");
        let goodComments = [];
        let badComments = [];

        let browser = await puppeteerBrowser();
        let {reviews, numberReviews} = await pageScraper.scrapper.indeed_scrapper(browser, company_name);

        if (numberReviews < 20 || !numberReviews) {
            let response = await pageScraper.scrapper.career_scrapper(browser, company_name);
            reviews.concat(response.reviews);
            numberReviews = +response.numberReviews + +numberReviews
        }

        reviews.forEach(com => {
            let resp = sentiment.analyze(com.comment);
            if (resp.score < 1) {
                badComments.push(com);
                return;
            }
            goodComments.push(com);
        });

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