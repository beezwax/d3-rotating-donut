document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  var donut,
      legend,
      description,
      events;

  function build() {
    donut = APP.rotatingDonut()
        .alignmentAngle(90)
        .thickness(0.5)
        .value(function(d) {return d.value;})
        .color(function(d) {return d.color;})
        .key(function(d) {return d.id;})
        .sort(function(a, b) {return a.id - b.id;});

    legend = APP.basicLegend()
        .label(function(d) {return d.label;})
        .color(function(d) {return d.color;})
        .key(function(d) {return d.id;});

    description = APP.descriptionWithArrow()
        .label(function(d) {return formatDollar((d || {}).value);})
        .text(function(d) {return d ? d.description : 'no data for selection';});
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
    donut.on('click', events.donutClick)
        .on('mouseenter', events.donutMouseEnter)
        .on('mouseleave', events.donutMouseLeave);
    legend.on('click', events.legendClick);
    d3.select('button').on('click', events.dataButtonClick);
    d3.selectAll('.donut-size').on('change', events.resizeSliderChange);
  }

  function setDescriptions() {
    d3.select('#description1')
        .datum(donut.selectedSegment(d3.select('#donut1')))
        .call(description);

    d3.select('#description2')
        .datum(donut.selectedSegment(d3.select('#donut2')))
        .call(description);
  }

  function formatDollar(num) {
    return typeof num === 'number' ? '$' + num.toFixed(2) : '';
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

      setDescriptions();
    },

    donutClick: function(d) {
      var container = this;

      d3.selectAll('.donut')
          .filter(function() {return this !== container;})
          .call(donut.selectedSegment, d)
          .call(donut);

      d3.select('#legend')
          .call(legend.selectedItem, d)
          .call(legend);

      setDescriptions();
    },

    donutMouseEnter: function(d) {
      d3.select('#legend')
          .call(legend.highlight, d)
    },

    donutMouseLeave: function(d) {
      d3.select('#legend')
          .call(legend.unhighlight, d)
    },

    legendClick: function(d) {
      d3.selectAll('.donut')
          .call(donut.selectedSegment, d)
          .call(donut);

      setDescriptions();
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
          .style('height', value + 'px')
          .each(transitionDonutDescription);

      function transitionDonutDescription() {
        d3.select('.description[data-target="' + target + '"]')
            .transition()
            .duration(donut.animationDuration())
            .style('height', value + 'px');
      }
    }
  };

  build();
  addToDom();
  addListeners();
});
