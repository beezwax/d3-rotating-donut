describe('DESCRIPTION WITH ARROW', function () {
  var t = chai.assert,
      initialData = {label: 'a', text: 'item 1'},
      updatedData = {label: 'b', text: 'item 2'};

  it('Allows Multiple Instances', function() {
    var descriptionWithArrow1 = APP.descriptionWithArrow().text(1);
    var descriptionWithArrow2 = APP.descriptionWithArrow().text(2);
    t.notEqual(descriptionWithArrow1.text(), descriptionWithArrow2.text());
  });

  describe('Options', function() {
    var defaults = {label: null, text: null},
        custom = {label: 1, text: 2},
        description = APP.descriptionWithArrow();

    describe('Default Values', function() {
      Object.keys(defaults).forEach(function(option) {
        it(option, function() {
          t.equal(description[option](), defaults[option]);
        })
      });
    });

    describe('Set Values', function() {
      before(function() {
        description
            .label(custom.label)
            .text(custom.text);
      });

      Object.keys(custom).forEach(function(option) {
        it(option, function() {
          t.equal(description[option](), custom[option]);
        });
      });
    });
  });

  describe('Adds to Dom', function() {
    var node,
        description;

    beforeEach(function() {
      node = document.createElement('div');
      description = APP.descriptionWithArrow()
          .label(function(d) {return d.label;})
          .text(function(d) {return d.text;});

      d3.select(node)
          .datum(initialData)
          .transition()
          .duration(0)
          .call(description)
    });

    it('Initial Data Loads', function(done) {
      t.equal(node.innerHTML, expected.descriptionInitial);
      done()
    });

    it('Loads Updated Data', function(done) {
      d3.select(node)
          .datum(updatedData)
          .transition()
          .duration(0)
          .on('end', function() {
            setTimeout(function() {
              t.equal(node.innerHTML, expected.descriptionUpdated);
              done();
            }, 0)
          })
          .call(description);
    })
  });
});
