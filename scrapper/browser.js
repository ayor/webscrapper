const puppeteer = require('puppeteer');

const startBrowser = async () =>{
    try {
        let browser;
        console.log('opening the browser...'); 
        browser = puppeteer.launch({
            args: ["--no-sandbox'],
            //executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            'ignoreHTTPSErrors': true
        });
        return browser; 
    } catch (error) {
        console.log("Could not create a browser instance => : ", error);
    }
};

module.exports = startBrowser; 
