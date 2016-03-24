var router = require('express').Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Promise = require('bluebird');
module.exports = router;

router.get('/', function (req,res,next) {
  console.log('Getting here');
  Promise.all([
    Hotel.find(),
    Restaurant.find(),
    Activity.find()
  ])
  .then(function(array) {
    res.json(array);
  })
  .catch(next);
});