if(typeof APP === 'undefined') {APP = {};}
APP.pieSelectionRotation = function() {
  'use strict';
  var local = {
    angle: d3.local(),
    selectedSegment: d3.local(),
    selectedKey: d3.local()
  };

  var o = {
    key: null,
    alignmentAngle: 0
  };

  function rotation(group) {
    group.each(function() {
      var selectedData = getSelectedData(this);

      local.angle.set(this, local.angle.get(this) || 0);
      local.selectedSegment.set(this, selectedData);

      if (selectedData) {
        local.angle.set(this, newAngle(local.angle.get(this), meanAngle(selectedData)));
      }
    });
  }

  function newAngle(offsetAngle, currentAngle) {
    var radiansToTurn = degreesToRadians(o.alignmentAngle) - currentAngle - offsetAngle;
    return shorterRotation(radiansToTurn) + offsetAngle;
  }

  function meanAngle(data) {
    return d3.mean([data.startAngle, data.endAngle]);
  }

  function degreesToRadians(degrees) {
    return degrees * Math.PI * 2 / 360;
  }

  function shorterRotation(offset) {
    var tau = Math.PI * 2;
    offset = offset % tau;
    return (Math.abs(offset) > tau / 2) ? offset + tau * Math.sign(-offset) : offset;
  }

  function getSelectedData(node) {
    return d3.select(node)
        .datum()
        .filter(function(d) {return o.key(d.data) === local.selectedKey.get(node)})[0];
  }

  rotation.selectedSegment = function(selection, d) {
    var returnArray;

    function nodeMap(node) {
      return (local.selectedSegment.get(node) || {}).data;
    }

    if (typeof d === 'undefined' ) {
      returnArray = selection.nodes().map(nodeMap);
      return selection._groups[0] instanceof NodeList ? returnArray : returnArray[0];
    }

    selection.each(function() {
      local.selectedKey.set(this, o.key(d));
    });

    return rotation;
  };

  rotation.getAngle = function(selection) {
    var returnArray = selection.nodes()
        .map(function(node) {return local.angle.get(node) || 0;});

    return selection._groups[0] instanceof NodeList ? returnArray : returnArray[0];
  };

  rotation.key = function(_) {
    if (!arguments.length) {return o.key;}
    o.key = _;
    return rotation;
  };
  rotation.alignmentAngle = function(_) {
    if (!arguments.length) {return o.alignmentAngle;}
    o.alignmentAngle = _;
    return rotation;
  };

  return rotation;
};
