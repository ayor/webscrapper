module.exports = {
    MAX_AGE: {
        DAYS: 30,
        HOURS: 24,
        MINS: 60,
        SECS: 60,
        MILLIS: 1000
    },
    RESPONSE: {
        TYPE: {
            INVALID: "INVALID",
            CACHED: "CACHED",
            COMPUTED: "COMPUTED"
        }
    },
    reddit: {
        MAX_COMMENTS: 50,
        MAX_SUBMISSIONS: 50,
        QUERY_STRING: "+((worked+for)|employee|boss|career|management)+(culture|salary|management|benefits)+(awful|bad|horrible|(fuck+you))",
        BASE_URL : "https://api.pushshift.io/reddit"
    },
    indeed: {
        MAX_OFFSET: 5,
        BASE_URL: "https://indeed-com.p.rapidapi.com",
        HOST: {
            "x-rapidapi-host": "indeed-com.p.rapidapi.com",
            "useQueryString": true
        },
        scrape: {
            BASE_URL: "https://www.indeed.com"
        }
    },
    microsoft: {
        SLICE_SIZE: 10,
        STRING_SIZE: 5000,
        BASE_URL: "https://microsoft-text-analytics1.p.rapidapi.com",
        SHOW_STATS: true,
        HOST: {
            "x-rapidapi-host": "microsoft-text-analytics1.p.rapidapi.com",
            "useQueryString": true,
            "content-type": "application/json",
            "accept": "application/json"
        }
    },
    career_bliss: {
        BASE_URL: "https://www.careerbliss.com"
    },
    kununu: {
        BASE_URL: "https://www.kununu.com"
    },
    weights: {
        kununu: 1.0,
        indeed: 1.0,
        reddit: 1.0,
        microsoft: 1.0,
        rating: 1.0,
        header: 1.0,
        comment: 1.0,
        google: {
            overall: 1.0,
            salience: 0.2,
            sentiment: 1.0
        }
    }
};