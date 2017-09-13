if(typeof APP === 'undefined') {APP = {};}
APP.isList = function(context) {
  'use strict';
  return context._groups[0] instanceof NodeList;
};

APP.reuseTransition = function (group, duration) {
  'use strict';
  if (group instanceof d3.transition) {
    return d3.transition(group);
  } else if (typeof duration !== 'undefined') {
    return d3.transition().duration(duration);
  } else {
    return d3.transition();
  }
};
