if(typeof APP === 'undefined') {APP = {};}
APP.basicLegend = function () {
  'use strict';
  var events = d3.dispatch('mouseenter', 'mouseleave', 'click'),
      selectedItem = d3.local();

  var o = {
    label: null,
    key: null,
    color: null
  };

  function legend(group) {
    group.each(function(data) {
      render.call(this, data, group)
    });
  }

  function render(data, group) {
    var context = d3.select(this),
        t,
        labels,
        labelsEnter;

    if (group instanceof d3.transition) {
      t = d3.transition(group);
    } else {
      t = d3.transition();
    }

    context
        .selectAll('ul')
        .data([data])
        .enter()
        .append('ul')
        .attr('class', 'legend');

    labels = context
        .selectAll('ul')
        .selectAll('li.legend-label')
        .data(Object, o.key);

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

  legend.label = function(_) {
    if (!arguments.length) {return o.label;}
    o.label = _;
    return legend;
  };
  legend.key = function(_) {
    if (!arguments.length) {return o.key;}
    o.key = _;
    return legend;
  };
  legend.color = function(_) {
    if (!arguments.length) {return o.color;}
    o.color = _;
    return legend;
  };

  legend.selectedItem = function(context, _) {
    var returnArray;
    if (typeof _ === 'undefined' ) {
      returnArray = context.nodes()
          .map(function (node) {return selectedItem.get(node);});
      return context._groups[0] instanceof NodeList ? returnArray : returnArray[0];
    }
    context.each(function() {selectedItem.set(this, _);});
    return legend;
  };

  legend.on = function(evt, callback) {
    events.on(evt, callback);
    return legend;
  };

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
