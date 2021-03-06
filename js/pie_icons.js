if(typeof APP === 'undefined') {APP = {};}
APP.pieIcons = function() {
  'use strict';
  var icon = d3.local();

  var o = {
    iconPath: null,
    imageWidth: null,
    interpolate: null,
    container: function (selection) {return d3.select(selection._parents[0]);}
  };

  function icons(group) {
    var container = o.container(group);

    group.each(function(data) {
      render.call(this, data, container);
    });
  }

  function render(data, container) {
    var thisIcon = container
      .append('image')
      .attr('class', 'icon')
      .attr('xlink:href', o.iconPath.bind(null, data))
      .attr('width', o.imageWidth)
      .attr('height', o.imageWidth)
      .style('opacity', 0);

    icon.set(this, thisIcon);
  }

  function iconTranslate(i, t) {
    var dimensions = this.getBoundingClientRect(),
        coords = d3.arc().centroid(i(t)),
        adjustedCoords = [
          coords[0] - dimensions.width / 2,
          coords[1] - dimensions.height / 2
        ];

    return 'translate(' + adjustedCoords.join(',') + ')';
  }

  function removeIfParentIsGone(pieSegment) {
    return function() {
      if (!document.body.contains(pieSegment)) {
        this.remove();
      }
    };
  }

  function iconTween(pieSegment) {
    var i = o.interpolate(pieSegment);
    return function () {
      return iconTranslate.bind(this, i);
    };
  }

  icons.tween = function (transition, isExiting) {
    transition.selection().each(function () {
      icon.get(this)
          .transition(transition)
          .duration(transition.duration())
          .attr('width', o.imageWidth)
          .attr('height', o.imageWidth)
          .style('opacity', Number(!isExiting))
          .attrTween('transform', iconTween(this))
          .on('end', removeIfParentIsGone(this));
    });
  };

  icons.exitTween = function(transition) {
    icons.tween(transition, true);
  };

  icons.iconPath = APP.optionMethod('iconPath', o, icons);
  icons.imageWidth = APP.optionMethod('imageWidth', o, icons);
  icons.radius = APP.optionMethod('radius', o, icons);
  icons.interpolate = APP.optionMethod('interpolate', o, icons);
  icons.container = APP.optionMethod('container', o, icons);

  return icons;
};
