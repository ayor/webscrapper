const { rapidapi } = require('../config/keys');
const { microsoft } = require('../config/const');

const microsoftAPI = require('axios').create({
    baseURL: microsoft.BASE_URL,
    headers: { ...microsoft.HOST, ...rapidapi },
    params: { showState: microsoft.SHOW_STATS }
});

module.exports = async reviews => {
    // reviews MUST BE in format: [ { id: "int", language: "en", text: text } ]

    // console.log(reviews);

    let result = [];
    if (reviews && reviews.length > 0 ) {
        for (let sliceStart = 0; sliceStart < reviews.length; sliceStart += microsoft.SLICE_SIZE) {
            let sliceEnd = Math.min(sliceStart + microsoft.SLICE_SIZE, reviews.length);

            try {
                const response = await microsoftAPI.post("sentiment", { documents: reviews.slice(sliceStart, sliceEnd) }, {});

                // console.log(response.data);
                // console.log(response.data.documents);
                if (response.data.errors.length > 0) console.log(response.data.errors[0]);

                if (response && response.data.documents && response.data.documents.length > 0) result = [ ...result, ...response.data.documents];
            } catch (error) {
                console.log("Microsoft Azure Error");
                console.log(error.response.data.error);
            }
        }


        // console.log(result);
    }

    return result;
};