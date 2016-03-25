'use strict';
/* global $ utilsModule */

/**
 * A module for constructing front-end `day` objects, optionally from back-end
 * data, and managing the `attraction`s associated with a day.
 *
 * Day objects contain `attraction` objects. Each day also has a `.$button`
 * with its day number. Days can be drawn or erased via `.show()` and
 * `.hide()`, which updates the UI and causes the day's associated attractions
 * to `.show()` or `.hide()` themselves.
 *
 * This module has one public method: `.create()`, used by `days.js`.
 */

var dayModule = (function () {

  // jQuery selections

  var $dayButtons, $dayTitle;
  $(function () {
    $dayButtons = $('.day-buttons');
    $dayTitle = $('#day-title > span');
  });

  // Day class and setup

  function Day (data) {
    // for brand-new days
    this.number = data.number || 0;
    this.hotel = data.hotel || null;
    this.restaurant = data.restaurant || [];
    this.activity = data.activity || [];
    // for days based on existing data
    utilsModule.merge(data, this);
    // remainder of constructor
    this.buildButton().showButton();
  }

  // automatic day button handling

  Day.prototype.setNumber = function (num) {
    this.number = num;
    this.$button.text(num);
  };

  Day.prototype.buildButton = function () {
    this.$button = $('<button class="btn btn-circle day-btn"></button>')
      .text(this.number);
    var self = this;
    this.$button.on('click', function (){
      this.blur(); // removes focus box from buttons
      daysModule.switchTo(self);
    });
    return this;
  };

  Day.prototype.showButton = function () {
    this.$button.appendTo($dayButtons);
    return this;
  };

  Day.prototype.hideButton = function () {
    this.$button.detach(); // detach removes from DOM but not from memory
    return this;
  };

  Day.prototype.show = function () {
    // day UI
    this.$button.addClass('current-day');
    $dayTitle.text('Day ' + this.number);
    // attractions UI
    function show (attraction) { attraction.show(); }
    if (this.hotel) show(this.hotel);
    this.restaurant.forEach(show);
    this.activity.forEach(show);
  };

  Day.prototype.hide = function () {
    // day UI
    this.$button.removeClass('current-day');
    $dayTitle.text('Day not Loaded');
    // attractions UI
    function hide (attraction) {
      return attraction.hide();
    }
    if (this.hotel) hide(this.hotel);
    this.restaurant.forEach(hide);
    this.activity.forEach(hide);
  };

  // day updating

  Day.prototype.addAttraction = function (attraction) {
    var self = this;
    $.ajax({
      method: 'PUT',
      url: '/api/days/'+self.number+'/add',
      data: {type: attraction.type, ID: attraction._id}
    })
    .done(function () {
      $('select[data-type="'+attraction.type+'"]').siblings('button').prop('disabled',false);
      // adding to the day object
      switch (attraction.type) {
        case 'hotel':
          if (self.hotel) self.hotel.hide();
          self.hotel = attraction; break;
        case 'restaurant':
          utilsModule.pushUnique(self.restaurant, attraction); break;
        case 'activity':
          utilsModule.pushUnique(self.activity, attraction); break;
        default: console.error('bad type:', attraction);
      }
      // activating UI
      attraction.show();
    })
    .fail(console.error.bind(console));
  };

  Day.prototype.removeAttraction = function (attraction) {
    var self = this;
    $.ajax({
      method: 'PUT',
      url: '/api/days/'+self.number+'/delete',
      data: {type: attraction.type, ID: attraction._id}
    })
    .done(function () {
      // removing from the day object
      switch (attraction.type) {
        case 'hotel':
          self.hotel = null; break;
        case 'restaurant':
          utilsModule.remove(self.restaurant, attraction); break;
        case 'activity':
          utilsModule.remove(self.activity, attraction); break;
        default: console.error('bad type:', attraction);
      }
      // deactivating UI
      attraction.hide();
    })
    .fail(console.error.bind(console));
  };

  // globally accessible module methods

  var methods = {

    create: function (databaseDay) {
      return new Day(databaseDay);
    }

  };

  return methods;

}());