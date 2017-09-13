describe('PIE TRANSITIONS', function () {
  var t = chai.assert;

  it('Allows Multiple Instances', function() {
    var pieTransition1 = APP.pieTransition().offset(1);
    var pieTransition2 = APP.pieTransition().offset(2);
    t.notEqual(pieTransition1.offset(), pieTransition2.offset());
  });

  describe('Options', function() {
    var defaults = {
          arc: null,
          sort: null,
          offset: 0
        },
        custom = {
          arc: 1,
          sort: 2,
          offset: 3
        },
        pieTransition = APP.pieTransition();

    describe('Default Values', function() {
      Object.keys(defaults).forEach(function(option) {
        it(option, function() {
          t.equal((pieTransition[option]() || '').toString(), (defaults[option] || '').toString());
        })
      });
    });

    describe('Set Values', function() {
      before(function() {
        pieTransition
            .arc(custom.arc)
            .sort(custom.sort)
            .offset(custom.offset);
      });

      Object.keys(custom).forEach(function(option) {
        it(option, function() {
          t.equal(pieTransition[option](), custom[option]);
        });
      });
    });
  });
});
