const axios = require("axios");
const cheerio = require("cheerio");

const url = 'https://www.olx.pt/imoveis/apartamento-casa-a-venda/?search%5Bdescription%5D=1';

axios(url)
.then(response => {
  const html = response.data;
  const $ = cheerio.load(html);
  const articles = $("#offers_table tr.wrap");

  let results = [];

  articles.each((i, el) => {
    const title = $(el).find(".title-cell > div > h3 > a > strong").text();
    const features = $(el).data('features');
    const imgUrl = $(el).find("td > a.thumb > img").attr("src");

    results.push({
      title: title,
      price: features["ad_price"],
      currency: features["price_currency"],
      city: features["city_name"],
      region: features["region_name"],
      imgUrl: imgUrl,
    });
  });

  console.log(results);

})
.catch(console.error);  