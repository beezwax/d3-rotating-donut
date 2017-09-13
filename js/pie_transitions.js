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
    }
  };

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

  function setEnterAngle() {
    var enterAngle = previousAdjacentAngle(this);
    previousSegmentData.set(this, {
      startAngle: enterAngle,
      endAngle: enterAngle,
      innerRadius: o.arc.innerRadius()(),
      outerRadius: o.arc.outerRadius()()
    });
  }

  function setExitAngle(d) {
    var exitAngle = currentAdjacentAngle(this);
    d.startAngle = exitAngle;
    d.endAngle = exitAngle;
  }

  function render(transition) {
    transition.attrTween('d', arcTween);
  }

  function arcTween() {
    var i = interpolate(this);
    previousSegmentData.set(this, i(0));
    return function(t) {
      var interation = i(t);
      o.arc
          .innerRadius(interation.innerRadius)
          .outerRadius(interation.outerRadius);
      return o.arc(interation);
    };
  }

  function interpolate(segment) {
    var d = d3.select(segment).datum();
    var newData = {
      startAngle: d.startAngle + o.offset,
      endAngle: d.endAngle + o.offset,
      innerRadius: o.arc.innerRadius()(),
      outerRadius: o.arc.outerRadius()()
    };
    return d3.interpolate(previousSegmentData.get(segment), newData);
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

  methods.arc = function(_) {
    if (!arguments.length) {return o.arc;}
    o.arc = _;
    return methods;
  };
  methods.sort = function(_) {
    if (!arguments.length) {return o.sort;}
    o.sort = _;
    return methods;
  };
  methods.offset = function(_) {
    if (!arguments.length) {return o.offset;}
    o.offset = _;
    return methods;
  };

  return methods;
};
