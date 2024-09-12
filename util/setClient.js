const redis = require('redis');

let client = redis.createClient(process.env.REDIS_URL, { no_ready_check: true });

const setClient = (companyName, data) => {
    client.setex(companyName,3600, JSON.stringify(data)); 
}

module.exports = setClient;