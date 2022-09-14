const express = require('express');
const outerAPI = require('./outerAPI');
const cors = require('cors');
const app = express();

/*
function checkArray(priceRes, tickerName) {
   if (Array.isArray(priceRes)) {
       console.log(`${tickerName} Record length: ${priceRes.length}`);
   } else {
       console.log(`${tickerName} Ticker Not Found`);
   }
}*/

function checkObject(priceRes, tickerName) {
   if (typeof priceRes === "object") {
       console.log(`${tickerName} Record length: ${Object.keys(priceRes).length}`);
   } else {
       console.log(`${tickerName} Ticker Not Found`);
   }
}

//允许跨域资源访问
app.use(cors());

app.get('/', function (req, res) {
   res.send('Hello World');
})


app.get('/api/v1.0.0/searchutil/:keyword', async function (req, res) {
   console.log(`\nSearch-utilities Call: ${req.params.keyword}`);
   // if not found, response is [] with length 0
   let origRes = await outerAPI.getAutocomplete(req.params.keyword);
   let msg = `${req.params.keyword} Search-utilities finished at ${Date()}\nLength of response: ${origRes['result'].length}`;
   console.log(msg);
   //filltered symbol not contain "."
   origResult = origRes['result'];
   const fillteredRes= origResult.filter(item => 
      !item.symbol.includes('.')&
      item.type=="Common Stock"
    );
   console.log(`Length of filltered result: ${fillteredRes.length}`)
   //return res.send(origRes);
   return res.send(fillteredRes);
})

app.get('/api/v1.0.0/companydesp/:tickerName', async function (req, res) {
   console.log(`\nCompany Description Data Call: ${req.params.tickerName.toUpperCase()}`);
   // if not found, response is {"detail":"Not found."}
   let origRes = await outerAPI.getCompanyDescription(req.params.tickerName);
   console.log(`${req.params.tickerName.toUpperCase()} Company Description Data finished at ${Date()}\n`);
   return res.send(origRes);
   // if (origRes)
   //     return res.status(200).json(origRes);
})


app.get('/api/v1.0.0/latestprice/:tickerName', async function (req, res) {
   console.log(`\nLatest Price Call: ${req.params.tickerName.toUpperCase()}`);
   // if not found, response is {"detail":"Not found."}
   let origRes = await outerAPI.getLatestPrice(req.params.tickerName);
   console.log(`${req.params.tickerName.toUpperCase()} Latest Price finished at ${Date()}\n`);
   return res.send(origRes);
})


app.get('/api/v1.0.0/histdata/:tickerName/:from_unix/:to_unix', async function (req, res) {
   console.log(`\nHistorical chart data Call: ${req.params.tickerName.toUpperCase()}\n`);
   let origRes = await outerAPI.getHistoricalData(req.params.tickerName,req.params.from_unix,req.params.to_unix);
   checkObject(origRes, req.params.tickerName.toUpperCase());
   console.log(`${req.params.tickerName.toUpperCase()} Historical chart data finished at ${Date()}\n`);
   return res.send(origRes); 
})

app.get('/api/v1.0.0/histdata2/:tickerName', async function (req, res) {
   console.log(`\nHistorical2 chart data Call: ${req.params.tickerName.toUpperCase()}\n`);
   let origRes = await outerAPI.getHistoricalData2(req.params.tickerName);
   checkObject(origRes, req.params.tickerName.toUpperCase());
   console.log(`${req.params.tickerName.toUpperCase()} Historical2 chart data finished at ${Date()}\n`);
   return res.send(origRes); 
})

app.get('/api/v1.0.0/news/:keyword', async function (req, res) {
   console.log(`\nNews Call: ${req.params.keyword.toUpperCase()}`);
   let a = await outerAPI.getNews(req.params.keyword);
   //get top 20 news
   count = 0;
   array = new Array()
   for (var i=0; i<a.length; i++){
   if (a[i]["category"] && a[i]["datetime"] && a[i]["headline"] && a[i]["id"] && a[i]["image"] && a[i]["related"] && a[i]["source"] && a[i]["summary"] && a[i]["url"] && count < 20){
    count += 1;
    array.push(a[i]);
   }}
   return res.send(array);
   
})

app.get('/api/v1.0.0/recommendationdata/:tickerName', async function (req, res) {
   console.log(`\nrecommendation chart data Call: ${req.params.tickerName.toUpperCase()}\n`);
   // if not found, response is object {"detail":"Error: Ticker 'xxxx' not found"}
   // otherwise response is array of object
   let origRes = await outerAPI.getRecommendation(req.params.tickerName);
   checkObject(origRes, req.params.tickerName.toUpperCase());
   console.log(`${req.params.tickerName.toUpperCase()} Recommendation data finished at ${Date()}\n`);
   return res.send(origRes); 
})

app.get('/api/v1.0.0/socialsentimentdata/:tickerName', async function (req, res) {
   console.log(`\nSocial sentiment data Call: ${req.params.tickerName.toUpperCase()}\n`);
   let origRes = await outerAPI.getSocialSentiment(req.params.tickerName);
   console.log(`${req.params.tickerName.toUpperCase()} Recommendation data finished at ${Date()}\n`);
   return res.send(origRes); 
})

app.get('/api/v1.0.0/companypeersdata/:tickerName', async function (req, res) {
   console.log(`\nSocial sentiment data Call: ${req.params.tickerName.toUpperCase()}\n`);
   let origRes = await outerAPI.getCompanyPeers(req.params.tickerName);
   console.log(`${req.params.tickerName.toUpperCase()} Company peers data finished at ${Date()}\n`);
   return res.send(origRes); 
})

app.get('/api/v1.0.0/companyearningsdata/:tickerName', async function (req, res) {
   // null转换成0
   console.log(`\nCompany earnings data Call: ${req.params.tickerName.toUpperCase()}\n`);
   let origRes = await outerAPI.getCompanyEarnings(req.params.tickerName);
   console.log(`${req.params.tickerName.toUpperCase()} Company earnings data finished at ${Date()}\n`);
   for (var i=0; i<origRes.length;i++){
      if (origRes[i]['actual'] == null){
         origRes[i]['actual'] = 0;
      };
      if (origRes[i]['estimate'] == null){
         origRes[i]['estimate'] = 0;
      };
      if (origRes[i]['period'] == null){
         origRes[i]['period'] = 0;
      };
      if (origRes[i]['surprise'] == null){
         origRes[i]['surprise'] = 0;
      };
      if (origRes[i]['surprisePercent'] == null){
         origRes[i]['surprisePercent'] = 0;
      };
      if (origRes[i]['symbol'] == null){
         origRes[i]['symbol'] = 0;
      } }
   return res.send(origRes); 
})


/*
var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("NodeJS Stock Server listening at http://%s:%s", host, port)
})*/

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`NodeJS Stock Server listening on port ${PORT}...`);
});