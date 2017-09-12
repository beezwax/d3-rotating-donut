if(typeof APP === 'undefined') {APP = {};}
APP.rotatingDonut = function() {
  'use strict';
  var o,
      local;

  o = {
    thickness: 0.4,
    value: null,
    color: null,
    key: null,
    sort: null
  };

  local = {
    label: d3.local(),
    dimensions: d3.local()
  };

  function donut(group) {
    group.each(render);
  }

  function render(data) {
    var context,
        dim,
        pie,
        arc,
        segments,
        segmentEnter;

    if (!data) {return;}

    context = d3.select(this);
    dim = getDimensions(context);

    pie = d3.pie()
        .value(o.value)
        .sort(null);

    arc = d3.arc()
        .outerRadius(dim.outerRadius)
        .innerRadius(dim.innerRadius);

    context.selectAll('svg')
        .data([pie(data.sort(o.sort))])
        .enter()
        .append('svg')
        .append('g')
        .attr('class', 'group')
        .append('text')
        .attr('class', 'donut-label')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle');

    context.selectAll('svg')
        .attr('width', dim.width)
        .attr('height', dim.height)
        .selectAll('g.group')
        .attr('transform', 'translate(' + dim.width / 2 + ',' + dim.height / 2 + ')');

    context.select('text.donut-label')
        .text(local.label.get(context.node()));

    segments = context.selectAll('svg')
        .select('g.group')
        .selectAll('path.segment')
        .data(Object, dataAccess('key'));

    segmentEnter = segments.enter()
        .append('path')
        .attr('class', 'segment')
        .attr('fill', dataAccess('color'));

    segmentEnter
        .merge(segments)
        .attr('d', arc);

    segments.exit()
        .remove();
  }

  function dataAccess(key) {
    return function(d) {
      return o[key](d.data);
    };
  }

  function getDimensions(context) {
    var thisDimensions = local.dimensions.get(context.node()) || {},
        width = thisDimensions.width || context.node().getBoundingClientRect().width,
        height = thisDimensions.height || context.node().getBoundingClientRect().height,
        outerRadius = Math.min(width, height) / 2,
        innerRadius = outerRadius * (1 - o.thickness);

    return {
      width: width,
      height: height,
      outerRadius: outerRadius,
      innerRadius: innerRadius
    };
  }

  donut.thickness = function(_) {
    if (!arguments.length) {return o.thickness;}
    o.thickness = _;
    return donut;
  };
  donut.value = function(_) {
    if (!arguments.length) {return o.value;}
    o.value = _;
    return donut;
  };
  donut.color = function(_) {
    if (!arguments.length) {return o.color;}
    o.color = _;
    return donut;
  };
  donut.key = function(_) {
    if (!arguments.length) {return o.key;}
    o.key = _;
    return donut;
  };
  donut.sort = function(_) {
    if (!arguments.length) {return o.sort;}
    o.sort = _;
    return donut;
  };

  donut.dimensions = function(context, _) {
    var returnArray;
    if (typeof _ === 'undefined' ) {
      returnArray = context.nodes()
          .map(function (node) {return local.dimensions.get(node);});
      return context._groups[0] instanceof NodeList ? returnArray : returnArray[0];
    }
    context.each(function() {local.dimensions.set(this, _);});
    return donut;
  };
  donut.label = function(context, _) {
    var returnArray;
    if (typeof _ === 'undefined' ) {
      returnArray = context.nodes()
          .map(function (node) {return local.label.get(node);});
      return context._groups[0] instanceof NodeList ? returnArray : returnArray[0];
    }
    context.each(function() {local.label.set(this, _);});
    return donut;
  };

  return donut;
};