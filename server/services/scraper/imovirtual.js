const axios = require("axios");
const cheerio = require("cheerio");

const url = 'https://www.imovirtual.com/arrendar/apartamento/?search%5Bfilter_float_m%3Ato%5D=50&search%5Bdescription%5D=1&search%5Bregion_id%5D=11&nrAdsPerPage=72';

axios(url)
.then(response => {
  const html = response.data;
  const $ = cheerio.load(html);
  const articles = $(".col-md-content > article");

  let results = [];

  articles.each((i, el) => {
    const imgUrl = $(this).find("figure > .quick-gallery > .quick-gallery_full > img");
    const name = $(this).find("figure > .quick-gallery > .quick-gallery_full > img");

    console.log(name);
  });

  // console.log(results);
})
.catch(console.error);  