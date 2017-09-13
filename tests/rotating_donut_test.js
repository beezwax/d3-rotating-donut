describe('ROTATING DONUT', function() {
  var t = chai.assert;
  var initialData = [
    {
      "id": 1,
      "value": 15.213097270116679,
      "color": "#1f77b4",
      "icon": "../images/car.svg"
    }, {
      "id": 2,
      "value": 5.613515522616516,
      "color": "#ff7f0e",
      "icon": "../images/idea.svg"
    }, {
      "id": 3,
      "value": 14.16732472832057,
      "color": "#2ca02c",
      "icon": "../images/phone-call.svg"
    }, {
      "id": 4,
      "value": 17.71135749720593,
      "color": "#d62728",
      "icon": "../images/shopping-cart.svg"
    }, {
      "id": 5,
      "value": 13.292696478959586,
      "color": "#9467bd",
      "icon": "../images/cutlery.svg"
    }
  ];
  var updatedData = [
    {
      "id": 1,
      "value": 15.22440168193661,
      "color": "#1f77b4",
      "icon": "../images/car.svg"
    }, {
      "id": 2,
      "value": 9.47758140497308,
      "color": "#ff7f0e",
      "icon": "../images/idea.svg"
    }, {
      "id": 3,
      "value": 9.000185206567648,
      "color": "#2ca02c",
      "icon": "../images/phone-call.svg"
    }, {
      "id": 4,
      "value": 19.675559607646996,
      "color": "#d62728",
      "icon": "../images/shopping-cart.svg"
    }, {
      "id": 5,
      "value": 11.145987996393668,
      "color": "#9467bd",
      "icon": "../images/cutlery.svg"
    }
  ];

  it('Allows Multiple Instances', function() {
    var rotatingDonut1 = APP.rotatingDonut().key(1);
    var rotatingDonut2 = APP.rotatingDonut().key(2);
    t.notEqual(rotatingDonut1.key(), rotatingDonut2.key());
  });

  describe('Options', function() {
    var defaults = {
          animationDuration: 600,
          iconSize: 0.7,
          thickness: 0.4,
          value: null,
          icon: null,
          color: null,
          key: null,
          sort: null
        },
        custom = {
          animationDuration: 1,
          iconSize: 2,
          thickness: 3,
          value: 4,
          icon: 5,
          color: 6,
          key: 7,
          sort: 8
        },
        donut = APP.rotatingDonut();

    describe('Default Values', function() {
      Object.keys(defaults).forEach(function(option) {
        it(option, function() {
          t.equal(donut[option](), defaults[option]);
        })
      });
    });

    describe('Set Values', function() {
      before(function() {
        Object.keys(defaults).forEach(function(option) {
          donut[option](custom[option])
        });
      });

      Object.keys(custom).forEach(function(option) {
        it(option, function() {
          t.equal(donut[option](), custom[option]);
        });
      });
    });
  });

  describe('Adds to Dom', function() {
    var node,
        donut;

    var path = d3.arc()
        .outerRadius(50)
        .innerRadius(25);

    var pie = d3.pie()
        .value(function(d) {return d.value})
        .sort(null);

    beforeEach(function() {
      node = document.createElement('div');
      donut = new Donut();


      d3.select(node)
          .datum(initialData)
          .call(donut.label, 'The label')
          .call(donut.dimensions, {width: 200, height: 100})
          .transition()
          .duration(0)
          .call(donut);
    });

    it('Initial Data Loads', function(done) {
      var comparisonPaths = pie(initialData)
          .map(function(d) {return path(d);});

      d3.select(node)
          .datum(initialData)
          .transition()
          .duration(0)
          .call(donut);

      setTimeout(function() {
        t.equal(d3.select(node).select('.donut-label').text(), 'The label');
        t.deepEqual(getPathsD(node), comparisonPaths);
        done();
      }, 10)
    });

    it('Updated Data Loads', function(done) {
      var comparisonPaths = pie(updatedData)
          .map(function(d) {return path(d);});

      d3.select(node)
          .datum(updatedData)
          .call(donut.label, 'The new label')
          .transition()
          .duration(0)
          .call(donut)
          .on('end', function onEnd() {
            setTimeout(function() {
              t.equal(d3.select(node).select('.donut-label').text(), 'The new label');
              t.deepEqual(getPathsD(node), comparisonPaths);
              done();
            }, 10)
          });
    });

    it('Rotates to Selected', function(done) {
      var index = 2,
          pieData = pie(updatedData),
          comparisonAngle = d3.mean([pieData[index].startAngle, pieData[index].endAngle]);

      var offsetData = pieData.map(function(d) {
        return {
          startAngle: d.startAngle - comparisonAngle,
          endAngle: d.endAngle - comparisonAngle
        };
      });

      var comparisonPaths = offsetData
          .map(function(d) {return path(d);});

      d3.select(node)
          .datum(updatedData)
          .call(donut.selectedSegment, updatedData[index])
          .transition()
          .duration(0)
          .call(donut)
          .on('end', function onEnd() {
            t.deepEqual(getPathsD(node), comparisonPaths);
            done();
          });
    });
  });

  describe('Events', function() {
    var index = 2,
        node = document.createElement('div'),
        donut = new Donut();

    d3.select(node)
        .datum(initialData)
        .transition()
        .duration(0)
        .call(donut);

    it('click', function(done) {
      donut.on('click', function(d) {
        t.deepEqual(d, initialData[index], 'incorrect data is emitted');
        done();
      });

      d3.select(node)
          .selectAll('path')
          .filter(function(d, i) {return i === index})
          .dispatch('click')

    });
  });

  function getPathsD(node) {
    return d3.select(node)
        .selectAll('path')
        .nodes()
        .map(function(path) {return path.getAttribute('d')});
  }

  function Donut() {
    return APP.rotatingDonut()
        .alignmentAngle(0)
        .iconSize(0.5)
        .thickness(0.5)
        .value(function(d) {return d.value})
        .icon(function(d) {return d.icon})
        .color(function(d) {return d.color})
        .key(function(d) {return d.id})
        .sort(function(a, b) {return a.id - b.id});
  }
});
