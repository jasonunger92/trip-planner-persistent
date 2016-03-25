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

router.delete('/deleteDay', function(req,res,next) {
  Day.findOne({number: parseInt(req.body.number)})
  .then(function (day) {
    return day.remove();
  })
  .then(function () {
    res.sendStatus(204);
  })
  .then(null,next);
});

router.post('/addDay', function(req,res,next) {
  Day.create({
    number: parseInt(req.body.number),
    hotel: null
  })
  .then(function (day) {
    res.json(day);
  })
  .then(null,next);
});

router.put('/:dayNum/add', function(req,res,next) {
  var number = parseInt(req.params.dayNum);
  var type = req.body.type;
  var attractionID = req.body.ID;
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

router.put('/:dayNum/delete', function(req,res,next) {
  var number = parseInt(req.params.dayNum);
  var type = req.body.type;
  var attractionID = req.body.ID;
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