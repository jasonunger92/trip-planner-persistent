var mongoose = require('mongoose');
var placeSchema = require('./place').schema;

var activitySchema = new mongoose.Schema({
  name: String,
  place: placeSchema,
  age_range: String
});

activitySchema.plugin(require('./locationPlugin.js'));

module.exports = mongoose.model('Activity', activitySchema);
