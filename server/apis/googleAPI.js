const language = require('@google-cloud/language');

async function quickstart() {
    // Imports the Google Cloud client library
    const language = require('@google-cloud/language');

    // Instantiates a client
    const client = new language.LanguageServiceClient();

    // The text to analyze
    const text = 'Hello, world!';

    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the text
    const [result] = await client.analyzeSentiment({document: document});
    const sentiment = result.documentSentiment;

    console.log(`Text: ${text}`);
    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
}

module.exports = async reviews => {
    // reviews MUST BE in format: [ text ]
    // Instantiates a client
    const client = new language.LanguageServiceClient();

    // console.log(reviews);

    if (reviews && reviews.length > 0 ) {
        try {
            let result = reviews.map(review => client.analyzeEntitySentiment({ document: { content: review, type: 'PLAIN_TEXT' } }));
            result = (await Promise.all(result)).map(item => item[0].entities);

            // console.log(result);

            return result;
        } catch (error) {
            console.log("Google API Error");
            console.log(error);
        }
    }

    return [];
};