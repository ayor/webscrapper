const Queue = require("bull");
const scrapeProcess = require("../jobs/jobs");

const firstQueue = new Queue("firstQueue", {
    redis: process.env.REDIS_URL,
});

firstQueue.process(scrapeProcess); 

const scrapeData = async (data) => {
    
    await firstQueue.add(data)
}

module.exports = scrapeData; 