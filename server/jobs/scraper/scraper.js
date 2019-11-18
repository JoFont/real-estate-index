const services = require("./services/services");
const mongoose = require("mongoose");
const Property = require("../../db/models/Property");
const TempProperty = require("../../db/models/TempProperty");
const switchCollections = require("../db/switchCollections");


module.exports.scrape = () => {
	//Set up default mongoose connection
	const mongoDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/heroku_m0q245mq';
	mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
	const db = mongoose.connection;

	//Bind connection to error event (to get notification of connection errors)
	db.on('error', console.error.bind(console, 'MongoDB connection error:'));

	db.once("open", () => {
		Promise.all([
			services.imovirtual.fetch(postServiceResults)
		]).then(res => {
			switchCollections("properties", "tempproperties").then(res => {
				console.log(res);
				db.close();
			}).catch(err => {
				console.error(err);
			});
		});
	});


	// mongoose.connection.readyState

	const postServiceResults = arr => {
		arr.forEach(data => {
			let doc = new TempProperty({
				title: data.title,
				price: data.price,
				currency: data.currency,
				city: data.city,
				region: data.region,
				imgUrl: data.imgUrl,
				propertyType: data.propertyType,
				listingType: data.listingType,
				listingUrl: data.listingUrl,
				provider: data.provider
			});

			doc.save(err => {
				if (err) console.error(err);
			});
		});
	};
}

