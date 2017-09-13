describe('PIE ICONS', function () {
  var t = chai.assert;
  var initialData = [
    {iconPath: '../images/car.svg'},
    {iconPath: '../images/cutlery.svg'},
    {iconPath: '../images/idea.svg'}
  ];

  it('Allows Multiple Instances', function() {
    var descriptionWithArrow1 = APP.descriptionWithArrow().text(1);
    var descriptionWithArrow2 = APP.descriptionWithArrow().text(2);
    t.notEqual(descriptionWithArrow1.text(), descriptionWithArrow2.text());
  });

  describe('Options', function() {
    var defaults = {
          iconPath: null,
          imageWidth: null,
          interpolate: null,
          container: function (selection) {return d3.select(selection._parents[0]);}
        },
        custom = {
          iconPath: 1,
          imageWidth: 2,
          interpolate: 3,
          container: 4
        },
        pieIcons = APP.pieIcons();

    describe('Default Values', function() {
      Object.keys(defaults).forEach(function(option) {
        it(option, function() {
          if (typeof pieIcons[option]() === 'function') {
            t.equal(pieIcons[option]().toString(), defaults[option].toString());
          } else {
            t.equal(pieIcons[option](), defaults[option]);
          }
        })
      });
    });

    describe('Set Values', function() {
      before(function() {
        pieIcons
            .iconPath(custom.iconPath)
            .imageWidth(custom.imageWidth)
            .interpolate(custom.interpolate)
            .container(custom.container);
      });

      Object.keys(custom).forEach(function(option) {
        it(option, function() {
          t.equal(pieIcons[option](), custom[option]);
        });
      });
    });
  });

  describe('Adds to DOM', function()  {
    var node,
        iStart = {startAngle: 1, endAngle: 1.5, innerRadius: 30, outerRadius: 50},
        iEnd = {startAngle: 2, endAngle: 2.5, innerRadius: 40, outerRadius: 60},
        pieIcons,
    trans,
    dom;

    beforeEach(function() {
      node = document.createElement('div');
      window.document.body.appendChild(node);
      pieIcons = APP.pieIcons()
          .iconPath(function(d) {return d.iconPath;})
          .imageWidth(20)
          .interpolate(function() {return d3.interpolate(iStart, iEnd)});

      trans = d3.transition().duration(1);

      dom = d3.select(node)
          .append('svg')
          .selectAll('g')
          .data(initialData)
          .enter()
          .append('g')
          .transition()
          .duration(0)
          .call(pieIcons);
    });

    afterEach(function() {
      window.document.body.removeChild(node);
    });


    it('Initial Data Loads', function() {
      var comparisonNode = document.createElement('div');
      comparisonNode.innerHTML = expected.pieIconsInitial;
      t.ok(equivElms(node, comparisonNode));
    });

    it('Loads Updated Data', function(done) {
      var completedTransitions = 0;
      dom.transition(trans)
          .call(pieIcons.tween)
          .on('end', function onEnd() {
            var comparisonNode;
            if (++completedTransitions >= initialData.length) {
              comparisonNode = document.createElement('div');
              comparisonNode.innerHTML = expected.pieIconsTweened;
              t.ok(equivElms(node, comparisonNode));
              done();
            }
          });
    })
  });

  // https://stackoverflow.com/a/10679802
  function equivElms(elm1, elm2) {
    var attrs1, attrs2, name, node1, node2, index;

    function getAttributeNames(node) {
      var index, rv, attrs;

      rv = [];
      attrs = node.attributes;
      for (index = 0; index < attrs.length; ++index) {
        rv.push(attrs[index].nodeName);
      }
      rv.sort();
      return rv;
    }

    // Compare attributes without order sensitivity
    attrs1 = getAttributeNames(elm1);
    attrs2 = getAttributeNames(elm2);

    if (attrs1.join(",") !== attrs2.join(",")) {
      console.log("Found nodes with different sets of attributes; not equiv");
      return false;
    }

    // ...and values
    // unless you want to compare DOM0 event handlers
    // (onclick="...")
    for (index = 0; index < attrs1.length; ++index) {
      name = attrs1[index];
      if (elm1.getAttribute(name) !== elm2.getAttribute(name)) {
        console.log("Found nodes with mis-matched values for attribute '" + name + "'; not equiv");
        return false;
      }
    }

    // Walk the children
    for (node1 = elm1.firstChild, node2 = elm2.firstChild;
         node1 && node2;
         node1 = node1.nextSibling, node2 = node2.nextSibling) {
      if (node1.nodeType !== node2.nodeType) {
        console.log("Found nodes of different types; not equiv");
        return false;
      }
      if (node1.nodeType === 1) { // Element
        if (!equivElms(node1, node2)) {
          return false;
        }
      }
      else if (node1.nodeValue !== node2.nodeValue) {
        console.log("Found nodes with mis-matched nodeValues; not equiv");
        return false;
      }
    }
    if (node1 || node2) {
      // One of the elements had more nodes than the other
      console.log("Found more children of one element than the other; not equivalent");
      return false;
    }

    // Seem the same
    return true;
  }
});
