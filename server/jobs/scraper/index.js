const services = require("./services/services");
const mongoose = require("mongoose");
// const Property = require("../db/models/Property");

// TODO: Temp collection and replace

//Define a schema
const schema = new mongoose.Schema({
	title: String,
	price: Number,
	currency: String,
	city: String,
	region: String,
	// imgUrl: String,
	imgUrl: {
		type: String,
		default: null
	},
	// propertyType: String,
	listingType: String,
	// listingUrl: String,
	provider: String
},
{
	timestamps: true
});

const Property = mongoose.model('properties', schema);
const TestModel = mongoose.model('tempProperties', schema);


//Set up default mongoose connection
const mongoDB = 'mongodb://heroku_m0q245mq:j8i28nooppt0rcb9prnvg15n4r@ds039078.mlab.com:39078/heroku_m0q245mq';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once("open", () => {
	Promise.all([
		services.imovirtual.fetch(postServiceResults)
	]).then(res => {
		// FIXME: Not sure this works
		Property.find({}, (err, properties) => {
			properties.forEach(async doc => {
				await new TestModel(doc).save();
			});
		}).then(res => {
			db.close();
		});
	});
	
});


const postServiceResults = arr => {
	arr.forEach(data => {
		let doc = new Property({
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
			if (err) console.error(err);
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
