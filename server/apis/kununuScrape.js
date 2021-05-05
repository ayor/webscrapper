const { kununu } = require('../config/const');
const Phantom = require('phantom');
const cheerio = require('cheerio');
const _ = require('lodash');

// https://www.kununu.com/us/search#/?q=walmart&country=COUNTRY_US

const scrapeHeader = header => {
    return header.children[1].children[0].data;
};

const scrapeRating = rating => {
    return rating.children[0].children[0].children[0].children[0].data;
};

const scrapeReview = (review, id) => {
    const newItem = {};
    if (!review || !review.children)
        return newItem;

    review.children.forEach(child => {
        if (child.attribs.class.includes("heading")) {
            newItem.header = scrapeHeader(child);
        } else if (child.attribs.class.includes("rating")) {
            newItem.rating = scrapeRating(child);
        } else if (child.attribs.class.includes("factor")) {
            const type = child.children[0].children[0].data;

            switch (type) {
                case "What I like":
                    newItem.pros = child.children[1].children[0].data;
                    break;
                case "What I dislike":
                    newItem.cons = child.children[1].children[0].data;
                    break;
                case "Suggestions for improvement":
                    newItem.comments = child.children[1].children[0].data;
                    break;
                default:
                    if (!newItem.other) newItem.other = [];
                    newItem.other.push({
                        type,
                        text: child.children[2].children[0].data,
                        score: child.children[1].children[0].attribs['data-score']
                    });
            }
        }
    });

    if (newItem.header) newItem.id = id;
    return newItem;
};

const scrapeReviews = async url => {
    const result = [];
    const instance = await Phantom.create();
    let id = 0;

    try {
        let page = await instance.createPage();
        await page.on("onResourceRequested", requestData => {
            // console.info('Requesting', requestData.url);
        });

        await page.open(url);
        let content = cheerio.load(await page.property('content'));
        let articles = content('article');

        let reviews = [];
        for (let ndx = 1; ndx < articles.length; ndx++)
            reviews.push(articles[ndx]);

        // return reviews;
        // console.log(reviews);

        reviews.forEach(article => {
            // console.log(article.children);
            article.children.forEach(block => {
                // console.log(block);
                block.children.forEach(review => {
                    const newItem = scrapeReview(review, id);
                    if (newItem && newItem.header) {
                        result.push(newItem);
                        id++;
                    }
                });
            });
        });

        for (let ndx = 2; ndx < 6; ndx++) {
            try {
                page = await instance.createPage();
                await page.on("onResourceRequested", requestData => {
                    // console.info('Requesting', requestData.url);
                });

                await page.open(url + "/" + ndx);
                let content = cheerio.load(await page.property('content'));
                let articles = content('article');

                reviews = [];
                for (let ndx = 1; ndx < articles.length; ndx++)
                    reviews.push(articles[ndx]);

                // return reviews;
                // console.log(reviews);

                reviews.forEach(article => {
                    // console.log(article.children);
                    article.children.forEach(block => {
                        // console.log(block);
                        block.children.forEach(review => {
                            const newItem = scrapeReview(review, id);
                            if (newItem && newItem.header) {
                                result.push(newItem);
                                id++;
                            }
                        });
                    });
                });
            } catch (error) {
                console.log("Kununu Page Error");
                console.log(error);
            }
        }
    } catch (error) {
        console.log("Kununu Reviews Error");
        console.log(error);
    }

    return result;
};

module.exports = async query => {
    let findCompanyURL = `${kununu.BASE_URL}/us/search#/?q=${query}&country=COUNTRY_US`;
    const instance = await Phantom.create();
    const result = {};

    try {
        let company = null, count = 0;
        while (!company || !company.attribs || !company.attribs.href) {
            if (count >= 5) return result;
            count++;

            let page = await instance.createPage();
            await page.on("onResourceRequested", requestData => {
                // console.info('Requesting', requestData.url);
            });

            await page.open(findCompanyURL);
            let content = cheerio.load(await page.property('content'));
            company = content('.company a')['0'];
        }

        let companyURL = kununu.BASE_URL + company.attribs.href;
        try {
            let page = await instance.createPage();
            await page.on("onResourceRequested", requestData => {
                // console.info('Requesting', requestData.url);
            });

            await page.open(companyURL);
            let content = cheerio.load(await page.property('content'));

            const scores = content('#card-profile-metrics');
            const overall_score = parseFloat(scores['0'].children[0].children[0].children[0].children[0].children[0].data.trim());

            const rate = scores['0'].children[0].children[2].children[0].children[0].children[0].data.trim();
            const recommend_rate = parseInt(rate) / 100.0;

            result.score = { overall_score, recommend_rate };
            result.reviews = await scrapeReviews(companyURL + "/reviews");
        } catch (error) {
            console.log("Kununu Inner Error");
            console.log(error);
        }
    } catch (error) {
        console.log("Kununu Request Error");
        console.log(error);
    }

    return result;
};