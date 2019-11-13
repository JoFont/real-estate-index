const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const chalk = require("chalk");

const url = "https://www.olx.pt/imoveis/?search[description]=1";

async function getPages() {
	console.log(chalk.cyan("Fetching Number of Pages"));

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
		userDataDir: "./tmp"
	};

	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();
	await page.goto(url);
	const html = await page.content();

	let numberOfPages;
	const $ = cheerio.load(html);

	$(".pager.rel.clr").find("a").each((i, el) => {
		if ($(el).data("cy") === "page-link-last") {
			numberOfPages = Number($(el).children().text());
			browser.close();
		}
	});
	// console.log(html);
	if(numberOfPages === undefined) {
		throw new Error(chalk.red(`Scraper tried to run on ${chalk.red.bold("Olx")} but, got rate limited or blocked!`))
	} else {
		console.log(`${chalk.cyan("Number of Pages Fetched:")} ${chalk.cyan.bold(numberOfPages)} => ${chalk.green("SUCCESS")}`);
		return numberOfPages;
	}
}

async function getPageResults(pageNum) {
	let results = [];

	console.log(`${chalk.cyan("Fetching results for page:")} ${chalk.cyan.bold(pageNum)}`);

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
		userDataDir: "./tmp"
	};

	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();
	await page.goto(`${url}&page=${pageNum}`, { waitUntil: "networkidle0" });
	const html = await page.content();

	const $ = cheerio.load(html);
	const articles = $("#offers_table tr.wrap");

	articles.each((i, el) => {
		const features = $(el).data("features");

		if (features && features["cat_l3_name"]) {
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
				provider: "olx"
				// features
			});
		}
	});

	browser.close();

	console.log(`${chalk.cyan("Fetching results for page:")} ${chalk.cyan.bold(pageNum)} => ${chalk.green("SUCCESS")} ---- ${chalk.yellow("Total Number of Results: ")} ${chalk.yellow.italic(results.length)}`);

	return results;
}

exports.fetch = sendResultsCallback =>
	getPages().then(async nPages => {
		for (let i = 1; i < nPages; i++) {
			const results = await getPageResults(i);
			await sendResultsCallback(results);
		}
		return;
	}).catch(error => {
		return error;
	});
