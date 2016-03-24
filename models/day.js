var mongoose = require('mongoose');
var PlaceSchema = require('./place').schema;
var Promise = require('bluebird');

var daySchema = new mongoose.Schema({
  number: Number,
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  },
  restaurant: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],
  activity: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity'
  }]
});

daySchema.pre('remove', function(next) {
  var num = this.number;
  this.constructor.find({number: {$gt: num}})
  .then(function(dayArray) {
    return Promise.map(dayArray, function(day) {
      day.number--;
      return day.save();
    });
  })
  .then(function () {
    next();
  })
  .then(null,next);
});

module.exports = mongoose.model('Day', daySchema);