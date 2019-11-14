const services = require("./services/services");
const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const propertyModelSchema = new Schema({
	title: String,
	price: Number,
	currency: String,
	city: String,
	region: String,
	imgUrl: String,
	// propertyType: String,
	listingType: String,
	// listingUrl: String,
	provider: String
});

const propertyModel = mongoose.model('properties', propertyModelSchema );

//Set up default mongoose connection
const mongoDB = 'mongodb://127.0.0.1/real-estate-index-test';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once("open", () => {
	services.imovirtual.fetch(postServiceResults);
});


const postServiceResults = arr => {
	arr.forEach(data => {
		let doc = new propertyModel({
			title: data.title,
			price: data.price,
			currency: data.currency,
			city: data.city,
			region: data.region,
			imgUrl: data.imgUrl,
			// propertyType: String,
			listingType: data.listingType,
			// listingUrl: String,
			provider: data.provider
		});
	
		doc.save(err => {
			if(err) console.error(err);
		});
	});
};






// Promise.all([
// 	// services.olx.fetch(postServiceResults),
// 	services.imovirtual.fetch(postServiceResults)
// ]).then(results => {
// 	console.log(results);
// }).catch(err => {
// 	console.error(err);
// })
