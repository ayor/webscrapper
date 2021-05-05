const query = require('../services/query');

module.exports = app => {
    app.get('/api/test', () => null);
    app.get('/api/query', query);
};