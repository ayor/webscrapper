const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const analyzeReview = (reviews, numberReviews) => {
    let goodComments = [];
    let badComments = [];

    reviews.forEach(com => {
        let resp = sentiment.analyze(com.comment);
        if (resp.score < 1) {
            badComments.push(com);
            return;
        }
        goodComments.push(com);
    });
    // updatedReviews.reduce((acc, val) => acc.concat[val],[])
    return {
        goodComments,
        badComments,
        numberReviews
    }
}

module.exports = analyzeReview;