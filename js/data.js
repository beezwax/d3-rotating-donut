if(typeof APP === 'undefined') {APP = {};}
APP.generateData = function(splice) {
  'use strict';
  // Icons from Freepik at http://www.flaticon.com/packs/miscellaneous-elements
  var icons = ['car.svg', 'idea.svg', 'phone-call.svg', 'shopping-cart.svg', 'cutlery.svg'],
      labels = ['travel', 'electricity', 'phone', 'shopping', 'food'],
      descriptions = [
        'Including car payments, fuel, tolls', 'Electric Bill',
        'Cell phone, cell plan, land-line',
        'Any non-food shopping items such as clothing, gifts, etc.',
        'Groceries and restaurant expenses'
      ],
      colors = d3.scaleOrdinal(d3.schemeCategory10),
      arr = [],
      i;

  for (i = 1; i <= 5; i++) {
    arr.push({
      id: i,
      value: 5 + Math.random() * 15,
      color: colors(i),
      icon: 'images/' + icons[i - 1],
      label: labels[i - 1],
      description: descriptions[i - 1]
    });
  }
  if (splice) {
    arr.sort(function() {return 0.5 - Math.random();})
        .splice(0, Math.random() * 5);
  }
  return arr;
};
