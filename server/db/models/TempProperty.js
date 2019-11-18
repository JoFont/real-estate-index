const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	title: String,
	price: Number,
	currency: String,
	city: String,
	region: String,
	imgUrl: {
		type: String,
		default: null
	},
	propertyType: String,
	listingType: String,
	listingUrl: String,
	provider: String
},
{
	timestamps: true
});

module.exports = mongoose.model('tempproperties', schema);