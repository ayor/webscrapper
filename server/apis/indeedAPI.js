const { rapidapi } = require('../config/keys');
const { indeed } = require('../config/const');

module.exports = async query => {
    const indeedAPI = require('axios').create({
        baseURL: indeed.BASE_URL,
        headers: { ...indeed.HOST, ...rapidapi }
    });

    let response = null;
    try {
        response = await indeedAPI.get("search/companies", {
            params: {
                name: query,
                offset: "0"
            }
        });
    } catch(error) {
        console.log("Indeed Request Error");
        console.log(error.response.data.message);
    }

    // console.log(response);

    let company = null;
    try {
        if (response && response.data.companies && response.data.companies.length > 0) {
            company = response.data.companies[0];
            company.reviews = [];

            for (let offset = 0; offset < indeed.MAX_OFFSET; offset++) {
                try {
                    response = await indeedAPI.get(
                        `get/company/${company.key}/reviews`,
                        { params: { offset } }
                    );

                    // console.log(response.data);

                    company.reviews = [ ...company.reviews, ...response.data.reviews ];

                    // console.log(company.reviews);

                    if (!response.data.pageInfo.hasNextPage) break;
                } catch (error) {
                    console.log("Indeed Reviews Error");
                    console.log(error.response.data.message);
                }
            }
        }
    } catch (error) {
        console.log("Indeed Error");
        console.log(error.response.data.message);
    }

    // console.log(company);

    return company;
};