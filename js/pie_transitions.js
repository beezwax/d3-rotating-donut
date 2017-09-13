if(typeof APP === 'undefined') {APP = {};}
APP.pieTransition = function() {
  'use strict';
  var allNodes,
      firstPreviousNode,
      firstCurrentNode,
      enteringSegments,
      transitioningSegments;

  var previousSegmentData = d3.local();

  var o = {
    arc: null,
    sort: null,
    offset: 0
  };

  var methods = {
    enter: function(transition) {
      transition
          .each(setEnterAngle)
          .call(render);
    },
    transition: render,
    exit: function(transition) {
      transition
          .each(setExitAngle)
          .call(render);
    },
    interpolate: function (segment) {
      // grabbing the data this way is easier that trying to pass it in at every call
      var d = d3.select(segment).datum();
      var newData = {
        startAngle: d.startAngle + o.offset,
        endAngle: d.endAngle + o.offset,
        innerRadius: o.arc.innerRadius()(),
        outerRadius: o.arc.outerRadius()()
      };
      return d3.interpolate(previousSegmentData.get(segment), newData);
    }
  };

  // finds the endAngle (either current or previous) of the arc next to the node
  function previousAdjacentAngle(node) {
    var index = allNodes.indexOf(node);
    if (index) {
      return previousSegmentData.get(allNodes[index - 1]).endAngle;

    } else if (firstPreviousNode) {
      return previousSegmentData.get(firstPreviousNode).startAngle;

    } else {
      return nodeData(node).startAngle;
    }
  }

  function currentAdjacentAngle(node) {
    var index = allNodes.indexOf(node);

    if (index) {
      return nodeData(allNodes[index - 1]).endAngle;

    } else {
      return nodeData(firstCurrentNode).startAngle;
    }
  }

  function updateNodes() {
    if (!transitioningSegments || !enteringSegments) {return;}

    allNodes = transitioningSegments.nodes()
        .concat(transitioningSegments.exit().nodes())
        .concat(enteringSegments.nodes())
        .sort(sortNodes);

    firstPreviousNode = transitioningSegments.nodes()
        .concat(transitioningSegments.exit().nodes())
        .sort(sortNodes)[0];

    firstCurrentNode = transitioningSegments.nodes()
        .concat(enteringSegments.nodes())
        .sort(sortNodes)[0];

    function sortNodes(a, b) {
      return o.sort(nodeData(a).data, nodeData(b).data);
    }
  }

  function nodeData(node) {
    return d3.select(node).datum();
  }

  // for enter segments, we want to get the previous endAngle of the adjacent arc
  // and animate in from there
  function setEnterAngle() {
    var enterAngle = previousAdjacentAngle(this);
    previousSegmentData.set(this, {
      startAngle: enterAngle,
      endAngle: enterAngle,
      innerRadius: o.arc.innerRadius()(),
      outerRadius: o.arc.outerRadius()()
    });
  }

  // for exit segments, we have to find the adjacent segment
  // and transition to the angle where that one is going to be.
  // This way, the arc will shrink to nothing in the appropriate place.
  function setExitAngle(d) {
    var exitAngle = currentAdjacentAngle(this);
    d.startAngle = exitAngle;
    d.endAngle = exitAngle;
  }

  function render(transition) {
    transition.attrTween('d', arcTween);
  }

  // returns a function which accepts t(0-1) and returns a "d" attribute for a path
  // currentSegment keeps the currentSegment up-to-date as the transition changes
  // so if the tranistion is cancelled (by new data) then it will animate smoothly
  function arcTween() {
    var i = methods.interpolate(this);
    previousSegmentData.set(this, i(0));
    return function(t) {
      var interation = i(t);
      o.arc
          .innerRadius(interation.innerRadius)
          .outerRadius(interation.outerRadius);
      return o.arc(interation);
    };
  }

  methods.enteringSegments = function (_) {
    enteringSegments = _;
    updateNodes();
    return methods;
  };

  methods.transitioningSegments = function (_) {
    transitioningSegments = _;
    updateNodes();
    return methods;
  };

  methods.arc = APP.optionMethod('arc', o, methods);
  methods.sort = APP.optionMethod('sort', o, methods);
  methods.offset = APP.optionMethod('offset', o, methods);

  return methods;
};
