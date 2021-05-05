const { microsoftAPI, googleAPI } = require('../../apis');
const { microsoft } = require('../../config/const');

module.exports = async input => {
    if (!input || !input.reviews) return {};

    // Gathers and formats the Headers for Microsoft API
    let headers = input.reviews.map(review => {
        return { id: review.id, language: "en", text: review.header };
    });

    // console.log(headers);

    // Submits headers to Microsoft NLP API
    let processed_headers = await microsoftAPI(headers);
    headers = processed_headers.map((item, ndx) => {
        return { ...item, text: processed_headers[ndx].text };
    });

    // console.log(headers);

    // Gathers and formats the Reviews for Microsoft API
    let reviews = input.reviews.map(review => {
        if (!review.comments) return null;
        return { id: review.id, language: "en", text: review.comments.substring(0, microsoft.STRING_SIZE) }
    });

    // console.log(reviews);

    // Submits reviews to Microsoft NLP API
    let processed_reviews = await microsoftAPI(reviews);
    reviews = processed_reviews.map((item, ndx) => {
        return { ...item, text: processed_reviews[ndx].text };
    });

    // console.log(reviews);

    // Merges the Headers and Reviews back together.
    let merged = [];
    for (let ndx = 0; ndx < reviews.length; ndx++) {
        const header = headers.filter(item => item.id === reviews[ndx].id)[0];

        merged.push({
            ...input.reviews[ndx],
            id: header.id,
            header_result: header,
            comment_result: reviews[ndx]
        });
    }

    // console.log(merged);

    // Split result into two lists: Negatives and Positives, mixed counts as smaller of two
    let negative = merged.filter(item => item.comment_result.sentiment === "negative");
    let positive = merged.filter(item => item.comment_result.sentiment === "positive");
    if (negative.length < positive.length) {
        merged.forEach(item => {
            if (item.comment_result.sentiment === "mixed")
                negative.push(item);
        });
    } else {
        merged.forEach(item => {
            if (item.comment_result.sentiment === "mixed")
                positive.push(item);
        });
    }

    // Sort negatives by sentiment value
    negative.sort((first, second) => {
        return second.comment_result.confidenceScores.negative - first.comment_result.confidenceScores.negative;
    });

    // console.log(negative);

    // Sort positives by sentiment value
    positive.sort((first, second) => {
        return second.comment_result.confidenceScores.positive - first.comment_result.confidenceScores.positive;
    });

    // console.log(positive);

    // Take the 5% highest valued items from each of Negatives &
    // Positives and push them through Google NLP API
    let sliceNdx = Math.min(negative.length, Math.min(positive.length, Math.max(5, Math.ceil((positive.length + negative.length) / 20.0))));
    console.log("Slice Index: " + sliceNdx);

    let temp = negative.slice(0, sliceNdx);
    // console.log(temp);
    let neg = temp.map(
        review => {
            if (!review.comments) return "";
            return review.comments.substring(0, 2000);
        }
    );

    // console.log(neg);

    try {
        neg = await googleAPI(neg);
    } catch (error) {
        console.log("Google Neg Error");
        console.log(error);
    }

    temp = positive.slice(0, sliceNdx);
    // console.log(temp);
    let pos = temp.map(
        review => {
            if (!review.comments) return "";
            return review.comments.substring(0, 2000);
        }
    );

    // console.log(pos);

    try {
        pos = await googleAPI(pos);
    } catch (error) {
        console.log("Google Pos Error");
        console.log(error);
    }

    // Format Results from Google NLP and Microsoft NLP and return the new Object
    return {
        negative: {
            google: neg,
            all: negative
        },
        positive: {
            google: pos,
            all: positive
        },
        merged,
        initial: input.reviews,
        score: input.score
    };
};