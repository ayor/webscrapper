// metrics utility functions
const processMicrosoftConfidenceScore = scores => {
    return 5.0 * (1.0 - scores.negative);
};

const processKeywordMicrosoftSentences = (keyword, input) => {
    try {
        return input.sentences
            .map(sentence => processMicrosoftConfidenceScore(sentence["confidenceScores"]))
            .reduce((sum, val) => sum + val, 2.5) / input.sentences.length;
    } catch (error) {
        console.log("Process Overall - Microsoft Keywords Sentences Error");
        console.log(error);
    }
    return 2.5;
};

const processKeywordMicrosoft = (keyword, input) => {
    try {
        const headerScore = processKeywordMicrosoftSentences(keyword, input.header_result) * weights.header;
        const commentScore = processKeywordMicrosoftSentences(keyword, input.comment_result) * weights.comment;
        return (headerScore + commentScore) / (weights.header + weights.comment);
    } catch (error) {
        console.log("Process Overall - Microsoft Keyword Error");
        console.log(error);
    }
    return 2.5;
};

const containsKeywordMicrosoft = (item, keyword) => {
    const validHeader = item.header_result.sentences.find(sentence => sentence.text.includes(keyword));
    const validComment = item.comment_result.sentences.find(sentence => sentence.text.includes(keyword));
    return !!validHeader || !!validComment;
};

const processKeywordsMicrosoft = (keyword, input) => {
    try {
        const valid = input.filter(item => containsKeywordMicrosoft(item, keyword));
        const result = valid.map(item => processKeywordMicrosoft(keyword, item))
            .reduce((sum, val) => sum + val, 2.5) / valid.length;
        if (result > 5) return 2.5;
        return result;
    } catch (error) {
        console.log("Process Overall - Microsoft Keywords Error");
        console.log(error);
    }
    return 2.5;
};

const processKeywordGoogle = (keyword, input) => {
    try {
        const salienceScore = input.salience * weights.google.salience;
        let sentimentScore = 5.0 * (Math.abs(input.sentiment.score) * input.sentiment.magnitude) * weights.google.sentiment;
        return (salienceScore + sentimentScore) / (weights.google.sentiment + weights.google.salience);
    } catch (error) {
        console.log("Process Overall - Google Keyword Error");
        console.log(error);
    }
    return 2.5;
};

const containsKeywordGoogle = (input, keyword) => {
    const validResult = input.find(item => item.name.includes(keyword));
    return !!validResult;
};

const processKeywordsGoogle = (keyword, input) => {
    try {
        const valid = input.filter(item => containsKeywordGoogle(item, keyword));
        const result = valid.map(item => processKeywordGoogle(keyword, item))
            .reduce((sum, val) => sum + val, 2.5) / valid.length;
        if (result > 5) return 2.5;
        return result;
    } catch (error) {
        console.log("Process Overall - Google Keywords Error");
        console.log(error);
    }
    return 2.5;
};

const containsKeywordRedditMicrosoft = (item, keyword) => {
    const validHeader = item.sentences.find(sentence => sentence.text.includes(keyword));
    const validComment = item.sentences.find(sentence => sentence.text.includes(keyword));
    return !!validHeader || !!validComment;
};

const processKeywordsRedditMicrosoft = (keyword, input) => {
    try {
        const valid = input.filter(item => containsKeywordRedditMicrosoft(item, keyword));
        return valid.map(item => processKeywordMicrosoftSentences(keyword, item))
            .reduce((sum, val) => sum + val, 2.5) / valid.length;
    } catch (error) {
        console.log("Process Overall - Reddit Microsoft Keywords Error");
        console.log(error);
    }
    return 2.5;
};

const processKeywordReddit = (keyword, input) => {
    try {
        const newGoogle = [ ...input.positive.google, ...input.negative.google ];
        const newAll = [ ...input.positive.all, ...input.negative.all ];

        const googleScore = processKeywordsGoogle(keyword, newGoogle) * weights.google.overall;
        const microsoftScore = processKeywordsRedditMicrosoft(keyword, newAll) * weights.microsoft;

        console.log("Reddit Google Score: " + googleScore);
        console.log("Reddit Microsoft Score: " + microsoftScore);

        return (googleScore + microsoftScore) / (weights.google.overall + weights.microsoft);
    } catch (error) {
        console.log("Process Overall - Reddit Process Keyword Error");
        console.log(error);
    }
    return 2.5;
};

const processKeyword = (keyword, input) => {
    try {
        const newGoogle = [ ...input.positive.google, ...input.negative.google ];
        const newAll = [ ...input.positive.all, ...input.negative.all ];

        const googleScore = processKeywordsGoogle(keyword, newGoogle) * weights.google.overall;
        const microsoftScore = processKeywordsMicrosoft(keyword, newAll) * weights.microsoft;

        console.log("Regular Google Score: " + googleScore);
        console.log("Regular Microsoft Score: " + microsoftScore);

        return (googleScore + microsoftScore) / (weights.google.overall + weights.microsoft);
    } catch (error) {
        console.log("Process Overall - Process Keyword Error");
        console.log(error);
    }
    return 2.5;
};

const processKeywordScore = (keyword, input) => {
    try {
        let scoreSum = 0.0;

        scoreSum += processKeywordReddit(keyword, input.reddit) * weights.reddit;
        scoreSum += processKeyword(keyword, input.indeed) * weights.indeed;
        scoreSum += processKeyword(keyword, input.kununu) * weights.kununu;

        console.log(`Process Score for keyword ${keyword}: ${scoreSum / (weights.reddit + weights.indeed + weights.kununu)}`);

        return scoreSum / (weights.reddit + weights.indeed + weights.kununu);
    } catch (error) {
        console.log("Process Overall - Process Keyword Score");
    }
    return 2.5;
};

module.exports = (input, keywords) => {
    try {
        return keywords.map(keyword => processKeywordScore(keyword, input))
            .reduce((sum, val) => sum + val, 2.5) / keywords.length;
    } catch (error) {
        console.log("Process Overall - Process Metric");
    }
    return 2.5;
};