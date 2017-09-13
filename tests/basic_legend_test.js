describe('BASIC LEGEND', function() {
  var t = chai.assert;
  var initialData = [
    {id: 1, color: 'red', label: 'item 1'},
    {id: 2, color: 'blue', label: 'item 2'},
    {id: 3, color: 'green', label: 'item 3'}
  ];

  var updatedData = [
    {id: 1, color: 'red', label: 'item 1'},
    {id: 3, color: 'green', label: 'item 3'},
    {id: 4, color: 'yellow', label: 'item 4'}
  ];

  it('Allows Multiple Instances', function() {
    var legend1 = APP.basicLegend().key(1);
    var legend2 = APP.basicLegend().key(2);
    t.notEqual(legend1.key(), legend2.key());
  });

  describe('Options', function() {
    var defaults = {label: null, key: null, color: null},
        custom = {label: 1, key: 2, color: 3},
        legend = APP.basicLegend();

    describe('Default Values', function() {
      Object.keys(defaults).forEach(function(option) {
        it(option, function() {
          t.equal(legend[option](), defaults[option]);
        })
      });
    });

    describe('Set Values', function() {
      before(function() {
        legend
            .label(custom.label)
            .color(custom.color)
            .key(custom.key);
      });

      Object.keys(custom).forEach(function(option) {
        it(option, function() {
          t.equal(legend[option](), custom[option]);
        });
      });
    });
  });

  describe('Adds to Dom', function() {
    var node,
        legend;

    beforeEach(function() {
      node = document.createElement('div');
      legend = new Legend();

      d3.select(node)
          .datum(initialData)
          .transition()
          .duration(0)
          .call(legend);
    });

    it('Initial Data Loads', function(done) {
      setTimeout(function(){
        t.equal(node.innerHTML, expected.legendInitial);
        done()
      }, 30)
    });

    it('Loads Updated Data', function(done) {
      d3.select(node)
          .datum(updatedData)
          .transition()
          .duration(0)
          .on('end', function() {
            setTimeout(function() {
              t.equal(node.innerHTML, expected.legendUpdated);
              done();
            }, 30)
          })
          .call(legend);
    })
  });

  describe('Events', function() {
    var div,
        legend;

    beforeEach(function() {
      div = document.createElement('div');
      legend = new Legend();

      d3.select(div)
          .datum(initialData)
          .transition()
          .duration(0)
          .call(legend);
    });

    ['mouseenter', 'mouseleave', 'click'].forEach(function(evt) {
      it(evt, function(done) {
        legend.on(evt, function(d) {
          t.deepEqual(d, initialData[1], 'incorrect data is emitted');
          done();
        });

        d3.select(div)
            .selectAll('li:nth-child(2)')
            .dispatch(evt)
      });
    })
  });

  describe('Highlight', function() {
    var div,
        legend;

    beforeEach(function() {
      div = document.createElement('div');
      legend = new Legend();
      d3.select(div)
          .datum(initialData)
          .call(legend)
          .call(legend.highlight, initialData[1]);
    });

    it('highlights correct item', function() {
      var shouldBeHovered = d3.select(div)
          .selectAll('li:nth-child(2)')
          .classed('hovered');

      t.ok(shouldBeHovered);
    });
    it("doesn't highlight incorrect item", function() {
      var shouldNotBeHovered = d3.select(div)
          .selectAll('li:nth-child(1)')
          .classed('hovered');

      t.notOk(shouldNotBeHovered);
    })
  });

  describe('Selected Item', function() {
    var div,
        legend;

    beforeEach(function() {
      div = document.createElement('div');
      legend = new Legend();
      d3.select(div)
          .datum(initialData)
          .call(legend)
          .call(legend.highlight, initialData[1]);
    });

    it('initially undefined', function() {
      t.equal(typeof legend.selectedItem(d3.select(div)), 'undefined');
    });
    it('set to correct item', function() {
      d3.select(div).call(legend.selectedItem, initialData[1]);
      t.equal(legend.selectedItem(d3.select(div)), initialData[1]);
    });
  });

  function Legend() {
    return APP.basicLegend()
        .label(function(d) {return d.label})
        .color(function(d) {return d.color})
        .key(function(d) {return d.id});
  }
});
