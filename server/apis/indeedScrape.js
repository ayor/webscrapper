const { indeed } = require('../config/const');
const Phantom = require('phantom');
const cheerio = require('cheerio');

// https://www.indeed.com/companies/search?q=walmart&l=&from=discovery-cmp-front-door

const getScores = content => {
    const result = {};
    try {
        for (let ndx = 0; ndx < content.length; ndx++) {
            try {
                const category = content[ndx].children[content[ndx].children.length - 1].children[0].children[0].data;
                result[category] = content[ndx].children[0].children[0].data;
            } catch (error) {
                console.log("Indeed Inner Scores Error");
                console.log(error);
            }
        }
    } catch (error) {
        console.log("Indeed Scores Error");
        console.log(error);
    }

    return result;
};

const getRating = content => {
    try {
        return content['0'].children[0].data;
    } catch (error) {
        console.log("Indeed Rating Error");
        console.log(error);
    }
    return 2.5;
};

// /reviews?fcountry=ALL&start=20

const getOther = content => {
    const result = {};

    try {
        if (content && content.children && content.children.length) {
            if (content.children[0] && content.children[0].children) {
                const pros = content.children[0].children[1];
                if (pros && pros.children && pros.children.length)
                    result.pros = pros.children[0].children[0].children[0].data;
            }

            if (content.children[1] && content.children[1].children) {
                const cons = content.children[1].children[1];
                if (cons && cons.children && cons.children.length)
                    result.cons = cons.children[0].children[0].children[0].data;
            }
        }
    } catch (error) {
        console.log("Indeed Pros Cons Error");
        console.log(error);
    }

    return result;
};

const getReview = (content, id) => {
    const newItem = {};
    newItem.id = id;
    newItem.rating = content[0].children[0].children[0].attribs.content;
    newItem.header = content[1].children[0].children[0].children[0].data;
    newItem.comment = content[1].children[2].children[0].children[0].children[0].children[0].children[0].data;
    newItem.other = getOther(content[1].children[3].children[0]);
    return newItem;
};

const scrapeReviews = async url => {
    const result = [];
    const path = "/reviews?fcountry=ALL";
    const instance = await Phantom.create();
    let id = 0;

    try {
        let page = await instance.createPage();
        await page.on("onResourceRequested", requestData => {
            // console.info('Requesting', requestData.url);
        });

        await page.open(url + path);
        let content = cheerio.load(await page.property('content'));
        let articles = content('div.cmp-Review');

        console.log(articles);

        let reviews = [];
        for (let ndx = 0; ndx < articles.length; ndx++)
            reviews.push(articles[ndx]);

        reviews.forEach(article => {
            // console.log(article.children[1]);

            const newItem = getReview(article.children[1].children, id);
            if (newItem && newItem.header) {
                result.push(newItem);
                id++;
            }
        });

        for (let ndx = 1; ndx < 5; ndx++) {
            try {
                page = await instance.createPage();
                await page.on("onResourceRequested", requestData => {
                    // console.info('Requesting', requestData.url);
                });

                await page.open(url + path + "&start=" + (ndx * 20));
                let content = cheerio.load(await page.property('content'));
                let articles = content('.cmp-Review');

                let reviews = [];
                for (let ndx = 0; ndx < articles.length; ndx++)
                    reviews.push(articles[ndx]);

                reviews.forEach(article => {
                    const newItem = getReview(article.children[1].children, id);
                    if (newItem && newItem.header) {
                        result.push(newItem);
                        id++;
                    }
                });
            } catch (error) {
                console.log("Indeed Page Error");
                console.log(error);
            }
        }
    } catch (error) {
        console.log("Indeed Reviews Error");
        console.log(error);
    }

    return result;
};

module.exports = async query => {
    // let findCompanyURL = `https://cors-anywhere.herokuapp.com/${career_bliss.BASE_URL}/search/?q=${query}&l=&typeFilter=company&sf=true`;
    let findCompanyURL = `${indeed.scrape.BASE_URL}/companies/search?q=${query}&l=&from=discovery-cmp-front-door`;
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
            content = cheerio.load(await page.property('content'));
            company = content('.cmp-CompanyWidget-name')['0'];
        }

        let companyURL = indeed.scrape.BASE_URL + company.attribs.href;
        try {
            page = await instance.createPage();
            await page.on("onResourceRequested", requestData => {
                // console.info('Requesting', requestData.url);
            });

            await page.open(companyURL);
            content = cheerio.load(await page.property('content'));

            const scores = getScores(content('.cmp-DetailedHappiness-scoreSection'));
            const rating = getRating(content('.cmp-CompactHeaderCompanyRatings-value'));

            result.score = { scores, rating };
            result.reviews = await scrapeReviews(companyURL);
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