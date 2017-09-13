describe('PIE SELECTION ROTATION', function () {
  var t = chai.assert;

  it('Allows Multiple Instances', function() {
    var pieSelectionRotation1 = APP.pieSelectionRotation().key(1);
    var pieSelectionRotation2 = APP.pieSelectionRotation().key(2);
    t.notEqual(pieSelectionRotation1.key(), pieSelectionRotation2.key());
  });

  describe('Options', function() {
    var defaults = {
          key: null,
          alignmentAngle: 0
        },
        custom = {
          key: 1,
          alignmentAngle: 1
        },
        pieSelectionRotation = APP.pieSelectionRotation();

    describe('Default Values', function() {
      Object.keys(defaults).forEach(function(option) {
        it(option, function() {
          t.equal((pieSelectionRotation[option]() || '').toString(), (defaults[option] || '').toString());
        })
      });
    });

    describe('Set Values', function() {
      before(function() {
        pieSelectionRotation
            .key(custom.key)
            .alignmentAngle(custom.alignmentAngle);
      });

      Object.keys(custom).forEach(function(option) {
        it(option, function() {
          t.equal(pieSelectionRotation[option](), custom[option]);
        });
      });
    });
  });

  describe('selectedSegment', function() {
    var data = [
          {data:{id: 1}},
          {data:{id: 99}}
        ],
        node,
        pieSelectionRotation;

    beforeEach(function() {
      node = document.createElement('div');
      pieSelectionRotation = APP.pieSelectionRotation().key(function(d) {return d.id});

      d3.select(node)
          .datum(data)
          .call(pieSelectionRotation);
    });

    it('initially undefined', function() {
      t.typeOf(pieSelectionRotation.selectedSegment(d3.selectAll(node)), 'undefined');
    });

    it('sets and retrieves selected data', function() {
      d3.select(node)
          .call(pieSelectionRotation.selectedSegment, {id: 99})
          .call(pieSelectionRotation);

      t.equal(pieSelectionRotation.selectedSegment(d3.select(node)).id, 99);
    });
  });

  describe('getAngle', function() {
    var data = [
          {data:{id: 1}, startAngle: 0.1, endAngle: 0.2},
          {data:{id: 99}, startAngle: 0.3, endAngle: 0.4}
        ],
        node,
        pieSelectionRotation;

    beforeEach(function() {
      node = document.createElement('div');
      pieSelectionRotation = APP.pieSelectionRotation().key(function(d) {return d.id});

      d3.select(node)
          .datum(data)
          .call(pieSelectionRotation);
    });

    it('initially undefined', function() {
      t.typeOf(pieSelectionRotation.getAngle(d3.selectAll(node)), 'undefined');
    });

    it('return correct angle', function() {
      d3.select(node)
          .call(pieSelectionRotation.selectedSegment, {id: 99})
          .call(pieSelectionRotation);

      t.equal(pieSelectionRotation.getAngle(d3.select(node)), -0.35);
    });

    it('applies correct offset', function() {
      pieSelectionRotation.alignmentAngle(90);

      d3.select(node)
          .call(pieSelectionRotation.selectedSegment, {id: 99})
          .call(pieSelectionRotation);

      t.equal(pieSelectionRotation.getAngle(d3.select(node)), (Math.PI / 2) - 0.35);
    });

  })
});
