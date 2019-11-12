const axios = require("axios");
const cheerio = require("cheerio");

const url = 'https://www.imovirtual.com/arrendar/apartamento/?search%5Bfilter_float_m%3Ato%5D=50&search%5Bdescription%5D=1&search%5Bregion_id%5D=11&nrAdsPerPage=72';

module.exports.imovirtual = axios(url)
.then(response => {
  const html = response.data;
  const $ = cheerio.load(html);
  const articles = $(".col-md-content > article");

  let results = [];

  articles.each((i, el) => {
    const title = $(el).find(".offer-item-title").text();
    const listingUrl = $(el).attr("data-url");
    const priceUgly = $(el).find(".offer-item-price").text();
    const price = priceUgly.match(/[0-9]/g).join("");
    const imgUrl = $(el).find(".img-cover").attr("data-src");
    const data = $(el).attr();

    results.push({
      title,
      price,
      currency: "EUR",
      listingUrl,
      imgUrl,
    });
  });

  console.log(results);
})
.catch(console.error);  