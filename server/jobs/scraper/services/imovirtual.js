const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const chalk = require("chalk");
const taskStd = require("./util/stdout-task-status"); 

const url = "https://www.imovirtual.com/arrendar/?search%5Bdescription%5D=1&nrAdsPerPage=72";


async function getPages() {
    taskStd.startTask("Fetching Number of Pages for Imovirtual");
	const browser = await puppeteer.launch({
		ignoreDefaultArgs: ["--disable-extensions"]
	});
	const page = await browser.newPage();
	await page.goto(url);
	const html = await page.content();

	
	const $ = cheerio.load(html);
    let numberOfPages;

    $(".pager").find("a").each((i, el) => {
		if (i === 4) {
			numberOfPages = Number($(el).text());
			browser.close();
		}
	});
	
    // console.log(`${chalk.cyan("Number of Pages Fetched:")} ${chalk.cyan.bold(numberOfPages)} => ${chalk.green("SUCCESS")}`);
    taskStd.taskSuccess("Number of Pages Fetched:", numberOfPages, "Imovirtual");
	return numberOfPages;
}


async function getPageResults(pageNum) {
	let results = [];

    taskStd.startTask("Fetching results for page:", pageNum);

	const args = [
		"--no-sandbox",
		"--disable-setuid-sandbox",
		"--disable-infobars",
		"--window-position=0,0",
		"--ignore-certifcate-errors",
		"--ignore-certifcate-errors-spki-list",
		'--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
	];
	const options = {
		args,
		headless: true,
		ignoreHTTPSErrors: true,
        userDataDir: "./tmp",
	};

	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();
	await page.goto(`${url}&page=${pageNum}`, { waitUntil: "networkidle0" });
	const html = await page.content();

	const $ = cheerio.load(html);
    const articles = $(".col-md-content > article");

    articles.each((i, el) => {
        const title = $(el).find(".offer-item-title").text();
        const listingUrl = $(el).attr("data-url");
		
		const priceUgly = $(el).find(".offer-item-price").text();
        let price = priceUgly.match(/[0-9]/g) === null ? null : Number(priceUgly.match(/[0-9]/g).join(""));
		
		const imgUrl = $(el).find(".img-cover").attr("data-src");
		
		const address = $(el).find("p.text-nowrap").text().split(":")[1];
		const city = address.split(",")[1] ? address.split(",")[1].trim() : null;
		const region = address.split(",")[0] ? address.split(",")[0].trim() : null;

        results.push({
        title,
        price,
        currency: "EUR",
        listingUrl,
		imgUrl,
		city,
		region,
		// propertyType,
		// listingType,
		provider: "imovirtual",
        });
    });

	browser.close();

    taskStd.taskSuccess("Total Number of Results: ", results.length, `Page: ${pageNum}`);
    

	return results;
}


exports.fetch = sendResultsCallback =>
	getPages().then(async nPages => {
		for (let i = 1; i < nPages; i++) {
			const results = await getPageResults(i);
			await sendResultsCallback(results);
		}
		return;
	});