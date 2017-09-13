if(typeof APP === 'undefined') {APP = {};}
APP.descriptionWithArrow = function() {
  'use strict';
  var o = {
    label: null,
    text: null
  };

  function description(group) {
    group.each(render);
  }

  function render(data) {
    var context = d3.select(this),
        right;

    context
        .html('')
        .classed('no-data', !data)
        .append('div')
        .attr('class', 'desc-left arrow')
        .html('&larr;');

    right = context.append('div')
        .attr('class', 'desc-right');

    right.append('div')
        .attr('class', 'label')
        .text(o.label);

    right.append('div')
        .attr('class', 'text')
        .text(o.text);
  }

  description.label = function(_) {
    if (!arguments.length) {return o.label;}
    o.label = _;
    return description;
  };
  description.text = function(_) {
    if (!arguments.length) {return o.text;}
    o.text = _;
    return description;
  };

  return description;
};
