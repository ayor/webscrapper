const { microsoftAPI, googleAPI } = require('../../apis');
const { microsoft } = require('../../config/const');

module.exports = async input => {
    if (!input || !input.comments || !input.submissions) return {};

    // Gathers and formats the Comments for Microsoft API
    const comments = input.comments.map(comment => {
        return { id: comment.id, language: "en", text: comment.body.substring(0, microsoft.STRING_SIZE) }
    });

    // console.log(comments);

    // Gathers and formats the Submissions for Microsoft API
    const submissions = input.submissions.map(submission => {
        return { id: submission.id, language: "en", text: submission.selftext.substring(0, microsoft.STRING_SIZE) }
    });

    // console.log(submissions);

    // Submits the Merged reviews to Microsoft NLP API
    let merged = [ ...comments, ...submissions ];
    let processed = await microsoftAPI(merged);
    merged = processed.map(item => {
        let text = merged.filter(score => score.id === item.id)[0].text;
        return { ...item, text };
    });

    // console.log(processed);

    // Split result into two lists: Negatives and Positives, mixed counts as smaller of two
    let negative = merged.filter(item => item.sentiment === "negative");
    let positive = merged.filter(item => item.sentiment === "positive");
    if (negative.length < positive.length) {
        merged.forEach(item => {
            if (item.sentiment === "mixed")
                negative.push(item);
        });
    } else {
        merged.forEach(item => {
            if (item.sentiment === "mixed")
                positive.push(item);
        });
    }

    // Sort negatives by sentiment value
    negative.sort((first, second) => {
        return second.confidenceScores.negative - first.confidenceScores.negative;
    });

    // console.log(negative);

    // Sort positives by sentiment value
    positive.sort((first, second) => {
        return second.confidenceScores.positive - first.confidenceScores.positive;
    });

    // console.log(positive);

    // Take the 5% highest valued items from each of Negatives &
    // Positives and push them through Google NLP API
    let sliceNdx = Math.min(negative.length, Math.min(positive.length, Math.max(5, Math.ceil((positive.length + negative.length) / 20.0))));

    let neg = null;
    try {
        neg = await googleAPI(negative.slice(0, sliceNdx).map(
            review => {
                return review.text.substring(0, 2000);
            })
        );
    } catch (error) {
        console.log("Google Neg Error");
        console.log(error);
    }

    let pos = null;
    try {
        pos = await googleAPI(positive.slice(0, sliceNdx).map(
            review => {
                return review.text.substring(0, 2000);
            })
        );
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
        processed
    };
};