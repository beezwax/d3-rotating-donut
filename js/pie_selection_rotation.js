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

      // find the new angle if the selectedSegment is in the data set
      local.angle.set(this, local.angle.get(this) || 0);
      local.selectedSegment.set(this, selectedData);

      if (selectedData) {
        local.angle.set(this, newAngle(local.angle.get(this), meanAngle(selectedData)));
      }
    });
  }

  function newAngle(offsetAngle, currentAngle) {
    // we need to consider the rotation from the previous angle, not just the offset from zero.
    // however, we want to cancel that out before we return the offset
    var radiansToTurn = degreesToRadians(o.alignmentAngle) - currentAngle - offsetAngle;
    return shorterRotation(radiansToTurn) + offsetAngle;
  }

  function meanAngle(data) {
    return d3.mean([data.startAngle, data.endAngle]);
  }

  function degreesToRadians(degrees) {
    return degrees * Math.PI * 2 / 360;
  }

  // if the distance the donut has to travel is more than half a turn,
  // then rotate the other way instead
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
    // if there's do data passed, then we'll return the current selection instead of setting it.
    if (typeof d === 'undefined' ) {
      returnArray = selection.nodes().map(nodeMap);
      return APP.isList(selection) ? returnArray : returnArray[0];
    }

    selection.each(function() {
      local.selectedKey.set(this, o.key(d));
    });

    return rotation;
  };

  rotation.getAngle = function(selection) {
    var returnArray = selection.nodes()
        .map(function(node) {return local.angle.get(node) || 0;});

    return APP.isList(selection) ? returnArray : returnArray[0];
  };

  rotation.key = APP.optionMethod('key', o, rotation);
  rotation.alignmentAngle = APP.optionMethod('alignmentAngle', o, rotation);

  return rotation;
};
