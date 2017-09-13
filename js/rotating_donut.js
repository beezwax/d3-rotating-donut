if(typeof APP === 'undefined') {APP = {};}
// use descriptive name instead of something generic like 'chart'
APP.rotatingDonut = function() {
  'use strict';
  // outer scope available to public methods
  var o,
      events,
      local,
      rotation;

  // accessor functions can be overridden from the public methods
  o = {
    animationDuration: 600,
    iconSize: 0.7,
    thickness: 0.4,
    value: null,
    icon: null,
    color: null,
    key: null,
    sort: null
  };

  events = d3.dispatch('mouseenter', 'mouseleave', 'click');

  // context-dependant variables which require persistance between renders
  // must be set with d3 local so that each can have its own value,
  // and be easily accessible by node
  // label stores the label in the center of the donut
  // animate stores the state of a donut's animation
  // icons stores the reference to the donut's icon generator
  // dimenstions stores the donut's externally-set dimensions
  local = {
    label: d3.local(),
    animate: d3.local(),
    icons: d3.local(),
    dimensions: d3.local()
  };

  rotation = APP.pieSelectionRotation()
      .key(function(d) {return o.key(d);});

  // this inner function can have a generic name as it is not public
  function donut(group) {
    // scope available to all contexts

    // even if there is only one selection, this is an easy way to pass bound data
    group.each(function(data) {
      // this is individual item of the group, in this case the svg
      render.call(this, data, group);
    });
  }

  function render(data, group) {
    // context-specific scope
    var context,
        t,
        dim,
        pie,
        arc,
        pieTransition,
        pieIcons,
        segments,
        segmentEnter;

    if (!data) {return;}

    context = d3.select(this);

    // Using a single transition ensures that all child animations remain in sync
    // and are cancelled properlyif donut call called on a transition instead of a selection,
    // we'll use that transition instead of creating a new one.
    t = APP.reuseTransition(group, o.animationDuration);

    dim = getDimensions(context);

    // although pie and arc are context-specific, they do not need to be persistent between calls,
    // so we don't need to store them in a d3.local()
    pie = d3.pie()
        .value(o.value)
        .sort(null);

    arc = d3.arc()
        .outerRadius(dim.outerRadius)
        .innerRadius(dim.innerRadius);

    // the instance of these needs to persist between renders,
    // so we only instantiate it the first time and stash it in a local
    // after the first run, we grab it from the local
    pieTransition = local.animate.get(this) || local.animate.set(this, APP.pieTransition());
    pieIcons = local.icons.get(this) || local.icons.set(this, APP.pieIcons());

    pieIcons
        .container(function() {return context.select('g.group');})
        .iconPath(dataAccess('icon'))
        .imageWidth(dim.outerRadius * o.thickness * o.iconSize)
        .interpolate(pieTransition.interpolate);

    // add svg and g if they don't yet exist
    // we need to bind the data after it's been processed by pie()
    // binding it here instead of on the segment groups allows us to
    // use enter() to add the svg and g if not already there
    // ideally, data should not have to be bound directly anywhere else down the hierarchy
    context.selectAll('svg')
        .data([pie(data.sort(o.sort))])
        .call(rotation)
        .enter()
        .append('svg')
        .append('g')
        .attr('class', 'group')
        .append('text')
        .attr('class', 'donut-label')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle');

    context.selectAll('svg')
        .transition(t)
        .attr('width', dim.width)
        .attr('height', dim.height)
        .selectAll('g.group')
        .attr('transform', 'translate(' + dim.width / 2 + ',' + dim.height / 2 + ')');

    context.select('text.donut-label')
        .text(local.label.get(context.node()));

    // using the Object constructor is a shortcut for function(d) {return d} when d is an object
    // String, Number, Function, and Boolean can also be used
    // when the type of the returned object is known.
    segments = context.selectAll('svg') // selection with bound data
        .select('g.group') // sets parent of segments selection
        .selectAll('path.segment')
        .data(Object, dataAccess('key'));

    // segmentEnter is what is returned from this chain, which is the group
    segmentEnter = segments.enter()
        .append('path')
        .attr('class', 'segment')
        .attr('fill', dataAccess('color'))
        .on('mouseenter mouseleave click', onPathEvent(context));

    pieTransition
        .arc(arc)
        .sort(o.sort)
        .enteringSegments(segmentEnter)
        .transitioningSegments(segments)
        .offset(rotation.getAngle(context.select('svg')));

    segmentEnter
        .call(pieIcons)
        .transition(t)
        .call(pieTransition.enter)
        .call(pieIcons.tween);

    segments
        .transition(t)
        .call(pieTransition.transition)
        .call(pieIcons.tween);

    segments.exit()
        .transition(t)
        .call(pieTransition.exit)
        .call(pieIcons.exitTween)
        .remove();
  }

  function onPathEvent(context) {
    return function(d) {
      if (d3.event.type === 'click') {
        rotation.selectedSegment(context.select('svg'), d.data);
        context.call(donut);
      }
      events.call(d3.event.type, context.node(), d.data);
    };
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

  // publicly accessible methods
  donut.selectedSegment = function(context, d) {
    // if there's do data passed, then we'll return the current selection instead of setting it.
    if (typeof d === 'undefined' ) {return rotation.selectedSegment(context.select('svg'));}
    rotation.selectedSegment(context.select('svg'), d);
    return donut; // return the donut to allow chaining
  };
  donut.alignmentAngle = function(_) {
    if (typeof _ === 'undefined' ) {return rotation.alignmentAngle();}
    rotation.alignmentAngle(_);
    return donut;
  };

  // value accessor functions
  // this chart shouldn't have too much assumed knowledge of the data structure.
  // rather, it should be told how to access each of these values
  donut.animationDuration = APP.optionMethod('animationDuration', o, donut);
  donut.iconSize = APP.optionMethod('iconSize', o, donut);
  donut.thickness = APP.optionMethod('thickness', o, donut);
  donut.value = APP.optionMethod('value', o, donut);
  donut.icon = APP.optionMethod('icon', o, donut);
  donut.color = APP.optionMethod('color', o, donut);
  donut.key = APP.optionMethod('key', o, donut);
  donut.sort = APP.optionMethod('sort', o, donut);

  // context-specific methods
  donut.dimensions = APP.localMethod(local.dimensions, donut);
  donut.label = APP.localMethod(local.label, donut);

  // adds 'on' method
  donut.on = APP.eventListener(events, donut);

  return donut;
};
