var router = require('express').Router();
var models = require('../../models');
var Day = models.Day;
module.exports = router;

router.get('/', function(req,res,next) {
  
});

router.delete('/:dayID', function(req,res,next) {
  
});

router.post('/', function(req,res,next) {
  
});

router.put('/:dayNum/:type/:ID/add', function(req,res,next) {

});

router.put('/:dayNum/:type/:hotelID/delete', function(req,res,next) {
  // var number = parseInt(req.params.dayNuym);
  // var type = req.params.type;
  // var attractionID = req.params.ID;
  
});

// router.put('/:dayID/restaurant/:restaurantID/add', function(req,res,next) {

// });

// router.put('/:dayID/restaurant/:restaurantID/delete', function(req,res,next) {

// });

// router.put('/:dayID/activity/:activityID/add', function(req,res,next) {

// });

// router.put('/:dayID/activity/:activityID/delete', function(req,res,next) {

// });