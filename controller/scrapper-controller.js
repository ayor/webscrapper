const Sentiment = require('sentiment'); 
const sentiment = new Sentiment();

const pageScraper = require('../scrapper/pageScrapper'); 
const puppeteerBrowser = require('../scrapper/browser'); 
const NUM_OF_COMMENTS_PER_PAGE = 6;

exports.getComments = async (req, res, next) => {
    try {
        const company_name = req.body.company_name.trim(); 
        const pageId = +req.query.pageId;

        if(!company_name){
            const err = new Error('Kindly enter a company name');
            err.status = 422; 
            throw err; 
        }

        if(!pageId){
            pageId = 1; 
        }

            let browser = await puppeteerBrowser();
            const START_INDEX = (NUM_OF_COMMENTS_PER_PAGE * +pageId) - NUM_OF_COMMENTS_PER_PAGE
            const results = await pageScraper.scrapper(browser, company_name);
            let goodComments=[];
            let badComments=[];
            // const comments =  results;

            results.forEach(com => {
              let resp = sentiment.analyze(com.comment);
              if(resp.score <= 1){
                  badComments.push(com); 
                  return; 
              }
              goodComments.push(com); 
            });
           
            res.status(200).json({
                comments: {
                    goodComments: goodComments.splice(START_INDEX, NUM_OF_COMMENTS_PER_PAGE),
                    badComments: badComments.splice(START_INDEX, NUM_OF_COMMENTS_PER_PAGE)
                },
                pageId
            })

    } catch (error) {
        console.log("Could not resolve the browser instance => ", error);
        if(!error.status){
            error.status = 500; 
        }
        next(error);
    }
}