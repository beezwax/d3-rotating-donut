document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  var donut,
      legend,
      events;

  function build() {
    donut = APP.rotatingDonut()
        .thickness(0.5)
        .value(function(d) {return d.value;})
        .color(function(d) {return d.color;})
        .key(function(d) {return d.id;})
        .sort(function(a, b) {return a.id - b.id;});

    legend = APP.basicLegend()
        .label(function(d) {return d.label;})
        .color(function(d) {return d.color;})
        .key(function(d) {return d.id;});
  }

  function addToDom() {
    d3.select('#donut1')
        .datum(APP.generateData())
        .call(donut.label, 'Smith')
        .transition()
        .duration(0)
        .call(donut);

    d3.select('#donut2')
        .datum(APP.generateData())
        .call(donut.label, 'Jones')
        .transition()
        .duration(0)
        .call(donut);

    d3.select('#legend')
        .datum(APP.generateData())
        .call(legend);
  }

  function addListeners() {
    donut.on('mouseenter', events.donutMouseEnter)
        .on('mouseleave', events.donutMouseLeave);
    d3.select('button').on('click', events.dataButtonClick);
    d3.selectAll('.donut-size').on('change', events.resizeSliderChange);
  }

  events = {
    dataButtonClick: function() {
      d3.select('#donut1')
          .datum(APP.generateData(true))
          .transition()
          .duration(600)
          .call(donut);

      d3.select('#donut2')
          .datum(APP.generateData(true))
          .transition()
          .delay(400)
          .duration(200)
          .call(donut);
    },

    donutMouseEnter: function(d) {
      d3.select('#legend')
          .call(legend.highlight, d)
    },

    donutMouseLeave: function(d) {
      d3.select('#legend')
          .call(legend.unhighlight, d)
    },

    resizeSliderChange: function() {
      var target = d3.select(this).attr('data-target'),
          value = this.value * 2;

      d3.selectAll(target)
          .call(donut.dimensions, {width: value, height: value})
          .call(donut)
          .transition()
          .duration(donut.animationDuration())
          .style('width', value + 'px')
          .style('height', value + 'px');
    }
  };

  build();
  addToDom();
  addListeners();
});
