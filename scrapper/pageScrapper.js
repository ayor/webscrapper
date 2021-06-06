const indeed_scrapper = require('./indeedScrapper/indeed-scrapper').INDEED_SCRAPPER;
const career_scrapper = require('./careerBliss/careerBliss-scrapper').CAREER_BLISS_SCRAPPER;
const glassdoor_scrapper = require('./GlassdoorScrapper/glassdoor-scrapper').GLASSDOOR_SCRAPPER;

const scraperObject = {
    scrapper: {indeed_scrapper, career_scrapper, glassdoor_scrapper}
}

module.exports = scraperObject;