(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./lib/main.js":[function(require,module,exports){
"use strict";
/* global require, define, module */

var eventDrops = require('./eventDrops');

if (typeof define === "function" && define.amd) {
  define('d3.chart.eventDrops', ["d3"], function (d3) {
    d3.chart = d3.chart || {};
    d3.chart.eventDrops = eventDrops(d3);
  });
} else if (window) {
  window.d3.chart = window.d3.chart || {};
  window.d3.chart.eventDrops = eventDrops(window.d3);
} else {
  module.exports = eventDrops;
}

},{"./eventDrops":"/home/melodie/Bureau/EventDrops/lib/eventDrops.js"}],"/home/melodie/Bureau/EventDrops/lib/delimiter.js":[function(require,module,exports){
"use strict";
/* global require, module, d3 */

var configurable = require('./util/configurable');

var defaultConfig = {
  xScale: null,
  dateFormat: null
};

module.exports = function (d3) {

  return function (config) {

    config = config || {};
    for (var key in defaultConfig) {
      config[key] = config[key] || defaultConfig[key];
    }

    function delimiter(selection) {
      selection.each(function (data) {
        d3.select(this).selectAll('text').remove();

        var limits = config.xScale.domain();

        d3.select(this).append('text')
          .text(function () {

            return config.dateFormat(limits[0]);
          })
          .classed('start', true)
        ;

        d3.select(this).append('text')
          .text(function () {

            return config.dateFormat(limits[1]);
          })
          .attr('text-anchor', 'end')
          .attr('transform', 'translate(' + config.xScale.range()[1] + ')')
          .classed('end', true)
        ;
      });
    }

    configurable(delimiter, config);

    return delimiter;
  };
};

},{"./util/configurable":"/home/melodie/Bureau/EventDrops/lib/util/configurable.js"}],"/home/melodie/Bureau/EventDrops/lib/eventDrops.js":[function(require,module,exports){
"use strict";
/* global require, module */

var configurable = require('./util/configurable');

module.exports = function (d3) {
  var eventLine = require('./eventLine')(d3);
  var delimiter = require('./delimiter')(d3);

  var defaultConfig = {
    start: new Date(0),
    end: new Date(),
    minScale: 0,
    maxScale: Infinity,
    width: 1000,
    margin: {
      top: 60,
      left: 200,
      bottom: 40,
      right: 50
    },
    locale: null,
    axisFormat: null,
    tickFormat: [
        [".%L", function(d) { return d.getMilliseconds(); }],
        [":%S", function(d) { return d.getSeconds(); }],
        ["%I:%M", function(d) { return d.getMinutes(); }],
        ["%I %p", function(d) { return d.getHours(); }],
        ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
        ["%b %d", function(d) { return d.getDate() != 1; }],
        ["%B", function(d) { return d.getMonth(); }],
        ["%Y", function() { return true; }]
    ],
    eventHover: null,
    eventZoom: null,
    eventClick: null,
    hasDelimiter: true,
    hasTopAxis: true,
    hasBottomAxis: function (data) {
      return data.length >= 10;
    },
    eventLineColor: 'black',
    eventColor: null
  };

  return function eventDrops(config) {
    var xScale = d3.time.scale();
    var yScale = d3.scale.ordinal();
    config = config || {};
    for (var key in defaultConfig) {
      config[key] = config[key] || defaultConfig[key];
    }

    function eventDropGraph(selection) {
      selection.each(function (data) {
        var zoom = d3.behavior.zoom().center(null).scaleExtent([config.minScale, config.maxScale]).on("zoom", updateZoom);

        zoom.on("zoomend", zoomEnd);

        var graphWidth = config.width - config.margin.right - config.margin.left;
        var graphHeight = data.length * 40;
        var height = graphHeight + config.margin.top + config.margin.bottom;


        var canvas_width = 750;
        var canvas_height = 410;

        var lastX=canvas_width/2, lastY=canvas_height/2;

        d3.select(this).select('canvas').remove();
        var canvas = d3.select(this)
          .append('canvas')
          .attr('id', "mon_canvas")
          .attr('width', canvas_width)
          .attr('height', canvas_height)
          .attr('style', "border:1px solid #000000;");

        var canvas = document.getElementsByTagName('canvas')[0];
        canvas.width = canvas_width; canvas.height = canvas_height;

        var ctx = canvas.getContext('2d');
        trackTransforms(ctx);
        function drawAgain(){
          // Clear the entire canvas
          var p1 = ctx.transformedPoint(0,0);
          var p2 = ctx.transformedPoint(canvas.width,canvas.height);
          ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

          ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Toto",750/2,35);
        ctx.fillText("Toto",750/2,75);
        ctx.fillText("Toto",750/2,115);
        ctx.fillText("Toto",750/2,155);

        /*
        // tracé des lignes du graph (a faire dans une boucle)
        ctx.beginPath();
        ctx.moveTo(0, 40);
        ctx.lineTo(750, 40);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 80);
        ctx.lineTo(750, 80);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 120);
        ctx.lineTo(750, 120);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 160);
        ctx.lineTo(750, 160);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 200);
        ctx.lineTo(750, 200);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 240);
        ctx.lineTo(750, 240);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 280);
        ctx.lineTo(750, 280);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 320);
        ctx.lineTo(750, 320);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 360);
        ctx.lineTo(750, 360);
        ctx.closePath();
        ctx.stroke();*/
        }
        // draw the canvas for the first time
        drawAgain();


        var lastX=canvas.width/2, lastY=canvas.height/2;
        var dragStart,dragged;

        // event "clicking"
        canvas.addEventListener('mousedown',function(evt){
          document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
          lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
          //lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
          dragStart = ctx.transformedPoint(lastX,lastY);
          dragged = false;
        },false);

        // event "mouse moving"
        canvas.addEventListener('mousemove',function(evt){
          lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
          //lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
          dragged = true;
          if (dragStart){
            var pt = ctx.transformedPoint(lastX,lastY);
            ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
            drawAgain();
          }
        },false);

        // event "stop clicking"
        canvas.addEventListener('mouseup',function(evt){
          dragStart = null;
          if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
        },false);

        /*var scaleFactor = 1.1;
        var zoom = function(clicks){
          var pt = ctx.transformedPoint(lastX,lastY);
          ctx.translate(pt.x,pt.y);
          var factor = Math.pow(scaleFactor,clicks);
          ctx.scale(factor,1);
          ctx.translate(-pt.x,-pt.y);
          drawAgain();
        }

        var handleScroll = function(evt){
          var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
          if (delta) zoom(delta);
          return evt.preventDefault() && false;
        };
        canvas.addEventListener('DOMMouseScroll',handleScroll,false);
        canvas.addEventListener('mousewheel',handleScroll,false);
      
        */


        d3.select(this).select('svg').remove();

        var svg = d3.select(this)
          .append('svg')
          .attr('width', config.width)
          .attr('height', height)
        ;

        var graph = svg.append('g')
          .attr('transform', 'translate(0, 25)');

        var yDomain = [];
        var yRange = [];

        data.forEach(function (event, index) {
          yDomain.push(event.name);
          yRange.push(index * 40);
        });

        yScale.domain(yDomain).range(yRange);

        // this part in comments used to draw lines in svg on the graph 

        // translation de 40 pour les lignes 

        var yAxisEl = graph.append('g')
          .classed('y-axis', true)
          .attr('transform', 'translate(0, 60)');

        var yTick = yAxisEl.append('g').selectAll('g').data(yDomain);

        //var yTick = graph.append('g').selectAll('g').data(yDomain);

        yTick.enter()
          .append('g')
          .attr('transform', function(d) {
            return 'translate(0, ' + yScale(d) + ')';
          })
          .append('line')
          .classed('y-tick', true)
          .attr('x1', config.margin.left)
          .attr('x2', config.margin.left + graphWidth);

        yTick.exit().remove();

        var curx, cury;
        var zoomRect = svg
          .append('rect')
          .call(zoom)
          .classed('zoom', true)
          .attr('width', graphWidth)
          .attr('height', height )
          .attr('transform', 'translate(' + config.margin.left + ', 35)')
        ;

        if (typeof config.eventHover === 'function') {
          zoomRect.on('mousemove', function(d, e) {
            var event = d3.event;
            if (curx == event.clientX && cury == event.clientY) return;
            curx = event.clientX;
            cury = event.clientY;
            zoomRect.attr('display', 'none');
            var el = document.elementFromPoint(d3.event.clientX, d3.event.clientY);
            zoomRect.attr('display', 'block');
            if (el.tagName !== 'circle') return;
            config.eventHover(el);
          });
        }
        
        if (typeof config.eventClick === 'function') {
          zoomRect.on('click', function () {
            zoomRect.attr('display', 'none');
            var el = document.elementFromPoint(d3.event.clientX, d3.event.clientY);
            zoomRect.attr('display', 'block');
            if (el.tagName !== 'circle') return;
            config.eventClick(el);
          });
        }

        xScale.range([0, graphWidth]).domain([config.start, config.end]);

        zoom.x(xScale);

        function updateZoom() {
          if (d3.event.sourceEvent.toString() === '[object MouseEvent]') {
            zoom.translate([d3.event.translate[0], 0]);
          }

          if (d3.event.sourceEvent.toString() === '[object WheelEvent]') {
            zoom.scale(d3.event.scale);
          }

          redraw();
        }

        function redrawDelimiter() {
          svg.select('.delimiter').remove();
          var delimiterEl = svg
            .append('g')
            .classed('delimiter', true)
            .attr('width', graphWidth)
            .attr('height', 10)
            .attr('transform', 'translate(' + config.margin.left + ', ' + (config.margin.top - 45) + ')')
            .call(delimiter({
              xScale: xScale,
              dateFormat: config.locale ? config.locale.timeFormat("%d %B %Y") : d3.time.format("%d %B %Y")
            }))
          ;
        }

        function zoomEnd() {
          if (config.eventZoom) {
            config.eventZoom(xScale);
          }
          if (config.hasDelimiter) {
            redrawDelimiter();
          }
        }

        function drawXAxis(where) {

          // copy config.tickFormat because d3 format.multi edit its given tickFormat data
          var tickFormatData = [];

          config.tickFormat.forEach(function (item) {
            var tick = item.slice(0);
            tickFormatData.push(tick);
          });

          var tickFormat = config.locale ? config.locale.timeFormat.multi(tickFormatData) : d3.time.format.multi(tickFormatData);
          var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient(where)
            .tickFormat(tickFormat)
          ;

          if (typeof config.axisFormat === 'function') {
            config.axisFormat(xAxis);
          }

          var y = (where == 'bottom' ? parseInt(graphHeight) : 0) + config.margin.top - 40;

          graph.select('.x-axis.' + where).remove();
          var xAxisEl = graph
            .append('g')
            .classed('x-axis', true)
            .classed(where, true)
            .attr('transform', 'translate(' + config.margin.left + ', ' + y + ')')
            .call(xAxis)
          ;
        }

        function redraw() {

          var hasTopAxis = typeof config.hasTopAxis === 'function' ? config.hasTopAxis(data) : config.hasTopAxis;
          if (hasTopAxis) {
            drawXAxis('top');
          }

          var hasBottomAxis = typeof config.hasBottomAxis === 'function' ? config.hasBottomAxis(data) : config.hasBottomAxis;
          if (hasBottomAxis) {
            drawXAxis('bottom');
          }

          zoom.size([config.width, height]);

          graph.select('.graph-body').remove();
          var graphBody = graph
            .append('g')
            .classed('graph-body', true)
            .attr('transform', 'translate(' + config.margin.left + ', ' + (config.margin.top - 15) + ')');

          var lines = graphBody.selectAll('g').data(data);

          lines.enter()
            .append('g')
            .classed('line', true)
            .attr('transform', function(d) {
              return 'translate(0,' + yScale(d.name) + ')';
            })
            .style('fill', config.eventLineColor)
            .call(eventLine({ xScale: xScale, eventColor: config.eventColor }))
          ;

          lines.exit().remove();
        }

        redraw();
        if (config.hasDelimiter) {
          redrawDelimiter();
        }
        if (config.eventZoom) {
          config.eventZoom(xScale);
        }
      });
    }

    // Adds ctx.getTransform() - returns an SVGMatrix
  // Adds ctx.transformedPoint(x,y) - returns an SVGPoint
  function trackTransforms(ctx){
    var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function(){ return xform; };
    
    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function(){
      savedTransforms.push(xform.translate(0,0));
      return save.call(ctx);
    };
    var restore = ctx.restore;
    ctx.restore = function(){
      xform = savedTransforms.pop();
      return restore.call(ctx);
    };

    var scale = ctx.scale;
    ctx.scale = function(sx,sy){
      xform = xform.scaleNonUniform(sx,sy);
      return scale.call(ctx,sx,sy);
    };
    var rotate = ctx.rotate;
    ctx.rotate = function(radians){
      xform = xform.rotate(radians*180/Math.PI);
      return rotate.call(ctx,radians);
    };
    var translate = ctx.translate;
    ctx.translate = function(dx,dy){
      xform = xform.translate(dx,dy);
      return translate.call(ctx,dx,dy);
    };
    var transform = ctx.transform;
    ctx.transform = function(a,b,c,d,e,f){
      var m2 = svg.createSVGMatrix();
      m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
      xform = xform.multiply(m2);
      return transform.call(ctx,a,b,c,d,e,f);
    };
    var setTransform = ctx.setTransform;
    ctx.setTransform = function(a,b,c,d,e,f){
      xform.a = a;
      xform.b = b;
      xform.c = c;
      xform.d = d;
      xform.e = e;
      xform.f = f;
      return setTransform.call(ctx,a,b,c,d,e,f);
    };
    var pt  = svg.createSVGPoint();
    ctx.transformedPoint = function(x,y){
      pt.x=x; pt.y=y;
      return pt.matrixTransform(xform.inverse());
    }
  }

    configurable(eventDropGraph, config);

    return eventDropGraph;
  };
};

},{"./delimiter":"/home/melodie/Bureau/EventDrops/lib/delimiter.js","./eventLine":"/home/melodie/Bureau/EventDrops/lib/eventLine.js","./util/configurable":"/home/melodie/Bureau/EventDrops/lib/util/configurable.js"}],"/home/melodie/Bureau/EventDrops/lib/eventLine.js":[function(require,module,exports){
"use strict";
/* global require, module, d3 */

var configurable = require('./util/configurable');
var filterData = require('./filterData');

var defaultConfig = {
  xScale: null
};

module.exports = function (d3) {
  return function (config) {

    config = config || {
      xScale: null,
      eventColor: null
    };
    for (var key in defaultConfig) {
      config[key] = config[key] || defaultConfig[key];
    }

    var eventLine = function eventLine(selection) {
      selection.each(function (data) {
        d3.select(this).selectAll('text').remove();

        d3.select(this).append('text')
          .text(function(d) {
            var count = filterData(d.dates, config.xScale).length;
            return d.name + (count > 0 ? ' (' + count + ')' : '');
          })
          .attr('text-anchor', 'end')
          .attr('transform', 'translate(-20)')
          .style('fill', 'black')
        ;

        //html
        /*<canvas id ="mon_canvas" width="200" height="100" style="border:1px solid #000000;">
    </canvas>*/

        /*var canvas = d3.select(this)
          .append('canvas')
          .attr('id', "mon_canvas")
          .attr('width', 100)
          .attr('height', 100);*/

        /*var c = document.getElementById("mon_canvas");
        var ctx = c.getContext("2d");
        ctx.font = "30px Arial";
        ctx.fillText("Toto",10,50);*/

        //var texte = canvas.append()

        //d3.select(this).selectAll('circle').remove();

        /*var circle = d3.select(this).selectAll('circle')
          .data(function(d) {
            // filter value outside of range
            return filterData(d.dates, config.xScale);
          });

        circle.enter()
          .append('circle')
          .attr('cx', function(d) {
            return config.xScale(d);
          })
          .style('fill', config.eventColor)
          .attr('cy', -5)
          .attr('r', 10)
        ;

        circle.exit().remove();*/

      });
    };

    configurable(eventLine, config);

    return eventLine;
  };
};

},{"./filterData":"/home/melodie/Bureau/EventDrops/lib/filterData.js","./util/configurable":"/home/melodie/Bureau/EventDrops/lib/util/configurable.js"}],"/home/melodie/Bureau/EventDrops/lib/filterData.js":[function(require,module,exports){
"use strict";
/* global module */

module.exports = function filterDate(data, scale) {
  data = data || [];
  var filteredData = [];
  var boundary = scale.range();
  var min = boundary[0];
  var max = boundary[1];
  data.forEach(function (datum) {
    var value = scale(datum);
    if (value < min || value > max) {
      return;
    }
    filteredData.push(datum);
  });

  return filteredData;
};

},{}],"/home/melodie/Bureau/EventDrops/lib/util/configurable.js":[function(require,module,exports){
module.exports = function configurable(targetFunction, config, listeners) {
  listeners = listeners || {};
  for (var item in config) {
    (function(item) {
      targetFunction[item] = function(value) {
        if (!arguments.length) return config[item];
        config[item] = value;
        if (listeners.hasOwnProperty(item)) {
          listeners[item](value);
        }

        return targetFunction;
      };
    })(item); // for doesn't create a closure, forcing it
  }
};

},{}]},{},["./lib/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL2xpYi9tYWluLmpzIiwiL2hvbWUvbWVsb2RpZS9CdXJlYXUvRXZlbnREcm9wcy9saWIvZGVsaW1pdGVyLmpzIiwiL2hvbWUvbWVsb2RpZS9CdXJlYXUvRXZlbnREcm9wcy9saWIvZXZlbnREcm9wcy5qcyIsIi9ob21lL21lbG9kaWUvQnVyZWF1L0V2ZW50RHJvcHMvbGliL2V2ZW50TGluZS5qcyIsIi9ob21lL21lbG9kaWUvQnVyZWF1L0V2ZW50RHJvcHMvbGliL2ZpbHRlckRhdGEuanMiLCIvaG9tZS9tZWxvZGllL0J1cmVhdS9FdmVudERyb3BzL2xpYi91dGlsL2NvbmZpZ3VyYWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKiBnbG9iYWwgcmVxdWlyZSwgZGVmaW5lLCBtb2R1bGUgKi9cblxudmFyIGV2ZW50RHJvcHMgPSByZXF1aXJlKCcuL2V2ZW50RHJvcHMnKTtcblxuaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gIGRlZmluZSgnZDMuY2hhcnQuZXZlbnREcm9wcycsIFtcImQzXCJdLCBmdW5jdGlvbiAoZDMpIHtcbiAgICBkMy5jaGFydCA9IGQzLmNoYXJ0IHx8IHt9O1xuICAgIGQzLmNoYXJ0LmV2ZW50RHJvcHMgPSBldmVudERyb3BzKGQzKTtcbiAgfSk7XG59IGVsc2UgaWYgKHdpbmRvdykge1xuICB3aW5kb3cuZDMuY2hhcnQgPSB3aW5kb3cuZDMuY2hhcnQgfHwge307XG4gIHdpbmRvdy5kMy5jaGFydC5ldmVudERyb3BzID0gZXZlbnREcm9wcyh3aW5kb3cuZDMpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBldmVudERyb3BzO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKiBnbG9iYWwgcmVxdWlyZSwgbW9kdWxlLCBkMyAqL1xuXG52YXIgY29uZmlndXJhYmxlID0gcmVxdWlyZSgnLi91dGlsL2NvbmZpZ3VyYWJsZScpO1xuXG52YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgeFNjYWxlOiBudWxsLFxuICBkYXRlRm9ybWF0OiBudWxsXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkMykge1xuXG4gIHJldHVybiBmdW5jdGlvbiAoY29uZmlnKSB7XG5cbiAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gICAgZm9yICh2YXIga2V5IGluIGRlZmF1bHRDb25maWcpIHtcbiAgICAgIGNvbmZpZ1trZXldID0gY29uZmlnW2tleV0gfHwgZGVmYXVsdENvbmZpZ1trZXldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlbGltaXRlcihzZWxlY3Rpb24pIHtcbiAgICAgIHNlbGVjdGlvbi5lYWNoKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoJ3RleHQnKS5yZW1vdmUoKTtcblxuICAgICAgICB2YXIgbGltaXRzID0gY29uZmlnLnhTY2FsZS5kb21haW4oKTtcblxuICAgICAgICBkMy5zZWxlY3QodGhpcykuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAudGV4dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBjb25maWcuZGF0ZUZvcm1hdChsaW1pdHNbMF0pO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNsYXNzZWQoJ3N0YXJ0JywgdHJ1ZSlcbiAgICAgICAgO1xuXG4gICAgICAgIGQzLnNlbGVjdCh0aGlzKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy5kYXRlRm9ybWF0KGxpbWl0c1sxXSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuYXR0cigndGV4dC1hbmNob3InLCAnZW5kJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgY29uZmlnLnhTY2FsZS5yYW5nZSgpWzFdICsgJyknKVxuICAgICAgICAgIC5jbGFzc2VkKCdlbmQnLCB0cnVlKVxuICAgICAgICA7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25maWd1cmFibGUoZGVsaW1pdGVyLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIGRlbGltaXRlcjtcbiAgfTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qIGdsb2JhbCByZXF1aXJlLCBtb2R1bGUgKi9cblxudmFyIGNvbmZpZ3VyYWJsZSA9IHJlcXVpcmUoJy4vdXRpbC9jb25maWd1cmFibGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZDMpIHtcbiAgdmFyIGV2ZW50TGluZSA9IHJlcXVpcmUoJy4vZXZlbnRMaW5lJykoZDMpO1xuICB2YXIgZGVsaW1pdGVyID0gcmVxdWlyZSgnLi9kZWxpbWl0ZXInKShkMyk7XG5cbiAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgc3RhcnQ6IG5ldyBEYXRlKDApLFxuICAgIGVuZDogbmV3IERhdGUoKSxcbiAgICBtaW5TY2FsZTogMCxcbiAgICBtYXhTY2FsZTogSW5maW5pdHksXG4gICAgd2lkdGg6IDEwMDAsXG4gICAgbWFyZ2luOiB7XG4gICAgICB0b3A6IDYwLFxuICAgICAgbGVmdDogMjAwLFxuICAgICAgYm90dG9tOiA0MCxcbiAgICAgIHJpZ2h0OiA1MFxuICAgIH0sXG4gICAgbG9jYWxlOiBudWxsLFxuICAgIGF4aXNGb3JtYXQ6IG51bGwsXG4gICAgdGlja0Zvcm1hdDogW1xuICAgICAgICBbXCIuJUxcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5nZXRNaWxsaXNlY29uZHMoKTsgfV0sXG4gICAgICAgIFtcIjolU1wiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmdldFNlY29uZHMoKTsgfV0sXG4gICAgICAgIFtcIiVJOiVNXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZ2V0TWludXRlcygpOyB9XSxcbiAgICAgICAgW1wiJUkgJXBcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5nZXRIb3VycygpOyB9XSxcbiAgICAgICAgW1wiJWEgJWRcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5nZXREYXkoKSAmJiBkLmdldERhdGUoKSAhPSAxOyB9XSxcbiAgICAgICAgW1wiJWIgJWRcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5nZXREYXRlKCkgIT0gMTsgfV0sXG4gICAgICAgIFtcIiVCXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZ2V0TW9udGgoKTsgfV0sXG4gICAgICAgIFtcIiVZXCIsIGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZTsgfV1cbiAgICBdLFxuICAgIGV2ZW50SG92ZXI6IG51bGwsXG4gICAgZXZlbnRab29tOiBudWxsLFxuICAgIGV2ZW50Q2xpY2s6IG51bGwsXG4gICAgaGFzRGVsaW1pdGVyOiB0cnVlLFxuICAgIGhhc1RvcEF4aXM6IHRydWUsXG4gICAgaGFzQm90dG9tQXhpczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIHJldHVybiBkYXRhLmxlbmd0aCA+PSAxMDtcbiAgICB9LFxuICAgIGV2ZW50TGluZUNvbG9yOiAnYmxhY2snLFxuICAgIGV2ZW50Q29sb3I6IG51bGxcbiAgfTtcblxuICByZXR1cm4gZnVuY3Rpb24gZXZlbnREcm9wcyhjb25maWcpIHtcbiAgICB2YXIgeFNjYWxlID0gZDMudGltZS5zY2FsZSgpO1xuICAgIHZhciB5U2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKCk7XG4gICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICAgIGZvciAodmFyIGtleSBpbiBkZWZhdWx0Q29uZmlnKSB7XG4gICAgICBjb25maWdba2V5XSA9IGNvbmZpZ1trZXldIHx8IGRlZmF1bHRDb25maWdba2V5XTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBldmVudERyb3BHcmFwaChzZWxlY3Rpb24pIHtcbiAgICAgIHNlbGVjdGlvbi5lYWNoKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHZhciB6b29tID0gZDMuYmVoYXZpb3Iuem9vbSgpLmNlbnRlcihudWxsKS5zY2FsZUV4dGVudChbY29uZmlnLm1pblNjYWxlLCBjb25maWcubWF4U2NhbGVdKS5vbihcInpvb21cIiwgdXBkYXRlWm9vbSk7XG5cbiAgICAgICAgem9vbS5vbihcInpvb21lbmRcIiwgem9vbUVuZCk7XG5cbiAgICAgICAgdmFyIGdyYXBoV2lkdGggPSBjb25maWcud2lkdGggLSBjb25maWcubWFyZ2luLnJpZ2h0IC0gY29uZmlnLm1hcmdpbi5sZWZ0O1xuICAgICAgICB2YXIgZ3JhcGhIZWlnaHQgPSBkYXRhLmxlbmd0aCAqIDQwO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gZ3JhcGhIZWlnaHQgKyBjb25maWcubWFyZ2luLnRvcCArIGNvbmZpZy5tYXJnaW4uYm90dG9tO1xuXG5cbiAgICAgICAgdmFyIGNhbnZhc193aWR0aCA9IDc1MDtcbiAgICAgICAgdmFyIGNhbnZhc19oZWlnaHQgPSA0MTA7XG5cbiAgICAgICAgdmFyIGxhc3RYPWNhbnZhc193aWR0aC8yLCBsYXN0WT1jYW52YXNfaGVpZ2h0LzI7XG5cbiAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnNlbGVjdCgnY2FudmFzJykucmVtb3ZlKCk7XG4gICAgICAgIHZhciBjYW52YXMgPSBkMy5zZWxlY3QodGhpcylcbiAgICAgICAgICAuYXBwZW5kKCdjYW52YXMnKVxuICAgICAgICAgIC5hdHRyKCdpZCcsIFwibW9uX2NhbnZhc1wiKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIGNhbnZhc193aWR0aClcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywgY2FudmFzX2hlaWdodClcbiAgICAgICAgICAuYXR0cignc3R5bGUnLCBcImJvcmRlcjoxcHggc29saWQgIzAwMDAwMDtcIik7XG5cbiAgICAgICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjYW52YXMnKVswXTtcbiAgICAgICAgY2FudmFzLndpZHRoID0gY2FudmFzX3dpZHRoOyBjYW52YXMuaGVpZ2h0ID0gY2FudmFzX2hlaWdodDtcblxuICAgICAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIHRyYWNrVHJhbnNmb3JtcyhjdHgpO1xuICAgICAgICBmdW5jdGlvbiBkcmF3QWdhaW4oKXtcbiAgICAgICAgICAvLyBDbGVhciB0aGUgZW50aXJlIGNhbnZhc1xuICAgICAgICAgIHZhciBwMSA9IGN0eC50cmFuc2Zvcm1lZFBvaW50KDAsMCk7XG4gICAgICAgICAgdmFyIHAyID0gY3R4LnRyYW5zZm9ybWVkUG9pbnQoY2FudmFzLndpZHRoLGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICAgIGN0eC5jbGVhclJlY3QocDEueCxwMS55LHAyLngtcDEueCxwMi55LXAxLnkpO1xuXG4gICAgICAgICAgY3R4LmZvbnQgPSBcIjMwcHggQXJpYWxcIjtcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG4gICAgICAgIGN0eC5maWxsVGV4dChcIlRvdG9cIiw3NTAvMiwzNSk7XG4gICAgICAgIGN0eC5maWxsVGV4dChcIlRvdG9cIiw3NTAvMiw3NSk7XG4gICAgICAgIGN0eC5maWxsVGV4dChcIlRvdG9cIiw3NTAvMiwxMTUpO1xuICAgICAgICBjdHguZmlsbFRleHQoXCJUb3RvXCIsNzUwLzIsMTU1KTtcblxuICAgICAgICAvKlxuICAgICAgICAvLyB0cmFjw6kgZGVzIGxpZ25lcyBkdSBncmFwaCAoYSBmYWlyZSBkYW5zIHVuZSBib3VjbGUpXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4Lm1vdmVUbygwLCA0MCk7XG4gICAgICAgIGN0eC5saW5lVG8oNzUwLCA0MCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5tb3ZlVG8oMCwgODApO1xuICAgICAgICBjdHgubGluZVRvKDc1MCwgODApO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKDAsIDEyMCk7XG4gICAgICAgIGN0eC5saW5lVG8oNzUwLCAxMjApO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKDAsIDE2MCk7XG4gICAgICAgIGN0eC5saW5lVG8oNzUwLCAxNjApO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKDAsIDIwMCk7XG4gICAgICAgIGN0eC5saW5lVG8oNzUwLCAyMDApO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKDAsIDI0MCk7XG4gICAgICAgIGN0eC5saW5lVG8oNzUwLCAyNDApO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKDAsIDI4MCk7XG4gICAgICAgIGN0eC5saW5lVG8oNzUwLCAyODApO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKDAsIDMyMCk7XG4gICAgICAgIGN0eC5saW5lVG8oNzUwLCAzMjApO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKDAsIDM2MCk7XG4gICAgICAgIGN0eC5saW5lVG8oNzUwLCAzNjApO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIGN0eC5zdHJva2UoKTsqL1xuICAgICAgICB9XG4gICAgICAgIC8vIGRyYXcgdGhlIGNhbnZhcyBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgZHJhd0FnYWluKCk7XG5cblxuICAgICAgICB2YXIgbGFzdFg9Y2FudmFzLndpZHRoLzIsIGxhc3RZPWNhbnZhcy5oZWlnaHQvMjtcbiAgICAgICAgdmFyIGRyYWdTdGFydCxkcmFnZ2VkO1xuXG4gICAgICAgIC8vIGV2ZW50IFwiY2xpY2tpbmdcIlxuICAgICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJyxmdW5jdGlvbihldnQpe1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUubW96VXNlclNlbGVjdCA9IGRvY3VtZW50LmJvZHkuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9IGRvY3VtZW50LmJvZHkuc3R5bGUudXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgICAgICBsYXN0WCA9IGV2dC5vZmZzZXRYIHx8IChldnQucGFnZVggLSBjYW52YXMub2Zmc2V0TGVmdCk7XG4gICAgICAgICAgLy9sYXN0WSA9IGV2dC5vZmZzZXRZIHx8IChldnQucGFnZVkgLSBjYW52YXMub2Zmc2V0VG9wKTtcbiAgICAgICAgICBkcmFnU3RhcnQgPSBjdHgudHJhbnNmb3JtZWRQb2ludChsYXN0WCxsYXN0WSk7XG4gICAgICAgICAgZHJhZ2dlZCA9IGZhbHNlO1xuICAgICAgICB9LGZhbHNlKTtcblxuICAgICAgICAvLyBldmVudCBcIm1vdXNlIG1vdmluZ1wiXG4gICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLGZ1bmN0aW9uKGV2dCl7XG4gICAgICAgICAgbGFzdFggPSBldnQub2Zmc2V0WCB8fCAoZXZ0LnBhZ2VYIC0gY2FudmFzLm9mZnNldExlZnQpO1xuICAgICAgICAgIC8vbGFzdFkgPSBldnQub2Zmc2V0WSB8fCAoZXZ0LnBhZ2VZIC0gY2FudmFzLm9mZnNldFRvcCk7XG4gICAgICAgICAgZHJhZ2dlZCA9IHRydWU7XG4gICAgICAgICAgaWYgKGRyYWdTdGFydCl7XG4gICAgICAgICAgICB2YXIgcHQgPSBjdHgudHJhbnNmb3JtZWRQb2ludChsYXN0WCxsYXN0WSk7XG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKHB0LngtZHJhZ1N0YXJ0LngscHQueS1kcmFnU3RhcnQueSk7XG4gICAgICAgICAgICBkcmF3QWdhaW4oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sZmFsc2UpO1xuXG4gICAgICAgIC8vIGV2ZW50IFwic3RvcCBjbGlja2luZ1wiXG4gICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJyxmdW5jdGlvbihldnQpe1xuICAgICAgICAgIGRyYWdTdGFydCA9IG51bGw7XG4gICAgICAgICAgaWYgKCFkcmFnZ2VkKSB6b29tKGV2dC5zaGlmdEtleSA/IC0xIDogMSApO1xuICAgICAgICB9LGZhbHNlKTtcblxuICAgICAgICAvKnZhciBzY2FsZUZhY3RvciA9IDEuMTtcbiAgICAgICAgdmFyIHpvb20gPSBmdW5jdGlvbihjbGlja3Mpe1xuICAgICAgICAgIHZhciBwdCA9IGN0eC50cmFuc2Zvcm1lZFBvaW50KGxhc3RYLGxhc3RZKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHB0LngscHQueSk7XG4gICAgICAgICAgdmFyIGZhY3RvciA9IE1hdGgucG93KHNjYWxlRmFjdG9yLGNsaWNrcyk7XG4gICAgICAgICAgY3R4LnNjYWxlKGZhY3RvciwxKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC1wdC54LC1wdC55KTtcbiAgICAgICAgICBkcmF3QWdhaW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBoYW5kbGVTY3JvbGwgPSBmdW5jdGlvbihldnQpe1xuICAgICAgICAgIHZhciBkZWx0YSA9IGV2dC53aGVlbERlbHRhID8gZXZ0LndoZWVsRGVsdGEvNDAgOiBldnQuZGV0YWlsID8gLWV2dC5kZXRhaWwgOiAwO1xuICAgICAgICAgIGlmIChkZWx0YSkgem9vbShkZWx0YSk7XG4gICAgICAgICAgcmV0dXJuIGV2dC5wcmV2ZW50RGVmYXVsdCgpICYmIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLGhhbmRsZVNjcm9sbCxmYWxzZSk7XG4gICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXdoZWVsJyxoYW5kbGVTY3JvbGwsZmFsc2UpO1xuICAgICAgXG4gICAgICAgICovXG5cblxuICAgICAgICBkMy5zZWxlY3QodGhpcykuc2VsZWN0KCdzdmcnKS5yZW1vdmUoKTtcblxuICAgICAgICB2YXIgc3ZnID0gZDMuc2VsZWN0KHRoaXMpXG4gICAgICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCBjb25maWcud2lkdGgpXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgO1xuXG4gICAgICAgIHZhciBncmFwaCA9IHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsIDI1KScpO1xuXG4gICAgICAgIHZhciB5RG9tYWluID0gW107XG4gICAgICAgIHZhciB5UmFuZ2UgPSBbXTtcblxuICAgICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50LCBpbmRleCkge1xuICAgICAgICAgIHlEb21haW4ucHVzaChldmVudC5uYW1lKTtcbiAgICAgICAgICB5UmFuZ2UucHVzaChpbmRleCAqIDQwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgeVNjYWxlLmRvbWFpbih5RG9tYWluKS5yYW5nZSh5UmFuZ2UpO1xuXG4gICAgICAgIC8vIHRoaXMgcGFydCBpbiBjb21tZW50cyB1c2VkIHRvIGRyYXcgbGluZXMgaW4gc3ZnIG9uIHRoZSBncmFwaCBcblxuICAgICAgICAvLyB0cmFuc2xhdGlvbiBkZSA0MCBwb3VyIGxlcyBsaWduZXMgXG5cbiAgICAgICAgdmFyIHlBeGlzRWwgPSBncmFwaC5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5jbGFzc2VkKCd5LWF4aXMnLCB0cnVlKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsIDYwKScpO1xuXG4gICAgICAgIHZhciB5VGljayA9IHlBeGlzRWwuYXBwZW5kKCdnJykuc2VsZWN0QWxsKCdnJykuZGF0YSh5RG9tYWluKTtcblxuICAgICAgICAvL3ZhciB5VGljayA9IGdyYXBoLmFwcGVuZCgnZycpLnNlbGVjdEFsbCgnZycpLmRhdGEoeURvbWFpbik7XG5cbiAgICAgICAgeVRpY2suZW50ZXIoKVxuICAgICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgwLCAnICsgeVNjYWxlKGQpICsgJyknO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmFwcGVuZCgnbGluZScpXG4gICAgICAgICAgLmNsYXNzZWQoJ3ktdGljaycsIHRydWUpXG4gICAgICAgICAgLmF0dHIoJ3gxJywgY29uZmlnLm1hcmdpbi5sZWZ0KVxuICAgICAgICAgIC5hdHRyKCd4MicsIGNvbmZpZy5tYXJnaW4ubGVmdCArIGdyYXBoV2lkdGgpO1xuXG4gICAgICAgIHlUaWNrLmV4aXQoKS5yZW1vdmUoKTtcblxuICAgICAgICB2YXIgY3VyeCwgY3VyeTtcbiAgICAgICAgdmFyIHpvb21SZWN0ID0gc3ZnXG4gICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgLmNhbGwoem9vbSlcbiAgICAgICAgICAuY2xhc3NlZCgnem9vbScsIHRydWUpXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgZ3JhcGhXaWR0aClcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0IClcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgY29uZmlnLm1hcmdpbi5sZWZ0ICsgJywgMzUpJylcbiAgICAgICAgO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLmV2ZW50SG92ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB6b29tUmVjdC5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24oZCwgZSkge1xuICAgICAgICAgICAgdmFyIGV2ZW50ID0gZDMuZXZlbnQ7XG4gICAgICAgICAgICBpZiAoY3VyeCA9PSBldmVudC5jbGllbnRYICYmIGN1cnkgPT0gZXZlbnQuY2xpZW50WSkgcmV0dXJuO1xuICAgICAgICAgICAgY3VyeCA9IGV2ZW50LmNsaWVudFg7XG4gICAgICAgICAgICBjdXJ5ID0gZXZlbnQuY2xpZW50WTtcbiAgICAgICAgICAgIHpvb21SZWN0LmF0dHIoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChkMy5ldmVudC5jbGllbnRYLCBkMy5ldmVudC5jbGllbnRZKTtcbiAgICAgICAgICAgIHpvb21SZWN0LmF0dHIoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICAgICAgICAgIGlmIChlbC50YWdOYW1lICE9PSAnY2lyY2xlJykgcmV0dXJuO1xuICAgICAgICAgICAgY29uZmlnLmV2ZW50SG92ZXIoZWwpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5ldmVudENsaWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgem9vbVJlY3Qub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgem9vbVJlY3QuYXR0cignZGlzcGxheScsICdub25lJyk7XG4gICAgICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGQzLmV2ZW50LmNsaWVudFgsIGQzLmV2ZW50LmNsaWVudFkpO1xuICAgICAgICAgICAgem9vbVJlY3QuYXR0cignZGlzcGxheScsICdibG9jaycpO1xuICAgICAgICAgICAgaWYgKGVsLnRhZ05hbWUgIT09ICdjaXJjbGUnKSByZXR1cm47XG4gICAgICAgICAgICBjb25maWcuZXZlbnRDbGljayhlbCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB4U2NhbGUucmFuZ2UoWzAsIGdyYXBoV2lkdGhdKS5kb21haW4oW2NvbmZpZy5zdGFydCwgY29uZmlnLmVuZF0pO1xuXG4gICAgICAgIHpvb20ueCh4U2NhbGUpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVpvb20oKSB7XG4gICAgICAgICAgaWYgKGQzLmV2ZW50LnNvdXJjZUV2ZW50LnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IE1vdXNlRXZlbnRdJykge1xuICAgICAgICAgICAgem9vbS50cmFuc2xhdGUoW2QzLmV2ZW50LnRyYW5zbGF0ZVswXSwgMF0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChkMy5ldmVudC5zb3VyY2VFdmVudC50b1N0cmluZygpID09PSAnW29iamVjdCBXaGVlbEV2ZW50XScpIHtcbiAgICAgICAgICAgIHpvb20uc2NhbGUoZDMuZXZlbnQuc2NhbGUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlZHJhdygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVkcmF3RGVsaW1pdGVyKCkge1xuICAgICAgICAgIHN2Zy5zZWxlY3QoJy5kZWxpbWl0ZXInKS5yZW1vdmUoKTtcbiAgICAgICAgICB2YXIgZGVsaW1pdGVyRWwgPSBzdmdcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgLmNsYXNzZWQoJ2RlbGltaXRlcicsIHRydWUpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCBncmFwaFdpZHRoKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDEwKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIGNvbmZpZy5tYXJnaW4ubGVmdCArICcsICcgKyAoY29uZmlnLm1hcmdpbi50b3AgLSA0NSkgKyAnKScpXG4gICAgICAgICAgICAuY2FsbChkZWxpbWl0ZXIoe1xuICAgICAgICAgICAgICB4U2NhbGU6IHhTY2FsZSxcbiAgICAgICAgICAgICAgZGF0ZUZvcm1hdDogY29uZmlnLmxvY2FsZSA/IGNvbmZpZy5sb2NhbGUudGltZUZvcm1hdChcIiVkICVCICVZXCIpIDogZDMudGltZS5mb3JtYXQoXCIlZCAlQiAlWVwiKVxuICAgICAgICAgICAgfSkpXG4gICAgICAgICAgO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gem9vbUVuZCgpIHtcbiAgICAgICAgICBpZiAoY29uZmlnLmV2ZW50Wm9vbSkge1xuICAgICAgICAgICAgY29uZmlnLmV2ZW50Wm9vbSh4U2NhbGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY29uZmlnLmhhc0RlbGltaXRlcikge1xuICAgICAgICAgICAgcmVkcmF3RGVsaW1pdGVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZHJhd1hBeGlzKHdoZXJlKSB7XG5cbiAgICAgICAgICAvLyBjb3B5IGNvbmZpZy50aWNrRm9ybWF0IGJlY2F1c2UgZDMgZm9ybWF0Lm11bHRpIGVkaXQgaXRzIGdpdmVuIHRpY2tGb3JtYXQgZGF0YVxuICAgICAgICAgIHZhciB0aWNrRm9ybWF0RGF0YSA9IFtdO1xuXG4gICAgICAgICAgY29uZmlnLnRpY2tGb3JtYXQuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgdmFyIHRpY2sgPSBpdGVtLnNsaWNlKDApO1xuICAgICAgICAgICAgdGlja0Zvcm1hdERhdGEucHVzaCh0aWNrKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHZhciB0aWNrRm9ybWF0ID0gY29uZmlnLmxvY2FsZSA/IGNvbmZpZy5sb2NhbGUudGltZUZvcm1hdC5tdWx0aSh0aWNrRm9ybWF0RGF0YSkgOiBkMy50aW1lLmZvcm1hdC5tdWx0aSh0aWNrRm9ybWF0RGF0YSk7XG4gICAgICAgICAgdmFyIHhBeGlzID0gZDMuc3ZnLmF4aXMoKVxuICAgICAgICAgICAgLnNjYWxlKHhTY2FsZSlcbiAgICAgICAgICAgIC5vcmllbnQod2hlcmUpXG4gICAgICAgICAgICAudGlja0Zvcm1hdCh0aWNrRm9ybWF0KVxuICAgICAgICAgIDtcblxuICAgICAgICAgIGlmICh0eXBlb2YgY29uZmlnLmF4aXNGb3JtYXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNvbmZpZy5heGlzRm9ybWF0KHhBeGlzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgeSA9ICh3aGVyZSA9PSAnYm90dG9tJyA/IHBhcnNlSW50KGdyYXBoSGVpZ2h0KSA6IDApICsgY29uZmlnLm1hcmdpbi50b3AgLSA0MDtcblxuICAgICAgICAgIGdyYXBoLnNlbGVjdCgnLngtYXhpcy4nICsgd2hlcmUpLnJlbW92ZSgpO1xuICAgICAgICAgIHZhciB4QXhpc0VsID0gZ3JhcGhcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgLmNsYXNzZWQoJ3gtYXhpcycsIHRydWUpXG4gICAgICAgICAgICAuY2xhc3NlZCh3aGVyZSwgdHJ1ZSlcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBjb25maWcubWFyZ2luLmxlZnQgKyAnLCAnICsgeSArICcpJylcbiAgICAgICAgICAgIC5jYWxsKHhBeGlzKVxuICAgICAgICAgIDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlZHJhdygpIHtcblxuICAgICAgICAgIHZhciBoYXNUb3BBeGlzID0gdHlwZW9mIGNvbmZpZy5oYXNUb3BBeGlzID09PSAnZnVuY3Rpb24nID8gY29uZmlnLmhhc1RvcEF4aXMoZGF0YSkgOiBjb25maWcuaGFzVG9wQXhpcztcbiAgICAgICAgICBpZiAoaGFzVG9wQXhpcykge1xuICAgICAgICAgICAgZHJhd1hBeGlzKCd0b3AnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgaGFzQm90dG9tQXhpcyA9IHR5cGVvZiBjb25maWcuaGFzQm90dG9tQXhpcyA9PT0gJ2Z1bmN0aW9uJyA/IGNvbmZpZy5oYXNCb3R0b21BeGlzKGRhdGEpIDogY29uZmlnLmhhc0JvdHRvbUF4aXM7XG4gICAgICAgICAgaWYgKGhhc0JvdHRvbUF4aXMpIHtcbiAgICAgICAgICAgIGRyYXdYQXhpcygnYm90dG9tJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgem9vbS5zaXplKFtjb25maWcud2lkdGgsIGhlaWdodF0pO1xuXG4gICAgICAgICAgZ3JhcGguc2VsZWN0KCcuZ3JhcGgtYm9keScpLnJlbW92ZSgpO1xuICAgICAgICAgIHZhciBncmFwaEJvZHkgPSBncmFwaFxuICAgICAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAuY2xhc3NlZCgnZ3JhcGgtYm9keScsIHRydWUpXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgY29uZmlnLm1hcmdpbi5sZWZ0ICsgJywgJyArIChjb25maWcubWFyZ2luLnRvcCAtIDE1KSArICcpJyk7XG5cbiAgICAgICAgICB2YXIgbGluZXMgPSBncmFwaEJvZHkuc2VsZWN0QWxsKCdnJykuZGF0YShkYXRhKTtcblxuICAgICAgICAgIGxpbmVzLmVudGVyKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgLmNsYXNzZWQoJ2xpbmUnLCB0cnVlKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICd0cmFuc2xhdGUoMCwnICsgeVNjYWxlKGQubmFtZSkgKyAnKSc7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgY29uZmlnLmV2ZW50TGluZUNvbG9yKVxuICAgICAgICAgICAgLmNhbGwoZXZlbnRMaW5lKHsgeFNjYWxlOiB4U2NhbGUsIGV2ZW50Q29sb3I6IGNvbmZpZy5ldmVudENvbG9yIH0pKVxuICAgICAgICAgIDtcblxuICAgICAgICAgIGxpbmVzLmV4aXQoKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlZHJhdygpO1xuICAgICAgICBpZiAoY29uZmlnLmhhc0RlbGltaXRlcikge1xuICAgICAgICAgIHJlZHJhd0RlbGltaXRlcigpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb25maWcuZXZlbnRab29tKSB7XG4gICAgICAgICAgY29uZmlnLmV2ZW50Wm9vbSh4U2NhbGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBZGRzIGN0eC5nZXRUcmFuc2Zvcm0oKSAtIHJldHVybnMgYW4gU1ZHTWF0cml4XG4gIC8vIEFkZHMgY3R4LnRyYW5zZm9ybWVkUG9pbnQoeCx5KSAtIHJldHVybnMgYW4gU1ZHUG9pbnRcbiAgZnVuY3Rpb24gdHJhY2tUcmFuc2Zvcm1zKGN0eCl7XG4gICAgdmFyIHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsJ3N2ZycpO1xuICAgIHZhciB4Zm9ybSA9IHN2Zy5jcmVhdGVTVkdNYXRyaXgoKTtcbiAgICBjdHguZ2V0VHJhbnNmb3JtID0gZnVuY3Rpb24oKXsgcmV0dXJuIHhmb3JtOyB9O1xuICAgIFxuICAgIHZhciBzYXZlZFRyYW5zZm9ybXMgPSBbXTtcbiAgICB2YXIgc2F2ZSA9IGN0eC5zYXZlO1xuICAgIGN0eC5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICAgIHNhdmVkVHJhbnNmb3Jtcy5wdXNoKHhmb3JtLnRyYW5zbGF0ZSgwLDApKTtcbiAgICAgIHJldHVybiBzYXZlLmNhbGwoY3R4KTtcbiAgICB9O1xuICAgIHZhciByZXN0b3JlID0gY3R4LnJlc3RvcmU7XG4gICAgY3R4LnJlc3RvcmUgPSBmdW5jdGlvbigpe1xuICAgICAgeGZvcm0gPSBzYXZlZFRyYW5zZm9ybXMucG9wKCk7XG4gICAgICByZXR1cm4gcmVzdG9yZS5jYWxsKGN0eCk7XG4gICAgfTtcblxuICAgIHZhciBzY2FsZSA9IGN0eC5zY2FsZTtcbiAgICBjdHguc2NhbGUgPSBmdW5jdGlvbihzeCxzeSl7XG4gICAgICB4Zm9ybSA9IHhmb3JtLnNjYWxlTm9uVW5pZm9ybShzeCxzeSk7XG4gICAgICByZXR1cm4gc2NhbGUuY2FsbChjdHgsc3gsc3kpO1xuICAgIH07XG4gICAgdmFyIHJvdGF0ZSA9IGN0eC5yb3RhdGU7XG4gICAgY3R4LnJvdGF0ZSA9IGZ1bmN0aW9uKHJhZGlhbnMpe1xuICAgICAgeGZvcm0gPSB4Zm9ybS5yb3RhdGUocmFkaWFucyoxODAvTWF0aC5QSSk7XG4gICAgICByZXR1cm4gcm90YXRlLmNhbGwoY3R4LHJhZGlhbnMpO1xuICAgIH07XG4gICAgdmFyIHRyYW5zbGF0ZSA9IGN0eC50cmFuc2xhdGU7XG4gICAgY3R4LnRyYW5zbGF0ZSA9IGZ1bmN0aW9uKGR4LGR5KXtcbiAgICAgIHhmb3JtID0geGZvcm0udHJhbnNsYXRlKGR4LGR5KTtcbiAgICAgIHJldHVybiB0cmFuc2xhdGUuY2FsbChjdHgsZHgsZHkpO1xuICAgIH07XG4gICAgdmFyIHRyYW5zZm9ybSA9IGN0eC50cmFuc2Zvcm07XG4gICAgY3R4LnRyYW5zZm9ybSA9IGZ1bmN0aW9uKGEsYixjLGQsZSxmKXtcbiAgICAgIHZhciBtMiA9IHN2Zy5jcmVhdGVTVkdNYXRyaXgoKTtcbiAgICAgIG0yLmE9YTsgbTIuYj1iOyBtMi5jPWM7IG0yLmQ9ZDsgbTIuZT1lOyBtMi5mPWY7XG4gICAgICB4Zm9ybSA9IHhmb3JtLm11bHRpcGx5KG0yKTtcbiAgICAgIHJldHVybiB0cmFuc2Zvcm0uY2FsbChjdHgsYSxiLGMsZCxlLGYpO1xuICAgIH07XG4gICAgdmFyIHNldFRyYW5zZm9ybSA9IGN0eC5zZXRUcmFuc2Zvcm07XG4gICAgY3R4LnNldFRyYW5zZm9ybSA9IGZ1bmN0aW9uKGEsYixjLGQsZSxmKXtcbiAgICAgIHhmb3JtLmEgPSBhO1xuICAgICAgeGZvcm0uYiA9IGI7XG4gICAgICB4Zm9ybS5jID0gYztcbiAgICAgIHhmb3JtLmQgPSBkO1xuICAgICAgeGZvcm0uZSA9IGU7XG4gICAgICB4Zm9ybS5mID0gZjtcbiAgICAgIHJldHVybiBzZXRUcmFuc2Zvcm0uY2FsbChjdHgsYSxiLGMsZCxlLGYpO1xuICAgIH07XG4gICAgdmFyIHB0ICA9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xuICAgIGN0eC50cmFuc2Zvcm1lZFBvaW50ID0gZnVuY3Rpb24oeCx5KXtcbiAgICAgIHB0Lng9eDsgcHQueT15O1xuICAgICAgcmV0dXJuIHB0Lm1hdHJpeFRyYW5zZm9ybSh4Zm9ybS5pbnZlcnNlKCkpO1xuICAgIH1cbiAgfVxuXG4gICAgY29uZmlndXJhYmxlKGV2ZW50RHJvcEdyYXBoLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIGV2ZW50RHJvcEdyYXBoO1xuICB9O1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLyogZ2xvYmFsIHJlcXVpcmUsIG1vZHVsZSwgZDMgKi9cblxudmFyIGNvbmZpZ3VyYWJsZSA9IHJlcXVpcmUoJy4vdXRpbC9jb25maWd1cmFibGUnKTtcbnZhciBmaWx0ZXJEYXRhID0gcmVxdWlyZSgnLi9maWx0ZXJEYXRhJyk7XG5cbnZhciBkZWZhdWx0Q29uZmlnID0ge1xuICB4U2NhbGU6IG51bGxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGQzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoY29uZmlnKSB7XG5cbiAgICBjb25maWcgPSBjb25maWcgfHwge1xuICAgICAgeFNjYWxlOiBudWxsLFxuICAgICAgZXZlbnRDb2xvcjogbnVsbFxuICAgIH07XG4gICAgZm9yICh2YXIga2V5IGluIGRlZmF1bHRDb25maWcpIHtcbiAgICAgIGNvbmZpZ1trZXldID0gY29uZmlnW2tleV0gfHwgZGVmYXVsdENvbmZpZ1trZXldO1xuICAgIH1cblxuICAgIHZhciBldmVudExpbmUgPSBmdW5jdGlvbiBldmVudExpbmUoc2VsZWN0aW9uKSB7XG4gICAgICBzZWxlY3Rpb24uZWFjaChmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBkMy5zZWxlY3QodGhpcykuc2VsZWN0QWxsKCd0ZXh0JykucmVtb3ZlKCk7XG5cbiAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLnRleHQoZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgdmFyIGNvdW50ID0gZmlsdGVyRGF0YShkLmRhdGVzLCBjb25maWcueFNjYWxlKS5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4gZC5uYW1lICsgKGNvdW50ID4gMCA/ICcgKCcgKyBjb3VudCArICcpJyA6ICcnKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdlbmQnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKC0yMCknKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsICdibGFjaycpXG4gICAgICAgIDtcblxuICAgICAgICAvL2h0bWxcbiAgICAgICAgLyo8Y2FudmFzIGlkID1cIm1vbl9jYW52YXNcIiB3aWR0aD1cIjIwMFwiIGhlaWdodD1cIjEwMFwiIHN0eWxlPVwiYm9yZGVyOjFweCBzb2xpZCAjMDAwMDAwO1wiPlxuICAgIDwvY2FudmFzPiovXG5cbiAgICAgICAgLyp2YXIgY2FudmFzID0gZDMuc2VsZWN0KHRoaXMpXG4gICAgICAgICAgLmFwcGVuZCgnY2FudmFzJylcbiAgICAgICAgICAuYXR0cignaWQnLCBcIm1vbl9jYW52YXNcIilcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCAxMDApXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDEwMCk7Ki9cblxuICAgICAgICAvKnZhciBjID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb25fY2FudmFzXCIpO1xuICAgICAgICB2YXIgY3R4ID0gYy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIGN0eC5mb250ID0gXCIzMHB4IEFyaWFsXCI7XG4gICAgICAgIGN0eC5maWxsVGV4dChcIlRvdG9cIiwxMCw1MCk7Ki9cblxuICAgICAgICAvL3ZhciB0ZXh0ZSA9IGNhbnZhcy5hcHBlbmQoKVxuXG4gICAgICAgIC8vZDMuc2VsZWN0KHRoaXMpLnNlbGVjdEFsbCgnY2lyY2xlJykucmVtb3ZlKCk7XG5cbiAgICAgICAgLyp2YXIgY2lyY2xlID0gZDMuc2VsZWN0KHRoaXMpLnNlbGVjdEFsbCgnY2lyY2xlJylcbiAgICAgICAgICAuZGF0YShmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAvLyBmaWx0ZXIgdmFsdWUgb3V0c2lkZSBvZiByYW5nZVxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlckRhdGEoZC5kYXRlcywgY29uZmlnLnhTY2FsZSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgY2lyY2xlLmVudGVyKClcbiAgICAgICAgICAuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAgIC5hdHRyKCdjeCcsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWcueFNjYWxlKGQpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgY29uZmlnLmV2ZW50Q29sb3IpXG4gICAgICAgICAgLmF0dHIoJ2N5JywgLTUpXG4gICAgICAgICAgLmF0dHIoJ3InLCAxMClcbiAgICAgICAgO1xuXG4gICAgICAgIGNpcmNsZS5leGl0KCkucmVtb3ZlKCk7Ki9cblxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbmZpZ3VyYWJsZShldmVudExpbmUsIGNvbmZpZyk7XG5cbiAgICByZXR1cm4gZXZlbnRMaW5lO1xuICB9O1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLyogZ2xvYmFsIG1vZHVsZSAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZpbHRlckRhdGUoZGF0YSwgc2NhbGUpIHtcbiAgZGF0YSA9IGRhdGEgfHwgW107XG4gIHZhciBmaWx0ZXJlZERhdGEgPSBbXTtcbiAgdmFyIGJvdW5kYXJ5ID0gc2NhbGUucmFuZ2UoKTtcbiAgdmFyIG1pbiA9IGJvdW5kYXJ5WzBdO1xuICB2YXIgbWF4ID0gYm91bmRhcnlbMV07XG4gIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoZGF0dW0pIHtcbiAgICB2YXIgdmFsdWUgPSBzY2FsZShkYXR1bSk7XG4gICAgaWYgKHZhbHVlIDwgbWluIHx8IHZhbHVlID4gbWF4KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZpbHRlcmVkRGF0YS5wdXNoKGRhdHVtKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGZpbHRlcmVkRGF0YTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbmZpZ3VyYWJsZSh0YXJnZXRGdW5jdGlvbiwgY29uZmlnLCBsaXN0ZW5lcnMpIHtcbiAgbGlzdGVuZXJzID0gbGlzdGVuZXJzIHx8IHt9O1xuICBmb3IgKHZhciBpdGVtIGluIGNvbmZpZykge1xuICAgIChmdW5jdGlvbihpdGVtKSB7XG4gICAgICB0YXJnZXRGdW5jdGlvbltpdGVtXSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNvbmZpZ1tpdGVtXTtcbiAgICAgICAgY29uZmlnW2l0ZW1dID0gdmFsdWU7XG4gICAgICAgIGlmIChsaXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoaXRlbSkpIHtcbiAgICAgICAgICBsaXN0ZW5lcnNbaXRlbV0odmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldEZ1bmN0aW9uO1xuICAgICAgfTtcbiAgICB9KShpdGVtKTsgLy8gZm9yIGRvZXNuJ3QgY3JlYXRlIGEgY2xvc3VyZSwgZm9yY2luZyBpdFxuICB9XG59O1xuIl19
