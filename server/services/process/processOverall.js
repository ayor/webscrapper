const { weights } = require('../../config/const');
const processMetric = require('./processMetric');

const { inclusion, diversity,
    expression, collaboration,
    vision, values, respectful,
    appreciative, growth } = require('../../config/keywords');

// process into individual metrics
const processMetrics = input => {
    const metrics = {};
    // inclusion
    metrics.inclusion = processMetric(input, inclusion);
    // diversity
    metrics.diversity = processMetric(input, diversity);
    // expression
    metrics.expression = processMetric(input, expression);
    // collaboration
    metrics.collaboration = processMetric(input, collaboration);
    // vision
    metrics.vision = processMetric(input, vision);
    // values
    metrics.values = processMetric(input, values);
    // respectful
    metrics.respectful = processMetric(input, respectful);
    // appreciative
    metrics.appreciative = processMetric(input, appreciative);
    // growth
    metrics.growth = processMetric(input, growth);
    return metrics;
};

// process into pros and cons
const processProsAndCons = (input, currentResult) => {
    // TODO: Implement Pros and Cons Creation based on Metrics
    return {};
};

// process into summary
const processSummary = (input, currentResult) => {
    // TODO: Implement Summary Creation based on Metrics and Pros and Cons
    return {};
};

// process into overall scores
const processScores = currentResult => {
    // TODO: Implement Score Creation based on Metrics, Pros and Cons, and Summary
    return {};
};

// process all overall
const processOverall = input => {
    const newResult = {};
    newResult.metrics = processMetrics(input);
    newResult.prosAndCons = processProsAndCons(input, newResult);

    newResult.summary = processSummary(input, newResult);
    newResult.scores = processScores(newResult);
    return newResult;
};

module.exports =  {
    processMetrics,
    processSummary,
    processProsAndCons,
    processScores,
    processOverall
};