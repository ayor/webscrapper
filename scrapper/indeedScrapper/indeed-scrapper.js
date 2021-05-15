const indeed_uri = require('../../config/config').INDEED_URI;

const __url = indeed_uri;


module.exports = {
    INDEED_SCRAPPER: async (browser, company_name) => {

        try {
            let review_link = `https://www.indeed.com/cmp/${company_name}/reviews`
            let page = await browser.newPage();
            //set user agent to prevent the site from treating this scrapper as a bot;
            const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
            await page.setUserAgent(userAgent);
            console.log(`Navigating to ${review_link}...`);
            await page.goto(review_link);
            //turns request interceptor on
            await page.setRequestInterception(true);
            //if the page makes a  request to a resource type of image or stylesheet then abort that            request
            page.on('request', request => {
                if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet')
                    request.abort();
                else
                    request.continue();
            });
            const numberReviews = await page.$eval(".cmp-CompactHeaderMenuItem-count", count=> count.innerText);

            const reviews = []; 
            const percentage = 0.2;
            const percentile = numberReviews <= 200 ?  percentage * +numberReviews : 200

            const numLinks = Math.floor(percentile/20); 

            for (let index = 0; index <= numLinks; index++) {
                    await page.goto(`https://www.indeed.com/cmp/${company_name}/reviews?start=${20*index}`); 
                   
                    const contents =  await page.$$eval("div.cmp-Review-content",  reviewcontents => {
                    
                        
                        return reviewcontents
                            .map(comment => comment.innerText.trim())
                            
                            
                    });
                    contents.forEach(el => {
                        let [title, employee, comment] = el.split('\n');
                        reviews.push({ title, employee, comment });
                    });
                }
          
            return {reviews, numberReviews};
        
        } catch (error) {
            throw error
        }
    }
}
