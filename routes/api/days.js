var router = require('express').Router();
var models = require('../../models');
var Day = models.Day;
module.exports = router;

router.get('/', function(req,res,next) {
  Day.find().populate('hotel restaurant activity')
  .then(function(DayArray) {
    res.json(DayArray);
  })
  .then(null,next);
});

router.delete('/:dayID', function(req,res,next) {
  Day.findOne({_id: req.params.dayID})
  .then(function(day) {
    return day.remove();
  }).then(function(something) {
    res.send();
  })
  .then(null,next);
});

router.post('/', function(req,res,next) {
  Day.findOne({number: parseInt(req.query.num)})
  .then(function(day) {
    if (!day) {
      return Day.create({
        number: parseInt(req.query.num)
      });
    } else {
      return day;
    }
  })
  .then(function(day) {
    res.json(day);
  })
  .then(null,next);
});

router.put('/:dayNum/:type/:ID/add', function(req,res,next) {
  var number = parseInt(req.params.dayNum);
  var type = req.params.type;
  var attractionID = req.params.ID;
  Day.findOne({number: number})
  .then(function (day) {
    day[type].push(attractionID);
    return day.save();
  })
  .then(function (day) {
    res.json(day);
  })
  .then(null,next);

});

router.put('/:dayNum/:type/:hotelID/delete', function(req,res,next) {
  var number = parseInt(req.params.dayNuym);
  var type = req.params.type;
  var attractionID = req.params.ID;
});

// router.put('/:dayID/restaurant/:restaurantID/add', function(req,res,next) {

// });

// router.put('/:dayID/restaurant/:restaurantID/delete', function(req,res,next) {

// });

// router.put('/:dayID/activity/:activityID/add', function(req,res,next) {

// });

// router.put('/:dayID/activity/:activityID/delete', function(req,res,next) {

// });