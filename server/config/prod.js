const { DAYS, HOURS, MINS, SECS, MILLIS } = require('./const').MAX_AGE;

module.exports = {
    mongoURI: process.env.MONGO_URI,
    cookies: {
        maxAge: DAYS * HOURS * MINS * SECS * MILLIS,
        keys: [ process.env.COOKIE_KEY ]
    },
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        proxy: true,
        scope: ['profile', 'email', 'openid']
    },
    facebook: {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: '/auth/facebook/callback',
        proxy: true,
        profileFields: ['id', 'name', 'displayName', 'email'],
        scope: 'email'
    },
    linkedin: {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: '/auth/linkedin/callback',
        proxy: true,
        scope: ['r_emailaddress', 'r_liteprofile']
    },
    twitter: {
        consumerKey: process.env.TWITTER_CLIENT_ID,
        consumerSecret: process.env.TWITTER_CLIENT_SECRET,
        callbackURL: '/auth/twitter/callback',
        proxy: true
    }
};