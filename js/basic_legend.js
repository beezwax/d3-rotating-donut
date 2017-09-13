if(typeof APP === 'undefined') {APP = {};}
APP.basicLegend = function () {
  'use strict';
  // scope available to public methods
  var events = d3.dispatch('mouseenter', 'mouseleave', 'click'),
      selectedItem = d3.local();

  var o = {
    label: null,
    key: null,
    color: null
  };

  function legend(group) {
    // scope which isn't selection-specific
    group.each(function(data) {
      render.call(this, data, group)
    });
  }

  function render(data, group) {
    // selection-specific scope
    var context = d3.select(this),
        t,
        labels,
        labelsEnter;

    t = APP.reuseTransition(group);

    context
        .selectAll('ul')
        .data([data])
        .enter()
        .append('ul')
        .attr('class', 'legend');

    // bind new data to label selection
    // Object is shortcut function to return argument as an object
    labels = context
        .selectAll('ul') // sets parent for selection where elements will be added
        .selectAll('li.legend-label')
        .data(Object, o.key);

    // add new labels which weren't in previous data set
    labelsEnter = labels.enter()
        .append('li')
        .attr('class', 'legend-label')
        .attr('data-id', o.key)
        .on('mouseenter mouseleave', listeners(context).mouseMovement)
        .on('click', listeners(context).labelClick)
        .call(labelInitialAttributes);

    labelsEnter
        .append('svg')
        .attr('width', 22)
        .attr('height', 22)
        .append('rect')
        .attr('fill', o.color)
        .attr('width', 20)
        .attr('height', 20)
        .attr('x', 1)
        .attr('y', 1);

    labelsEnter
        .append('span')
        .text(o.label);

    labelsEnter
        .merge(labels)
        .classed('selected', isSelected)
        .transition(t)
        .style('top', function(d, i) {return (i * 22) + 'px';})
        .style('opacity', 1)
        .style('left', '12px');

    // remove labels which aren't in new data set
    labels.exit()
        .transition(t)
        .call(labelInitialAttributes)
        .remove();
  }

  function listeners(context) {
    return {
      labelClick: function(d) {
        selectedItem.set(context.node(), d);
        context.call(legend);
        events.call('click', context.node(), d);
      },
      mouseMovement: function(d) {
        context.call(highlight, d, d3.event.type);
        events.call(d3.event.type, context.node(), d);
      }
    }
  }

  function highlight(selection, d, action) {
    selection
        .selectAll('li[data-id="' + o.key(d) + '"]')
        .classed('hovered', action === 'mouseenter');
  }

  function labelInitialAttributes(selection) {
    selection
        .style('left', '-12px')
        .style('opacity', 0);
  }

  function isSelected(d) {
    return selectedItem.get(this) && o.key(d) === o.key(selectedItem.get(this));
  }

  // value accessor functions
  legend.label = APP.optionMethod('label', o, legend);
  legend.key = APP.optionMethod('key', o, legend);
  legend.color = APP.optionMethod('color', o, legend);
  legend.selectedItem = APP.localMethod(selectedItem, legend);
  legend.on = APP.eventListener(events, legend);

  legend.highlight = function(selection, d) {
    selection.call(highlight, d, 'mouseenter');
    return legend;
  };

  legend.unhighlight = function(selection, d) {
    selection.call(highlight, d, 'mouseleave');
    return legend;
  };

  return legend;
};
