document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  var donut,
      events;

  function build() {
    donut = APP.rotatingDonut()
        .thickness(0.5)
        .value(function(d) {return d.value;})
        .color(function(d) {return d.color;})
        .key(function(d) {return d.id;})
        .sort(function(a, b) {return a.id - b.id;});
  }

  function addToDom() {
    d3.select('#donut1')
        .datum(APP.generateData())
        .call(donut.label, 'Smith')
        .call(donut);

    d3.select('#donut2')
        .datum(APP.generateData())
        .call(donut.label, 'Jones')
        .call(donut);
  }

  function addListeners() {
    d3.select('button').on('click', events.dataButtonClick);
    d3.selectAll('.donut-size').on('change', events.resizeSliderChange);
  }

  events = {
    dataButtonClick: function() {
      d3.select('#donut1')
          .datum(APP.generateData(true))
          .call(donut);

      d3.select('#donut2')
          .datum(APP.generateData(true))
          .call(donut);
    },

    resizeSliderChange: function() {
      var target = d3.select(this).attr('data-target'),
          value = this.value * 2;

      d3.selectAll(target)
          .call(donut.dimensions, {width: value, height: value})
          .call(donut)
          .style('width', value + 'px')
          .style('height', value + 'px');
    }
  };

  build();
  addToDom();
  addListeners();
});
