const fetch = require('node-fetch');
const async = require('express-async-errors');
const url = require('url');
const https = require('https');
const api_key="c7vg2oiad3i9ikp8201g";

module.exports.getAutocomplete = getAutocomplete;
module.exports.getCompanyDescription = getCompanyDescription;
module.exports.getLatestPrice = getLatestPrice;
module.exports.getHistoricalData = getHistoricalData;
module.exports.getNews = getNews;
module.exports.getRecommendation = getRecommendation;
module.exports.getSocialSentiment = getSocialSentiment;
module.exports.getCompanyPeers = getCompanyPeers;
module.exports.getCompanyEarnings = getCompanyEarnings;
module.exports.getHistoricalData2 = getHistoricalData2;

/*
const tiingoAPIkey = 'ffe81d7770eace13300f255d4ec32f84f3cdcd28';
async function getAutocomplete(keyword) {
    let url = `https://api.tiingo.com/tiingo/utilities/search?query=${keyword}&token=${tiingoAPIkey}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET', headers: headers});
    let searchRes = await APIres.json();
    return searchRes;
}*/
async function getAutocomplete(keyword){
    let url = `https://finnhub.io/api/v1/search?q=${keyword}&token=${api_key}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET', headers: headers});
    let searchRes = await APIres.json();
    return searchRes;
}

async function getCompanyDescription(tickerName) {
    let url = `https://finnhub.io/api/v1/stock/profile2?symbol=${tickerName}&token=${api_key}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET', headers: headers});
    let companydesp = await APIres.json();
    return companydesp;
}


async function getLatestPrice(tickerName) {
    let url = `https://finnhub.io/api/v1/quote?symbol=${tickerName}&token=${api_key}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET', headers: headers});
    let latestprice = await APIres.json();
    return latestprice;
}

async function getHistoricalData(tickerName,from_unix,to_unix) {
    //first chart
    let url = `https://finnhub.io/api/v1/stock/candle?symbol=${tickerName}&resolution=5&from=${from_unix}&to=${to_unix}&token=${api_key}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET', headers: headers});
    let histRes = await APIres.json();
    return histRes;
}


async function getHistoricalData2(tickerName) {
    //get data in the last 2 years
    //resolution要考虑 1/D/5
    var date = new Date();
    var date1 = date.setFullYear(date.getFullYear()-2);
    to_unix = Math.floor(new Date().getTime()/1000);
    console.log('date111',to_unix)
    from_unix = Math.floor(date1/1000)
    let url = `https://finnhub.io/api/v1/stock/candle?symbol=${tickerName}&resolution=D&from=${from_unix}&to=${to_unix}&token=${api_key}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET', headers: headers});
    let histRes = await APIres.json();
    return histRes;
}



async function getNews(keyword) {
    // 时间差还要考虑一下
    to_date = new Date().toISOString().slice(0, 10)
    from_date = new Date(new Date().setDate(new Date().getDate() - 7 )).toISOString().slice(0, 10)
    let url = `https://finnhub.io/api/v1/company-news?symbol=${keyword}&from=${from_date}&to=${to_date}&token=${api_key}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET',headers: headers});
    let origRes = await APIres.json();      
    return origRes;
}

async function getRecommendation(keyword) {
    // 时间差还要考虑一下
    let url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${keyword}&token=${api_key}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET',headers: headers});
    let origRes = await APIres.json();      
    return origRes;
}

async function getSocialSentiment(keyword) {
    // 时间差还要考虑一下
    let url = `https://finnhub.io/api/v1/stock/social-sentiment?symbol=${keyword}&from=2022-01-01&token=${api_key}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET',headers: headers});
    let origRes = await APIres.json();      
    return origRes;
}

async function getCompanyPeers(keyword) {
    // 时间差还要考虑一下
    let url = `https://finnhub.io/api/v1/stock/peers?symbol=${keyword}&token=${api_key}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET',headers: headers});
    let origRes = await APIres.json();      
    return origRes;
}

async function getCompanyEarnings(keyword) {
    // null转换成0
    let url = `https://finnhub.io/api/v1/stock/earnings?symbol=${keyword}&token=${api_key}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET',headers: headers});
    let origRes = await APIres.json();      
    return origRes;
}






