const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const url = 'https://www.olx.pt/imoveis/?search%5Bdescription%5D=1';


puppeteer
  .launch({ignoreDefaultArgs: ['--disable-extensions']})
  .then(browser => browser.newPage())
  .then(page => {
    return page.goto(url).then(() => {
      return page.content();
    });
  }).then(html => {
    const $ = cheerio.load(html);
    const articles = $("#offers_table tr.wrap");

    let results = [];

    articles.each((i, el) => {
      const features = $(el).data('features');
      
      if(features && features["cat_l3_name"]) {
        const title = $(el).find(".title-cell > div > h3 > a > strong").text();
        const imgUrl = $(el).find("td > a.thumb > img").attr("src");
        const propertyType = features["cat_l3_name"] ? features["cat_l3_name"].split("-")[0].slice(0, -1) : null;
        const listingType = features["cat_l3_name"].split("-")[1] === "venda" ? "buy" : "rent";
    
        results.push({
          title,
          price: features["ad_price"],
          currency: features["price_currency"],
          city: features["city_name"],
          region: features["region_name"],
          imgUrl,
          propertyType,
          listingType,
          // features
        });
      }
    });
  
    console.log(results);


  }).catch(console.error);




// axios(url)
// .then(response => {
//   const html = response.data;
//   const $ = cheerio.load(html);
//   const articles = $("#offers_table tr.wrap");

//   let results = [];

//   articles.each((i, el) => {
//     const title = $(el).find(".title-cell > div > h3 > a > strong").text();
//     const features = $(el).data('features');
//     const imgUrl = $(el).find("td > a.thumb > img").attr("src");

//     results.push({
//       title,
//       price: features["ad_price"],
//       currency: features["price_currency"],
//       city: features["city_name"],
//       region: features["region_name"],
//       imgUrl,
//     });
//   });

//   console.log(results);

// })
// .catch(console.error);  


