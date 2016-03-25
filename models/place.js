var mongoose = require('mongoose');

var placeSchema = new mongoose.Schema({
	address: String,
	city: String,
	state: String,
	phone: String,
	location: [Number]
});

module.exports = mongoose.model('Place', placeSchema);
