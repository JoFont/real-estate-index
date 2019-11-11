const axios = require("axios");
const cheerio = require("cheerio");

const url = 'https://www.remax.pt/PublicListingList.aspx?SelectedCountryID=12#mode=list&tt=261&cr=2&cur=EUR&sb=PriceIncreasing&page=1&sc=12&sid=a81a1d1d-ee36-4236-a72e-31343349c574';

axios(url)
.then(response => {
  const html = response.data;
  const $ = cheerio.load(html);
  const articles = $(".standard_listing");

  let results = [];

  // articles.each((i, el) => {
  //   const imgUrl = $(this).find("figure > .quick-gallery > .quick-gallery_full > img");
  //   const name = $(this).find("figure > .quick-gallery > .quick-gallery_full > img");

  //   console.log(name);
  // });

  console.log(articles.length);
})
.catch(console.error);  