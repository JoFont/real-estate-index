const mongoose = require("mongoose");

//Define a schema
const Schema = new mongoose.Schema({
	title: String,
	price: Number,
	currency: String,
	city: String,
	region: String,
	// imgUrl: String,
	imgUrl: [String, Object],
	// propertyType: String,
	listingType: String,
	// listingUrl: String,
	provider: String
});

module.exports.Model = mongoose.model('properties', Schema);