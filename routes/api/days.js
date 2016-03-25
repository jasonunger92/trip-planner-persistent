var router = require('express').Router();
var models = require('../../models');
var Day = models.Day;
module.exports = router;

router.get('/', function(req,res,next) {
  Day.find().populate('hotel restaurant activity')
  .then(function(dayArr) {
    res.json(dayArr);
  })
  .then(null,next);
});

router.delete('/:dayNum', function(req,res,next) {
  Day.findOne({number: parseInt(req.params.dayNum)})
  .then(function (day) {
    return day.remove();
  })
  .then(function () {
    res.sendStatus(204);
  })
  .then(null,next);
});

router.post('/', function(req,res,next) {
  console.log(req.query.num);
  Day.create({
    number: parseInt(req.query.num),
    hotel: null
  })
  .then(function (day) {
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
    if (type === 'hotel') {
      day[type] = attractionID;
    } else {
      day[type].push(attractionID);
    }
    return day.save();
  })
  .then(function (day) {
    res.json(day);
  })
  .then(null,next);
});

router.put('/:dayNum/:type/:hotelID/delete', function(req,res,next) {
  var number = parseInt(req.params.dayNum);
  var type = req.params.type;
  var attractionID = req.params.ID;
  Day.findOne({number: number})
  .then(function (day) {
    if (type === 'hotel') {
      day[type] = null;
    } else {
      var index = day[type].indexOf(attractionID);
      day[type].splice(index,1);
    }
    return day.save();
  })
  .then(function (day) {
    res.json(day);
  })
  .then(null,next);
});