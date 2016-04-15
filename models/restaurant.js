var mongoose = require('mongoose');
var placeSchema = require('./place').schema;

var restaurantSchema = new mongoose.Schema({
  name: String,
  place: placeSchema,
  price: { type: Number, min: 1, max: 5 },
  cuisine: String
});

restaurantSchema.virtual('type').get(() => 'restaurant');

restaurantSchema.plugin(require('./locationPlugin.js'));

module.exports = mongoose.model('Restaurant', restaurantSchema);
