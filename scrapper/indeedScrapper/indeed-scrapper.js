const indeed_uri = require('../../config/config').INDEED_URI;



module.exports = {
    INDEED_SCRAPPER: async (browser, company_name, isFirstScrape, Page) => {

        try {
            let review_link = `https://www.indeed.com/cmp/${company_name}/reviews?fcountry=ALL`;
            let url = new URL(review_link);

            let page = await browser.newPage();
            await page.setDefaultTimeout(0);
            await page.setRequestInterception(true);
            //if the page makes a  request to a resource type of image or stylesheet then abort that            request
            page.on('request', request => {
                if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet')
                    request.abort();
                else
                    request.continue();
            });
            //set user agent to prevent the site from treating this scrapper as a bot;
            const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
            await page.setUserAgent(userAgent);
            console.log(`Navigating to ${url.href}...`);
            await page.goto(url.href);
            //turns request interceptor on
            // await page.waitForSelector('.cmp-CompactHeaderMenuItem-count');
            // const getRev = await page.$(".cmp-CompactHeaderMenuItem-count");
            const totalReviewsClassName = "#cmp-skip-header-desktop > div > ul > li.css-4b1u8p-Box.eu4oa1w0 > a > div";
            const reviewsListClassName = ".css-lqffld-Box";
            const getRev = await page.$(totalReviewsClassName);
            if (getRev) {
                let numberReviews = await page.$eval(totalReviewsClassName, count => count.innerText);
                const [totalReviews, other] = numberReviews.split("K");
                __numberReviews = other === "" ? totalReviews * 1000 : totalReviews;
                const reviews = [];
                const percentage = 0.5;
                const percentile = __numberReviews >= 1000 ? percentage * __numberReviews : __numberReviews;
                const divisor = percentile * 0.4
                const numLinks = Math.floor(percentile / divisor);

                if (isFirstScrape) {

                    await page.goto(`${review_link}&start=${20 * Page}`);
                    await page.waitForSelector(reviewsListClassName);
                    const contents = await page.$$eval(reviewsListClassName, reviewcontents => {

                        return reviewcontents
                            .map(comment => comment.innerText.trim())

                    });
                    contents.forEach(el => {
                        let id = Math.random() * Math.random() * 1000000;
                        let [rating, title, employee, ...comment] = el.split('\n');
                        //split title for date
                        let employeeData = employee.split('-');
                        
                        let comments = comment.filter((com, ind)=> ind < 5).join();

                        let year = employeeData[employeeData.length - 1]
                            .split(',')[1];
                        reviews.push({ id, title, year, employee, comment: comments, scrapper: "indeed.com" });
                    });


                } else {
                    for (let index = 2; index < numLinks; index++) {
                        await page.goto(`${review_link}&start=${20 * index}`);
                        await page.waitForSelector(".cmp-Review-content");

                        const contents = await page.$$eval("div.cmp-Review-content", reviewcontents => {

                            return reviewcontents
                                .map(comment => comment.innerText.trim())

                        });
                        contents.forEach(el => {
                            let id = Math.random() * Math.random() * 1000000;
                            let [rating, title, employee, ...comment] = el.split('\n');
                            //split title for date
                            let employeeData = employee.split('-');
                            let comments = comment.filter((com, ind)=> ind < 5).join();

                            let year = employeeData[employeeData.length - 1]
                                .split(',')[1];
                            reviews.push({ id, title, year, employee, comment: comments, scrapper: "indeed.com" });
                        });
                    }

                }

                reviews.sort((a, b) => b.year - a.year);
                console.log("done - indeed")

                return { reviews, numberReviews: __numberReviews > reviews.length ? numberReviews.replace("k", "K") : reviews.length.toString() };
            }
            return { reviews: [], numberReviews: 0 }
        } catch (error) {
            console.log(error);
        }
    }
}
