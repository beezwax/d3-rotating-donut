describe('HELPERS', function() {
  var t = chai.assert;

  describe('isList', function() {
    it('returns single', function() {
      t.isFalse(APP.isList(d3.select('body')));
    });
    it('returns array', function() {
      t.isTrue(APP.isList(d3.selectAll('body')));
    });
  });

  describe('reuseTransition', function() {
    it('creates transition', function() {
      t.isTrue(APP.reuseTransition(d3.select('body')) instanceof d3.transition)
    });
    it('reuses transition', function() {
      var tran = d3.select('body').transition('transition 1');
      t.equal(APP.reuseTransition(tran)._name, 'transition 1');
    });
    it('reuses duration', function() {
      t.equal(APP.reuseTransition(d3.select('body'), 123).duration(), 123);
    });
  });
});
