const indeed_uri = require('../../config/config').INDEED_URI;
const __url = indeed_uri;


module.exports = {
    INDEED_SCRAPPER: async (browser, company_name) => {

        try {
            let page = await browser.newPage();
            //set user agent to prevent the site from treating this scrapper as a bot;
            const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
            await page.setUserAgent(userAgent);
            console.log(`Navigating to ${__url}...`);
            await page.goto(__url);
            await page.type('#exploreCompaniesWhat', company_name);
            await page.click('.icl-WhatWhere-buttonWrapper .icl-Button');
            await page.waitForSelector('#cmp-discovery');
            const review_link = await page.$eval('#cmp-discovery > div.cmp-discovery-main.cmp-discovery-curated.clearfix > div > div:nth-child(2) > div > div.cmp-CompanyWidget-links > a', link => link.href)
            await page.goto(review_link);
            const company_reviews = await page.$$eval("div.cmp-Review-content", contents => {
            const comments = Array.from(contents)
                .map(comment => comment.innerText.trim());
            const result = [];
            comments.forEach(el => {
                let [title, employee, comment] = el.split('\n');
                result.push({ title, employee, comment });
            });
            return result;
        })
            return company_reviews;
        } catch (error) {
            throw error
        }
    }
}
