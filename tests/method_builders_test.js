describe('METHOD BUILDERS', function() {
  var t = chai.assert;

  describe('optionMethod', function() {
    var options = {
      a: 'o-a',
      b: 'o-b',
      c: 'o-c'
    };
    var component = {};

    component.b = APP.optionMethod('b', options, component);

    it('Is a function', function() {
      t.equal(typeof component.b, 'function');
    });

    it('Has correct default', function() {
      t.equal(component.b(), options.b);
    });

    it('Returns component for chaining', function () {
      t.equal(component.b('new value'), component);
    });
  });

  describe('localMethod', function() {
    var local = d3.local(),
        context = document.createElement('div'),
        component = {},
        returnValue;

    context.innerHTML = '<!DOCTYPE html><div id="a" class="item"></div><div id="b" class="item"></div>';
    component.local = APP.localMethod(local, component);

    it('Is a function', function () {
      t.typeOf(component.local, 'function');
    });
    it('default undefined for single selection', function() {
      t.typeOf(component.local(d3.select(context)), 'undefined');
    });
    it('default empty array for multiple selection', function () {
      t.instanceOf(component.local(d3.select(context).selectAll('.item')), Array);
    });
    it('returns component for chaining', function() {
      t.equal(component.local(d3.select(context), 'html value'), component);
    });
    it('sets and retreives single value', function () {
      t.equal(component.local(d3.select(context)), 'html value');
    });

    describe('set multiple values', function() {
      component.local(d3.select(context).select('#a'), 'value a');
      component.local(d3.select(context).select('#b'), 'value b');
      returnValue = component.local(d3.select(context).selectAll('.item'));

      it('returns value a of independently set values', function() {
        t.equal(returnValue[0], 'value a');
      });
      it('returns value b of independently set values', function() {
        t.equal(returnValue[1], 'value b');
      });
      it('set value on multiple nodes simultaneously', function() {
        component.local(d3.select(context).selectAll('.item'), 'value c');
        returnValue = component.local(d3.select(context).selectAll('.item'));
        t.ok(returnValue.every(function(d) {return d === 'value c'}));
      });
    });
  });

  describe('eventListener', function() {
    var events = d3.dispatch('clap', 'snap'),
        component = {};

    this.timeout(1000);

    component.on = APP.eventListener(events, component);

    it('Is a function', function() {
      t.typeOf(component.on, 'function');
    });
    it('returns component for chaining', function() {
      t.equal(component.on('snap', null), component);
    });

    it('callback called', function(done) {
      t.equal(component.on('snap', callback), component);
      events.call('snap', component, 'some data');
      function callback() {
        done();
      }
    });
  });
});
