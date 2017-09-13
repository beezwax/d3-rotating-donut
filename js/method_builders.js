if(typeof APP === 'undefined') {APP = {};}
APP.optionMethod = function(key, options, component) {
  'use strict';
  return function(_) {
    if (!arguments.length) {
      return options[key];
    }
    options[key] = _;
    return component;
  };
};

APP.localMethod = function(local, component) {
  'use strict';
  function getLocalValue(node) {
    return local.get(node);
  }

  return function(context, _) {
    var returnArray;
    if (typeof _ === 'undefined' ) {
      returnArray = context.nodes().map(getLocalValue);
      return APP.isList(context) ? returnArray : returnArray[0];
    }
    context.each(function() {local.set(this, _);});
    return component;
  };
};

APP.eventListener = function(events, component) {
  'use strict';
  return function(evt, callback) {
    events.on(evt, callback);
    return component;
  };
};
