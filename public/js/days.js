'use strict';
/* global $ */

/**
 * A module for managing multiple days & application state.
 * Days are held in a `days` array, with a reference to the `currentDay`.
 * Clicking the "add" (+) button builds a new day object (see `day.js`)
 * and switches to displaying it. Clicking the "remove" button (x) performs
 * the relatively involved logic of reassigning all day numbers and splicing
 * the day out of the collection.
 *
 * This module has four public methods: `.load()`, which currently just
 * adds a single day (assuming a priori no days); `switchTo`, which manages
 * hiding and showing the proper days; and `addToCurrent`/`removeFromCurrent`,
 * which take `attraction` objects and pass them to `currentDay`.
 */

var daysModule = (function () {

  // application state

  var days = [],
      dayObjs = [],
      currentDay;

  // jQuery selections

  var $addButton, $removeButton;
  $(function () {
    $addButton = $('#day-add');
    $removeButton = $('#day-title > button.remove');
  });

  // method used both internally and externally

  function switchTo (newCurrentDay) {
    currentDay.hide();
    currentDay = newCurrentDay;
    currentDay.show();
  }

  // jQuery event binding

  $(function () {
    $addButton.on('click', addDay);
    $removeButton.on('click', deleteCurrentDay);
  });

  function addDay (click,theDay) {
    if (this && this.blur) this.blur(); // removes focus box from buttons
    var newDay = dayModule.create({ number: days.length + 1 }); // dayModule
    if (!theDay) {
      $.post('/api/days/?num='+newDay.number)
      .done(function(day) {
        days.push(newDay);
        dayObjs.push(day);
        if (days.length === 1) {
          currentDay = newDay;
          switchTo(currentDay);
        }
        return newDay;
      })
      .fail(function(error) {
        console.error(error.statusText);
      }); 
    } else {
      days.push(newDay);
      dayObjs.push(theDay);
      if (days.length === 1) {
        currentDay = newDay;
        switchTo(currentDay);
      }
      return newDay;
    }
  }

  function deleteCurrentDay () {
    // prevent deleting last day
    if (days.length < 2 || !currentDay) return;
    // remove from the collection
    var index = days.indexOf(currentDay),
      previousDay = days.splice(index, 1)[0],
      newCurrent = days[index] || days[index - 1],
      prevDayObj = dayObjs.splice(index, 1)[0];

    $.ajax({
      method: 'DELETE',
      url: '/api/days/'+prevDayObj._id
    })
    .done(function() {
      // fix the remaining day numbers
      days.forEach(function (day, i) {
        day.setNumber(i + 1);
      });
      switchTo(newCurrent);
      previousDay.hideButton();
    })
    .fail(function(err) {
      console.error(err.statusText);
    });
  }

  function load () {
    $.get('/api/days/')
    .done(function(dayArray) {
      dayArray.forEach(function(dayObj) {
        var theirDay = addDay(null,dayObj);
        theirDay.hotel = dayObj.hotel[0];
        theirDay.restaurants = dayObj.restaurant;
        theirDay.activities = dayObj.activity;
      });
    });
  }

  // globally accessible module methods

  var methods = {

    load: load,

    switchTo: switchTo,

    addToCurrent: function (attraction) {
      currentDay.addAttraction(attraction);
    },

    removeFromCurrent: function (attraction) {
      currentDay.removeAttraction(attraction);
    }

  };

  return methods;

}());
