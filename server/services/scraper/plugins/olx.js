const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const chalk = require("chalk");

const url = 'https://www.olx.pt/imoveis/?search[description]=1';
let results = [];

async function getPages() {
  console.log(chalk.cyan("Fetching Number of Pages"));
  const browser = await puppeteer.launch({ignoreDefaultArgs: ['--disable-extensions']});
  const page = await browser.newPage();
  await page.goto(url);
  const html = await page.content();

  let numberOfPages;
  const $ = cheerio.load(html);

  $(".pager.rel.clr").find("a").each((i, el) => {
    if($(el).data("cy") === "page-link-last") {
      numberOfPages = Number($(el).children().text());
      browser.close();
    }
  });
  console.log(`${chalk.cyan('Number of Pages Fetched:')} ${chalk.cyan.bold(numberOfPages)} => ${chalk.green('SUCCESS')}`);
  return numberOfPages;
};

async function getPageResults(pageNum) {
  console.log(`${chalk.cyan('Fetching results for page:')} ${chalk.cyan.bold(pageNum)}`);

  const browser = await puppeteer.launch({ignoreDefaultArgs: ['--disable-extensions']});
  const page = await browser.newPage();
  await page.goto(`${url}&page=${pageNum}`, {"waitUntil" : "networkidle0"});
  const html = await page.content();

  const $ = cheerio.load(html);
  const articles = $("#offers_table tr.wrap");

  // FIXME: This loop is not running
  articles.each((i, el) => {
    const features = $(el).data('features');

    console.log(features);

    if(features && features["cat_l3_name"]) {
      const title = $(el).find(".title-cell > div > h3 > a > strong").text();
      const imgUrl = $(el).find("td > a.thumb > img").attr("src");
      const propertyType = features["cat_l3_name"] ? features["cat_l3_name"].split("-")[0].slice(0, -1) : null;
      const listingType = features["cat_l3_name"].split("-")[1] === "venda" ? "buy" : "rent";

      console.log(title);

      results.push({
        title,
        price: features["ad_price"],
        currency: features["price_currency"],
        city: features["city_name"],
        region: features["region_name"],
        imgUrl,
        propertyType,
        listingType,
        features
      });
    }
  });

  browser.close();

  console.log(`${chalk.cyan('Fetching results for page:')} ${chalk.cyan.bold(pageNum)} => ${chalk.green('SUCCESS')} ---- ${chalk.yellow('Total Number of Results: ')} ${chalk.yellow.italic(results.length)}`);

  return;
} 

getPages().then(async nPages => {
  for(let i = 1; i < nPages; i++) {
    await getPageResults(i);
  }

  console.log(results);
});






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


