const services = require("./services/services");
const mongoose = require("mongoose");
const Property = require("../../db/models/Property");
const TempProperty = require("../../db/models/TempProperty");


module.exports.scrape = () => {
	//Set up default mongoose connection
	const mongoDB = 'mongodb://heroku_m0q245mq:j8i28nooppt0rcb9prnvg15n4r@ds039078.mlab.com:39078/heroku_m0q245mq';
	mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
	const db = mongoose.connection;

	//Bind connection to error event (to get notification of connection errors)
	db.on('error', console.error.bind(console, 'MongoDB connection error:'));

	db.once("open", () => {
		Promise.all([
			services.imovirtual.fetch(postServiceResults)
		]).then(async res => {
			// console.log("Migrating");
			// Property.find({}).then(data => {
			// 	console.log(data[0]);
			// 	TestModel.insertMany(data).then(() => {
			// 		console.log("Done Migrating");
			// 		db.close();
			// 	});
			// });
			console.log("Migrating");

			await Property.deleteMany({});
			const newResults = await TempProperty.find({});
			await Property.insertMany(newResults);
			await TempProperty.deleteMany({});
			console.log("Done Migrating");
			db.close();

		});
		// services.imovirtual.fetch(postServiceResults).then(rs => {
		// 	console.log(rs)
		// })
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








// Promise.all([
// 	// services.olx.fetch(postServiceResults),
// 	services.imovirtual.fetch(postServiceResults)
// ]).then(results => {
// 	console.log(results);
// }).catch(err => {
// 	console.error(err);
// })
