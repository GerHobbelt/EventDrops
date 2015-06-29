(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/melodie/Bureau/EventDrops/lib/canvasHandler.js":[function(require,module,exports){
"use strict";
/* global require, module */

var defaultConfig = {
  xScale: null
};

module.exports = function (d3, document, config) {
  return function (config) {

    config = config || {
      xScale: null,
      eventColor: null
    };
    for (var key in defaultConfig) {
     config[key] = config[key] || defaultConfig[key];
    }

    function canvasHandler(x, y) {
      this.graphWidth = x;
      this.graphHeight = y;
      this.lastX = graphWidth/2;
      this.lastY = graphHeight/2;
      this.mouseDown = 0;
      this.ctx = null;
      this.canvas = null;
    }

    /*var graphHeight, graphWidth;
    var lastX, lastY;
    var ctx;
    var mouseDown = 0;
    var dragStart, dragged;*/

    /*var canvasHandler = function () {
      var graphWidth = config.width - config.margin.right - config.margin.left;
      alert(graphWidth);
      var graphHeight = data.length * 40;
      alert(graphHeight);
      var ctx = (canvas.node()).getContext('2d');
      var mouseDown = 0;
      var lastX = graphWidth/2;
      var lastY = graphHeight/2;
    }*/

      this.init = function (selection, x, y) {
        /*this.graphWidth = x;
        this.graphHeight = y;
        this.mouseDown = 0;
        this.lastX = x/2;
        this.lastY = y/2;*/

        selection.each(function (data) {
          d3.select(this).select('canvas').remove();
          var canvas = d3.select(this)
            .append('canvas')
            .attr('id', "mon_canvas")
            .attr('width', this.graphWidth)
            .attr('height', this.graphHeight)
            ;
          this.ctx = canvas.node().getContext('2d');
        });
      }

      this.draw = function(){
        // Clear the entire canvas
        var topX = 0;
        var topY = 0;
        //alert(graphWidth);
        this.ctx.clearRect(topX, topY, topX + graphWidth, topY + graphHeight);

        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Toto",750/2,35);
        ctx.fillText("Toto",750/2,75);
        ctx.fillText("Toto",750/2,115);
        ctx.fillText("Toto",750/2,155);
      }

      this.drawCircle = function (x, y) {
        context.beginPath();
        context.lineWidth="2";
        context.fillStyle="#FF4422";
        context.arc(x, y, 90, 0, 2 * Math.PI);
        context.fill();
      }

      this.mouseDownHandler = function(evt){
        // permits compatibility with every browser
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        //lastX = evt.offsetX || (evt.pageX - canvas.node().offsetLeft);
        lastX = evt.clientX;
        //lastY = graphHeight/2;
        //alert(lastX);
        var dragStart = {
          x : lastX,
          y : lastY
        };
        var dragged = false;
        mouseDown++;

        //canvas.node().addEventListener('mousemove', c.mouseMoveHandler,false);
        //canvas.node().addEventListener('mouseup', c.mouseUpHandler,false);
      }

      this.mouseMoveHandler = function(evt){
        //lastX = evt.offsetX || (evt.pageX - canvas.node().offsetLeft);
        lastX = evt.clientX;
        dragged = true;
        if (dragStart && mouseDown){
          ctx.translate(lastX-dragStart.x, lastY-dragStart.y);
          //ctx.translate([d3.event.translate[0], 0]);
          drawAgain();
        }
      }

      this.mouseUpHandler = function(evt){
        //canvas.node().addEventListener('mousemove', c.mouseMoveHandler,false);
        //canvas.node().addEventListener('mousedown', c.mouseDownHandler,false);

        dragStart = null;
        mouseDown--;
        if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
      }
  }
}

},{}],"/home/melodie/Bureau/EventDrops/lib/delimiter.js":[function(require,module,exports){
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

module.exports = function (d3, document) {
  //var eventLine = require('./eventLine')(d3);
  var delimiter = require('./delimiter')(d3);
  var canvasHandler = require('./canvasHandler')(d3, document);

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

		  	window.requestAnimFrame = (function(){
		      return  window.requestAnimationFrame       ||
		              window.webkitRequestAnimationFrame ||
		              window.mozRequestAnimationFrame    ||
		              window.oRequestAnimationFrame      ||
		              window.msRequestAnimationFrame     ||
		              function(/* function */ callback, /* DOMElement */ element) {
		                window.setTimeout(callback, 1000 / 60);
		              };
	    	})();

				var zoom = d3.behavior.zoom().center(null).scaleExtent([config.minScale, config.maxScale]).on("zoom", updateZoom);

				zoom.on("zoomend", zoomEnd);

				var graphWidth = config.width - config.margin.right - config.margin.left;
				var graphHeight = data.length * 40;
				var height = graphHeight + config.margin.top + config.margin.bottom;

				var canvas_width =  graphWidth;
				var canvas_height = graphHeight;

        var lastX = graphWidth/2;
        var lastY = graphHeight/2;
        var dragged, dragStart;
        var mouseDown = 0;

				d3.select(this).select('canvas').remove();
  			var canvas = d3.select(this)
  			  .append('canvas')
  			  .attr('id', "mon_canvas")
  			  .attr('width', canvas_width)
  			  .attr('height', canvas_height);

		    var ctx = (canvas.node()).getContext('2d');

        var eventLine = require('./eventLine')(d3, ctx);

			function drawAgain(){
			  // Clear the entire canvas
			  var topX = 0;
			  var topY = 0;
			  ctx.clearRect(topX, topY, topX + canvas.node().width, topY + canvas.node().height);

			  ctx.font = "30px Arial";
				ctx.textAlign = "center";
				ctx.fillText("Toto",750/2,35);
				ctx.fillText("Toto",750/2,75);
				ctx.fillText("Toto",750/2,115);
				ctx.fillText("Toto",750/2,155);
			}
			// draw the canvas for the first time
			drawAgain();

      canvas.node().addEventListener('mousedown', function (evt) {
        // permits compatibility with every browser
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        lastX = evt.clientX;
        dragStart = {
          x : lastX,
          y : lastY
        };
        dragged = false;
        mouseDown++;
      },false);

      canvas.node().addEventListener('mousemove', function (evt) {
        lastX = evt.clientX;
        dragged = true;
        if (dragStart && mouseDown){
          ctx.translate(lastX-dragStart.x, lastY-dragStart.y);
          drawAgain();
          redraw();
          //zoom.translate([d3.event.translate[0], 0]);
        }
      },false);

      canvas.node().addEventListener('mouseup', function (evt) {
        dragStart = null;
        mouseDown--;
        if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
      },false);

			/*var c = new canvasHandler(graphWidth, graphHeight);

      c.init(selection, graphWidth, graphHeight);
			c.draw();*/

			/*var lastX=canvas.node().width/2, lastY=canvas.node().height/2;
			var mouseDown = 0;
			var dragged;
			var dragStart = {
				x : lastX,
				y : lastY
			};
console.log('ok');*/

      /*var canvas = d3.select(this).selectAll('canvas');

			// event "clicking"
			canvas.node().addEventListener('mousedown', c.mouseDownHandler,false);

      canvas.node().addEventListener('mousemove', c.mouseMoveHandler,false);

      canvas.node().addEventListener('mouseup', c.mouseUpHandler,false);
*/
			// event "mouse moving"
			//canvas.node().addEventListener('mousemove', c.mouseMoveHandler,false);

			// event "stop clicking"
			//canvas.node().addEventListener('mouseup', c.mouseUpHandler,false);

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
        console.log(d3.event.sourceEvent);
        if (d3.event.sourceEvent.toString() === '[object MouseEvent]') {
        zoom.translate([d3.event.translate[0], 0]);
        ctx.translate(d3.event.translate[0], 0);
			  }

			  if (d3.event.sourceEvent.toString() === '[object WheelEvent]') {
				zoom.scale(d3.event.scale);
			  }
        drawAgain();
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

		configurable(eventDropGraph, config);

		return eventDropGraph;
  };
};

},{"./canvasHandler":"/home/melodie/Bureau/EventDrops/lib/canvasHandler.js","./delimiter":"/home/melodie/Bureau/EventDrops/lib/delimiter.js","./eventLine":"/home/melodie/Bureau/EventDrops/lib/eventLine.js","./util/configurable":"/home/melodie/Bureau/EventDrops/lib/util/configurable.js"}],"/home/melodie/Bureau/EventDrops/lib/eventLine.js":[function(require,module,exports){
"use strict";
/* global require, module, d3 */

var configurable = require('./util/configurable');
var filterData = require('./filterData');

var defaultConfig = {
  xScale: null
};

module.exports = function (d3, ctx) {
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

        var data = d3.select(this).selectAll('canvas')
          .data(function(d) {
            return filterData(d.dates, config.xScale);
          });
/*
        ctx.beginPath();
        ctx.arc(function() {
          return 100;
        }, 350/2, 10, 0, 2 * Math.PI);
        ctx.fillStyle = config.eventColor;
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(750/2, 350/2, 10, 0, 2 * Math.PI);
        ctx.fillStyle="red";
        ctx.fill();
        ctx.closePath();*/

        data.forEach(function(d, i) {
          ctx.beginPath();
          ctx.arc(function(d) {
            return config.xScale(d);
          }, 350/2, 10, 0, 2 * Math.PI);
          ctx.fillStyle = config.eventColor;
          ctx.fill();
          ctx.closePath();
        });

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

},{}],"/home/melodie/Bureau/EventDrops/lib/main.js":[function(require,module,exports){
"use strict";
/* global require, define, module */

var eventDrops = require('./eventDrops');

if (typeof define === "function" && define.amd) {
  define('d3.chart.eventDrops', ["d3"], function (d3) {
    d3.chart = d3.chart || {};
    d3.chart.eventDrops = eventDrops(d3, document);
  });
} else if (window) {
  window.d3.chart = window.d3.chart || {};
  window.d3.chart.eventDrops = eventDrops(window.d3, document);
} else {
  module.exports = eventDrops;
}

},{"./eventDrops":"/home/melodie/Bureau/EventDrops/lib/eventDrops.js"}],"/home/melodie/Bureau/EventDrops/lib/util/configurable.js":[function(require,module,exports){
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

},{}]},{},["/home/melodie/Bureau/EventDrops/lib/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9tZWxvZGllL0J1cmVhdS9FdmVudERyb3BzL2xpYi9jYW52YXNIYW5kbGVyLmpzIiwiL2hvbWUvbWVsb2RpZS9CdXJlYXUvRXZlbnREcm9wcy9saWIvZGVsaW1pdGVyLmpzIiwiL2hvbWUvbWVsb2RpZS9CdXJlYXUvRXZlbnREcm9wcy9saWIvZXZlbnREcm9wcy5qcyIsIi9ob21lL21lbG9kaWUvQnVyZWF1L0V2ZW50RHJvcHMvbGliL2V2ZW50TGluZS5qcyIsIi9ob21lL21lbG9kaWUvQnVyZWF1L0V2ZW50RHJvcHMvbGliL2ZpbHRlckRhdGEuanMiLCIvaG9tZS9tZWxvZGllL0J1cmVhdS9FdmVudERyb3BzL2xpYi9tYWluLmpzIiwiL2hvbWUvbWVsb2RpZS9CdXJlYXUvRXZlbnREcm9wcy9saWIvdXRpbC9jb25maWd1cmFibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKiBnbG9iYWwgcmVxdWlyZSwgbW9kdWxlICovXG5cbnZhciBkZWZhdWx0Q29uZmlnID0ge1xuICB4U2NhbGU6IG51bGxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGQzLCBkb2N1bWVudCwgY29uZmlnKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoY29uZmlnKSB7XG5cbiAgICBjb25maWcgPSBjb25maWcgfHwge1xuICAgICAgeFNjYWxlOiBudWxsLFxuICAgICAgZXZlbnRDb2xvcjogbnVsbFxuICAgIH07XG4gICAgZm9yICh2YXIga2V5IGluIGRlZmF1bHRDb25maWcpIHtcbiAgICAgY29uZmlnW2tleV0gPSBjb25maWdba2V5XSB8fCBkZWZhdWx0Q29uZmlnW2tleV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FudmFzSGFuZGxlcih4LCB5KSB7XG4gICAgICB0aGlzLmdyYXBoV2lkdGggPSB4O1xuICAgICAgdGhpcy5ncmFwaEhlaWdodCA9IHk7XG4gICAgICB0aGlzLmxhc3RYID0gZ3JhcGhXaWR0aC8yO1xuICAgICAgdGhpcy5sYXN0WSA9IGdyYXBoSGVpZ2h0LzI7XG4gICAgICB0aGlzLm1vdXNlRG93biA9IDA7XG4gICAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgICB0aGlzLmNhbnZhcyA9IG51bGw7XG4gICAgfVxuXG4gICAgLyp2YXIgZ3JhcGhIZWlnaHQsIGdyYXBoV2lkdGg7XG4gICAgdmFyIGxhc3RYLCBsYXN0WTtcbiAgICB2YXIgY3R4O1xuICAgIHZhciBtb3VzZURvd24gPSAwO1xuICAgIHZhciBkcmFnU3RhcnQsIGRyYWdnZWQ7Ki9cblxuICAgIC8qdmFyIGNhbnZhc0hhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZ3JhcGhXaWR0aCA9IGNvbmZpZy53aWR0aCAtIGNvbmZpZy5tYXJnaW4ucmlnaHQgLSBjb25maWcubWFyZ2luLmxlZnQ7XG4gICAgICBhbGVydChncmFwaFdpZHRoKTtcbiAgICAgIHZhciBncmFwaEhlaWdodCA9IGRhdGEubGVuZ3RoICogNDA7XG4gICAgICBhbGVydChncmFwaEhlaWdodCk7XG4gICAgICB2YXIgY3R4ID0gKGNhbnZhcy5ub2RlKCkpLmdldENvbnRleHQoJzJkJyk7XG4gICAgICB2YXIgbW91c2VEb3duID0gMDtcbiAgICAgIHZhciBsYXN0WCA9IGdyYXBoV2lkdGgvMjtcbiAgICAgIHZhciBsYXN0WSA9IGdyYXBoSGVpZ2h0LzI7XG4gICAgfSovXG5cbiAgICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uIChzZWxlY3Rpb24sIHgsIHkpIHtcbiAgICAgICAgLyp0aGlzLmdyYXBoV2lkdGggPSB4O1xuICAgICAgICB0aGlzLmdyYXBoSGVpZ2h0ID0geTtcbiAgICAgICAgdGhpcy5tb3VzZURvd24gPSAwO1xuICAgICAgICB0aGlzLmxhc3RYID0geC8yO1xuICAgICAgICB0aGlzLmxhc3RZID0geS8yOyovXG5cbiAgICAgICAgc2VsZWN0aW9uLmVhY2goZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBkMy5zZWxlY3QodGhpcykuc2VsZWN0KCdjYW52YXMnKS5yZW1vdmUoKTtcbiAgICAgICAgICB2YXIgY2FudmFzID0gZDMuc2VsZWN0KHRoaXMpXG4gICAgICAgICAgICAuYXBwZW5kKCdjYW52YXMnKVxuICAgICAgICAgICAgLmF0dHIoJ2lkJywgXCJtb25fY2FudmFzXCIpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLmdyYXBoV2lkdGgpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5ncmFwaEhlaWdodClcbiAgICAgICAgICAgIDtcbiAgICAgICAgICB0aGlzLmN0eCA9IGNhbnZhcy5ub2RlKCkuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZHJhdyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIENsZWFyIHRoZSBlbnRpcmUgY2FudmFzXG4gICAgICAgIHZhciB0b3BYID0gMDtcbiAgICAgICAgdmFyIHRvcFkgPSAwO1xuICAgICAgICAvL2FsZXJ0KGdyYXBoV2lkdGgpO1xuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QodG9wWCwgdG9wWSwgdG9wWCArIGdyYXBoV2lkdGgsIHRvcFkgKyBncmFwaEhlaWdodCk7XG5cbiAgICAgICAgY3R4LmZvbnQgPSBcIjMwcHggQXJpYWxcIjtcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG4gICAgICAgIGN0eC5maWxsVGV4dChcIlRvdG9cIiw3NTAvMiwzNSk7XG4gICAgICAgIGN0eC5maWxsVGV4dChcIlRvdG9cIiw3NTAvMiw3NSk7XG4gICAgICAgIGN0eC5maWxsVGV4dChcIlRvdG9cIiw3NTAvMiwxMTUpO1xuICAgICAgICBjdHguZmlsbFRleHQoXCJUb3RvXCIsNzUwLzIsMTU1KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5kcmF3Q2lyY2xlID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGg9XCIyXCI7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlPVwiI0ZGNDQyMlwiO1xuICAgICAgICBjb250ZXh0LmFyYyh4LCB5LCA5MCwgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5tb3VzZURvd25IYW5kbGVyID0gZnVuY3Rpb24oZXZ0KXtcbiAgICAgICAgLy8gcGVybWl0cyBjb21wYXRpYmlsaXR5IHdpdGggZXZlcnkgYnJvd3NlclxuICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm1velVzZXJTZWxlY3QgPSBkb2N1bWVudC5ib2R5LnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSBkb2N1bWVudC5ib2R5LnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICAgIC8vbGFzdFggPSBldnQub2Zmc2V0WCB8fCAoZXZ0LnBhZ2VYIC0gY2FudmFzLm5vZGUoKS5vZmZzZXRMZWZ0KTtcbiAgICAgICAgbGFzdFggPSBldnQuY2xpZW50WDtcbiAgICAgICAgLy9sYXN0WSA9IGdyYXBoSGVpZ2h0LzI7XG4gICAgICAgIC8vYWxlcnQobGFzdFgpO1xuICAgICAgICB2YXIgZHJhZ1N0YXJ0ID0ge1xuICAgICAgICAgIHggOiBsYXN0WCxcbiAgICAgICAgICB5IDogbGFzdFlcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGRyYWdnZWQgPSBmYWxzZTtcbiAgICAgICAgbW91c2VEb3duKys7XG5cbiAgICAgICAgLy9jYW52YXMubm9kZSgpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGMubW91c2VNb3ZlSGFuZGxlcixmYWxzZSk7XG4gICAgICAgIC8vY2FudmFzLm5vZGUoKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgYy5tb3VzZVVwSGFuZGxlcixmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubW91c2VNb3ZlSGFuZGxlciA9IGZ1bmN0aW9uKGV2dCl7XG4gICAgICAgIC8vbGFzdFggPSBldnQub2Zmc2V0WCB8fCAoZXZ0LnBhZ2VYIC0gY2FudmFzLm5vZGUoKS5vZmZzZXRMZWZ0KTtcbiAgICAgICAgbGFzdFggPSBldnQuY2xpZW50WDtcbiAgICAgICAgZHJhZ2dlZCA9IHRydWU7XG4gICAgICAgIGlmIChkcmFnU3RhcnQgJiYgbW91c2VEb3duKXtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKGxhc3RYLWRyYWdTdGFydC54LCBsYXN0WS1kcmFnU3RhcnQueSk7XG4gICAgICAgICAgLy9jdHgudHJhbnNsYXRlKFtkMy5ldmVudC50cmFuc2xhdGVbMF0sIDBdKTtcbiAgICAgICAgICBkcmF3QWdhaW4oKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLm1vdXNlVXBIYW5kbGVyID0gZnVuY3Rpb24oZXZ0KXtcbiAgICAgICAgLy9jYW52YXMubm9kZSgpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGMubW91c2VNb3ZlSGFuZGxlcixmYWxzZSk7XG4gICAgICAgIC8vY2FudmFzLm5vZGUoKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBjLm1vdXNlRG93bkhhbmRsZXIsZmFsc2UpO1xuXG4gICAgICAgIGRyYWdTdGFydCA9IG51bGw7XG4gICAgICAgIG1vdXNlRG93bi0tO1xuICAgICAgICBpZiAoIWRyYWdnZWQpIHpvb20oZXZ0LnNoaWZ0S2V5ID8gLTEgOiAxICk7XG4gICAgICB9XG4gIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuLyogZ2xvYmFsIHJlcXVpcmUsIG1vZHVsZSwgZDMgKi9cblxudmFyIGNvbmZpZ3VyYWJsZSA9IHJlcXVpcmUoJy4vdXRpbC9jb25maWd1cmFibGUnKTtcblxudmFyIGRlZmF1bHRDb25maWcgPSB7XG4gIHhTY2FsZTogbnVsbCxcbiAgZGF0ZUZvcm1hdDogbnVsbFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZDMpIHtcblxuICByZXR1cm4gZnVuY3Rpb24gKGNvbmZpZykge1xuXG4gICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICAgIGZvciAodmFyIGtleSBpbiBkZWZhdWx0Q29uZmlnKSB7XG4gICAgICBjb25maWdba2V5XSA9IGNvbmZpZ1trZXldIHx8IGRlZmF1bHRDb25maWdba2V5XTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWxpbWl0ZXIoc2VsZWN0aW9uKSB7XG4gICAgICBzZWxlY3Rpb24uZWFjaChmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBkMy5zZWxlY3QodGhpcykuc2VsZWN0QWxsKCd0ZXh0JykucmVtb3ZlKCk7XG5cbiAgICAgICAgdmFyIGxpbWl0cyA9IGNvbmZpZy54U2NhbGUuZG9tYWluKCk7XG5cbiAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLnRleHQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICByZXR1cm4gY29uZmlnLmRhdGVGb3JtYXQobGltaXRzWzBdKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jbGFzc2VkKCdzdGFydCcsIHRydWUpXG4gICAgICAgIDtcblxuICAgICAgICBkMy5zZWxlY3QodGhpcykuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAudGV4dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBjb25maWcuZGF0ZUZvcm1hdChsaW1pdHNbMV0pO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ2VuZCcpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIGNvbmZpZy54U2NhbGUucmFuZ2UoKVsxXSArICcpJylcbiAgICAgICAgICAuY2xhc3NlZCgnZW5kJywgdHJ1ZSlcbiAgICAgICAgO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uZmlndXJhYmxlKGRlbGltaXRlciwgY29uZmlnKTtcblxuICAgIHJldHVybiBkZWxpbWl0ZXI7XG4gIH07XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKiBnbG9iYWwgcmVxdWlyZSwgbW9kdWxlICovXG5cbnZhciBjb25maWd1cmFibGUgPSByZXF1aXJlKCcuL3V0aWwvY29uZmlndXJhYmxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGQzLCBkb2N1bWVudCkge1xuICAvL3ZhciBldmVudExpbmUgPSByZXF1aXJlKCcuL2V2ZW50TGluZScpKGQzKTtcbiAgdmFyIGRlbGltaXRlciA9IHJlcXVpcmUoJy4vZGVsaW1pdGVyJykoZDMpO1xuICB2YXIgY2FudmFzSGFuZGxlciA9IHJlcXVpcmUoJy4vY2FudmFzSGFuZGxlcicpKGQzLCBkb2N1bWVudCk7XG5cbiAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG5cdFx0c3RhcnQ6IG5ldyBEYXRlKDApLFxuXHRcdGVuZDogbmV3IERhdGUoKSxcblx0XHRtaW5TY2FsZTogMCxcblx0XHRtYXhTY2FsZTogSW5maW5pdHksXG5cdFx0d2lkdGg6IDEwMDAsXG5cdFx0bWFyZ2luOiB7XG5cdFx0ICB0b3A6IDYwLFxuXHRcdCAgbGVmdDogMjAwLFxuXHRcdCAgYm90dG9tOiA0MCxcblx0XHQgIHJpZ2h0OiA1MFxuXHRcdH0sXG5cdFx0bG9jYWxlOiBudWxsLFxuXHRcdGF4aXNGb3JtYXQ6IG51bGwsXG5cdFx0dGlja0Zvcm1hdDogW1xuXHRcdFx0W1wiLiVMXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZ2V0TWlsbGlzZWNvbmRzKCk7IH1dLFxuXHRcdFx0W1wiOiVTXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZ2V0U2Vjb25kcygpOyB9XSxcblx0XHRcdFtcIiVJOiVNXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZ2V0TWludXRlcygpOyB9XSxcblx0XHRcdFtcIiVJICVwXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZ2V0SG91cnMoKTsgfV0sXG5cdFx0XHRbXCIlYSAlZFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmdldERheSgpICYmIGQuZ2V0RGF0ZSgpICE9IDE7IH1dLFxuXHRcdFx0W1wiJWIgJWRcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5nZXREYXRlKCkgIT0gMTsgfV0sXG5cdFx0XHRbXCIlQlwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmdldE1vbnRoKCk7IH1dLFxuXHRcdFx0W1wiJVlcIiwgZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlOyB9XVxuXHRcdF0sXG5cdFx0ZXZlbnRIb3ZlcjogbnVsbCxcblx0XHRldmVudFpvb206IG51bGwsXG5cdFx0ZXZlbnRDbGljazogbnVsbCxcblx0XHRoYXNEZWxpbWl0ZXI6IHRydWUsXG5cdFx0aGFzVG9wQXhpczogdHJ1ZSxcblx0XHRoYXNCb3R0b21BeGlzOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdCAgcmV0dXJuIGRhdGEubGVuZ3RoID49IDEwO1xuXHRcdH0sXG5cdFx0ZXZlbnRMaW5lQ29sb3I6ICdibGFjaycsXG5cdFx0ZXZlbnRDb2xvcjogbnVsbFxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbiBldmVudERyb3BzKGNvbmZpZykge1xuXHRcdHZhciB4U2NhbGUgPSBkMy50aW1lLnNjYWxlKCk7XG5cdFx0dmFyIHlTY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKTtcblx0XHRjb25maWcgPSBjb25maWcgfHwge307XG5cdFx0Zm9yICh2YXIga2V5IGluIGRlZmF1bHRDb25maWcpIHtcblx0XHQgIGNvbmZpZ1trZXldID0gY29uZmlnW2tleV0gfHwgZGVmYXVsdENvbmZpZ1trZXldO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGV2ZW50RHJvcEdyYXBoKHNlbGVjdGlvbikge1xuXHRcdCAgc2VsZWN0aW9uLmVhY2goZnVuY3Rpb24gKGRhdGEpIHtcblxuXHRcdCAgXHR3aW5kb3cucmVxdWVzdEFuaW1GcmFtZSA9IChmdW5jdGlvbigpe1xuXHRcdCAgICAgIHJldHVybiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgICB8fFxuXHRcdCAgICAgICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuXHRcdCAgICAgICAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSAgICB8fFxuXHRcdCAgICAgICAgICAgICAgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgICB8fFxuXHRcdCAgICAgICAgICAgICAgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICB8fFxuXHRcdCAgICAgICAgICAgICAgZnVuY3Rpb24oLyogZnVuY3Rpb24gKi8gY2FsbGJhY2ssIC8qIERPTUVsZW1lbnQgKi8gZWxlbWVudCkge1xuXHRcdCAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcblx0XHQgICAgICAgICAgICAgIH07XG5cdCAgICBcdH0pKCk7XG5cblx0XHRcdFx0dmFyIHpvb20gPSBkMy5iZWhhdmlvci56b29tKCkuY2VudGVyKG51bGwpLnNjYWxlRXh0ZW50KFtjb25maWcubWluU2NhbGUsIGNvbmZpZy5tYXhTY2FsZV0pLm9uKFwiem9vbVwiLCB1cGRhdGVab29tKTtcblxuXHRcdFx0XHR6b29tLm9uKFwiem9vbWVuZFwiLCB6b29tRW5kKTtcblxuXHRcdFx0XHR2YXIgZ3JhcGhXaWR0aCA9IGNvbmZpZy53aWR0aCAtIGNvbmZpZy5tYXJnaW4ucmlnaHQgLSBjb25maWcubWFyZ2luLmxlZnQ7XG5cdFx0XHRcdHZhciBncmFwaEhlaWdodCA9IGRhdGEubGVuZ3RoICogNDA7XG5cdFx0XHRcdHZhciBoZWlnaHQgPSBncmFwaEhlaWdodCArIGNvbmZpZy5tYXJnaW4udG9wICsgY29uZmlnLm1hcmdpbi5ib3R0b207XG5cblx0XHRcdFx0dmFyIGNhbnZhc193aWR0aCA9ICBncmFwaFdpZHRoO1xuXHRcdFx0XHR2YXIgY2FudmFzX2hlaWdodCA9IGdyYXBoSGVpZ2h0O1xuXG4gICAgICAgIHZhciBsYXN0WCA9IGdyYXBoV2lkdGgvMjtcbiAgICAgICAgdmFyIGxhc3RZID0gZ3JhcGhIZWlnaHQvMjtcbiAgICAgICAgdmFyIGRyYWdnZWQsIGRyYWdTdGFydDtcbiAgICAgICAgdmFyIG1vdXNlRG93biA9IDA7XG5cblx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpLnNlbGVjdCgnY2FudmFzJykucmVtb3ZlKCk7XG4gIFx0XHRcdHZhciBjYW52YXMgPSBkMy5zZWxlY3QodGhpcylcbiAgXHRcdFx0ICAuYXBwZW5kKCdjYW52YXMnKVxuICBcdFx0XHQgIC5hdHRyKCdpZCcsIFwibW9uX2NhbnZhc1wiKVxuICBcdFx0XHQgIC5hdHRyKCd3aWR0aCcsIGNhbnZhc193aWR0aClcbiAgXHRcdFx0ICAuYXR0cignaGVpZ2h0JywgY2FudmFzX2hlaWdodCk7XG5cblx0XHQgICAgdmFyIGN0eCA9IChjYW52YXMubm9kZSgpKS5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgIHZhciBldmVudExpbmUgPSByZXF1aXJlKCcuL2V2ZW50TGluZScpKGQzLCBjdHgpO1xuXG5cdFx0XHRmdW5jdGlvbiBkcmF3QWdhaW4oKXtcblx0XHRcdCAgLy8gQ2xlYXIgdGhlIGVudGlyZSBjYW52YXNcblx0XHRcdCAgdmFyIHRvcFggPSAwO1xuXHRcdFx0ICB2YXIgdG9wWSA9IDA7XG5cdFx0XHQgIGN0eC5jbGVhclJlY3QodG9wWCwgdG9wWSwgdG9wWCArIGNhbnZhcy5ub2RlKCkud2lkdGgsIHRvcFkgKyBjYW52YXMubm9kZSgpLmhlaWdodCk7XG5cblx0XHRcdCAgY3R4LmZvbnQgPSBcIjMwcHggQXJpYWxcIjtcblx0XHRcdFx0Y3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG5cdFx0XHRcdGN0eC5maWxsVGV4dChcIlRvdG9cIiw3NTAvMiwzNSk7XG5cdFx0XHRcdGN0eC5maWxsVGV4dChcIlRvdG9cIiw3NTAvMiw3NSk7XG5cdFx0XHRcdGN0eC5maWxsVGV4dChcIlRvdG9cIiw3NTAvMiwxMTUpO1xuXHRcdFx0XHRjdHguZmlsbFRleHQoXCJUb3RvXCIsNzUwLzIsMTU1KTtcblx0XHRcdH1cblx0XHRcdC8vIGRyYXcgdGhlIGNhbnZhcyBmb3IgdGhlIGZpcnN0IHRpbWVcblx0XHRcdGRyYXdBZ2FpbigpO1xuXG4gICAgICBjYW52YXMubm9kZSgpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgLy8gcGVybWl0cyBjb21wYXRpYmlsaXR5IHdpdGggZXZlcnkgYnJvd3NlclxuICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm1velVzZXJTZWxlY3QgPSBkb2N1bWVudC5ib2R5LnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSBkb2N1bWVudC5ib2R5LnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICAgIGxhc3RYID0gZXZ0LmNsaWVudFg7XG4gICAgICAgIGRyYWdTdGFydCA9IHtcbiAgICAgICAgICB4IDogbGFzdFgsXG4gICAgICAgICAgeSA6IGxhc3RZXG4gICAgICAgIH07XG4gICAgICAgIGRyYWdnZWQgPSBmYWxzZTtcbiAgICAgICAgbW91c2VEb3duKys7XG4gICAgICB9LGZhbHNlKTtcblxuICAgICAgY2FudmFzLm5vZGUoKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIGxhc3RYID0gZXZ0LmNsaWVudFg7XG4gICAgICAgIGRyYWdnZWQgPSB0cnVlO1xuICAgICAgICBpZiAoZHJhZ1N0YXJ0ICYmIG1vdXNlRG93bil7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZShsYXN0WC1kcmFnU3RhcnQueCwgbGFzdFktZHJhZ1N0YXJ0LnkpO1xuICAgICAgICAgIGRyYXdBZ2FpbigpO1xuICAgICAgICAgIHJlZHJhdygpO1xuICAgICAgICAgIC8vem9vbS50cmFuc2xhdGUoW2QzLmV2ZW50LnRyYW5zbGF0ZVswXSwgMF0pO1xuICAgICAgICB9XG4gICAgICB9LGZhbHNlKTtcblxuICAgICAgY2FudmFzLm5vZGUoKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICBkcmFnU3RhcnQgPSBudWxsO1xuICAgICAgICBtb3VzZURvd24tLTtcbiAgICAgICAgaWYgKCFkcmFnZ2VkKSB6b29tKGV2dC5zaGlmdEtleSA/IC0xIDogMSApO1xuICAgICAgfSxmYWxzZSk7XG5cblx0XHRcdC8qdmFyIGMgPSBuZXcgY2FudmFzSGFuZGxlcihncmFwaFdpZHRoLCBncmFwaEhlaWdodCk7XG5cbiAgICAgIGMuaW5pdChzZWxlY3Rpb24sIGdyYXBoV2lkdGgsIGdyYXBoSGVpZ2h0KTtcblx0XHRcdGMuZHJhdygpOyovXG5cblx0XHRcdC8qdmFyIGxhc3RYPWNhbnZhcy5ub2RlKCkud2lkdGgvMiwgbGFzdFk9Y2FudmFzLm5vZGUoKS5oZWlnaHQvMjtcblx0XHRcdHZhciBtb3VzZURvd24gPSAwO1xuXHRcdFx0dmFyIGRyYWdnZWQ7XG5cdFx0XHR2YXIgZHJhZ1N0YXJ0ID0ge1xuXHRcdFx0XHR4IDogbGFzdFgsXG5cdFx0XHRcdHkgOiBsYXN0WVxuXHRcdFx0fTtcbmNvbnNvbGUubG9nKCdvaycpOyovXG5cbiAgICAgIC8qdmFyIGNhbnZhcyA9IGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoJ2NhbnZhcycpO1xuXG5cdFx0XHQvLyBldmVudCBcImNsaWNraW5nXCJcblx0XHRcdGNhbnZhcy5ub2RlKCkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgYy5tb3VzZURvd25IYW5kbGVyLGZhbHNlKTtcblxuICAgICAgY2FudmFzLm5vZGUoKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBjLm1vdXNlTW92ZUhhbmRsZXIsZmFsc2UpO1xuXG4gICAgICBjYW52YXMubm9kZSgpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBjLm1vdXNlVXBIYW5kbGVyLGZhbHNlKTtcbiovXG5cdFx0XHQvLyBldmVudCBcIm1vdXNlIG1vdmluZ1wiXG5cdFx0XHQvL2NhbnZhcy5ub2RlKCkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgYy5tb3VzZU1vdmVIYW5kbGVyLGZhbHNlKTtcblxuXHRcdFx0Ly8gZXZlbnQgXCJzdG9wIGNsaWNraW5nXCJcblx0XHRcdC8vY2FudmFzLm5vZGUoKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgYy5tb3VzZVVwSGFuZGxlcixmYWxzZSk7XG5cblx0XHRcdC8qdmFyIHNjYWxlRmFjdG9yID0gMS4xO1xuXHRcdFx0dmFyIHpvb20gPSBmdW5jdGlvbihjbGlja3Mpe1xuXHRcdFx0ICB2YXIgcHQgPSBjdHgudHJhbnNmb3JtZWRQb2ludChsYXN0WCxsYXN0WSk7XG5cdFx0XHQgIGN0eC50cmFuc2xhdGUocHQueCxwdC55KTtcblx0XHRcdCAgdmFyIGZhY3RvciA9IE1hdGgucG93KHNjYWxlRmFjdG9yLGNsaWNrcyk7XG5cdFx0XHQgIGN0eC5zY2FsZShmYWN0b3IsMSk7XG5cdFx0XHQgIGN0eC50cmFuc2xhdGUoLXB0LngsLXB0LnkpO1xuXHRcdFx0ICBkcmF3QWdhaW4oKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGhhbmRsZVNjcm9sbCA9IGZ1bmN0aW9uKGV2dCl7XG5cdFx0XHQgIHZhciBkZWx0YSA9IGV2dC53aGVlbERlbHRhID8gZXZ0LndoZWVsRGVsdGEvNDAgOiBldnQuZGV0YWlsID8gLWV2dC5kZXRhaWwgOiAwO1xuXHRcdFx0ICBpZiAoZGVsdGEpIHpvb20oZGVsdGEpO1xuXHRcdFx0ICByZXR1cm4gZXZ0LnByZXZlbnREZWZhdWx0KCkgJiYgZmFsc2U7XG5cdFx0XHR9O1xuXHRcdFx0Y2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ0RPTU1vdXNlU2Nyb2xsJyxoYW5kbGVTY3JvbGwsZmFsc2UpO1xuXHRcdFx0Y2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLGhhbmRsZVNjcm9sbCxmYWxzZSk7XG5cblx0XHRcdCovXG5cblxuXHRcdFx0ZDMuc2VsZWN0KHRoaXMpLnNlbGVjdCgnc3ZnJykucmVtb3ZlKCk7XG5cblx0XHRcdHZhciBzdmcgPSBkMy5zZWxlY3QodGhpcylcblx0XHRcdCAgLmFwcGVuZCgnc3ZnJylcblx0XHRcdCAgLmF0dHIoJ3dpZHRoJywgY29uZmlnLndpZHRoKVxuXHRcdFx0ICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuXHRcdFx0O1xuXG5cdFx0XHR2YXIgZ3JhcGggPSBzdmcuYXBwZW5kKCdnJylcblx0XHRcdCAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgMjUpJyk7XG5cblx0XHRcdHZhciB5RG9tYWluID0gW107XG5cdFx0XHR2YXIgeVJhbmdlID0gW107XG5cblx0XHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnQsIGluZGV4KSB7XG5cdFx0XHQgIHlEb21haW4ucHVzaChldmVudC5uYW1lKTtcblx0XHRcdCAgeVJhbmdlLnB1c2goaW5kZXggKiA0MCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0eVNjYWxlLmRvbWFpbih5RG9tYWluKS5yYW5nZSh5UmFuZ2UpO1xuXG5cdFx0XHQvLyB0aGlzIHBhcnQgaW4gY29tbWVudHMgdXNlZCB0byBkcmF3IGxpbmVzIGluIHN2ZyBvbiB0aGUgZ3JhcGhcblxuXHRcdFx0Ly8gdHJhbnNsYXRpb24gZGUgNDAgcG91ciBsZXMgbGlnbmVzXG5cblx0XHRcdHZhciB5QXhpc0VsID0gZ3JhcGguYXBwZW5kKCdnJylcblx0XHRcdCAgLmNsYXNzZWQoJ3ktYXhpcycsIHRydWUpXG5cdFx0XHQgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsIDYwKScpO1xuXG5cdFx0XHR2YXIgeVRpY2sgPSB5QXhpc0VsLmFwcGVuZCgnZycpLnNlbGVjdEFsbCgnZycpLmRhdGEoeURvbWFpbik7XG5cblx0XHRcdC8vdmFyIHlUaWNrID0gZ3JhcGguYXBwZW5kKCdnJykuc2VsZWN0QWxsKCdnJykuZGF0YSh5RG9tYWluKTtcblxuXHRcdFx0eVRpY2suZW50ZXIoKVxuXHRcdFx0ICAuYXBwZW5kKCdnJylcblx0XHRcdCAgLmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0cmV0dXJuICd0cmFuc2xhdGUoMCwgJyArIHlTY2FsZShkKSArICcpJztcblx0XHRcdCAgfSlcblx0XHRcdCAgLmFwcGVuZCgnbGluZScpXG5cdFx0XHQgIC5jbGFzc2VkKCd5LXRpY2snLCB0cnVlKVxuXHRcdFx0ICAuYXR0cigneDEnLCBjb25maWcubWFyZ2luLmxlZnQpXG5cdFx0XHQgIC5hdHRyKCd4MicsIGNvbmZpZy5tYXJnaW4ubGVmdCArIGdyYXBoV2lkdGgpO1xuXG5cdFx0XHR5VGljay5leGl0KCkucmVtb3ZlKCk7XG5cblx0XHRcdHZhciBjdXJ4LCBjdXJ5O1xuXHRcdFx0dmFyIHpvb21SZWN0ID0gc3ZnXG5cdFx0XHQgIC5hcHBlbmQoJ3JlY3QnKVxuXHRcdFx0ICAuY2FsbCh6b29tKVxuXHRcdFx0ICAuY2xhc3NlZCgnem9vbScsIHRydWUpXG5cdFx0XHQgIC5hdHRyKCd3aWR0aCcsIGdyYXBoV2lkdGgpXG5cdFx0XHQgIC5hdHRyKCdoZWlnaHQnLCBoZWlnaHQgKVxuXHRcdFx0ICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgY29uZmlnLm1hcmdpbi5sZWZ0ICsgJywgMzUpJylcblx0XHRcdDtcblxuXHRcdFx0aWYgKHR5cGVvZiBjb25maWcuZXZlbnRIb3ZlciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0ICB6b29tUmVjdC5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24oZCwgZSkge1xuXHRcdFx0XHR2YXIgZXZlbnQgPSBkMy5ldmVudDtcblx0XHRcdFx0aWYgKGN1cnggPT0gZXZlbnQuY2xpZW50WCAmJiBjdXJ5ID09IGV2ZW50LmNsaWVudFkpIHJldHVybjtcblx0XHRcdFx0Y3VyeCA9IGV2ZW50LmNsaWVudFg7XG5cdFx0XHRcdGN1cnkgPSBldmVudC5jbGllbnRZO1xuXHRcdFx0XHR6b29tUmVjdC5hdHRyKCdkaXNwbGF5JywgJ25vbmUnKTtcblx0XHRcdFx0dmFyIGVsID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChkMy5ldmVudC5jbGllbnRYLCBkMy5ldmVudC5jbGllbnRZKTtcblx0XHRcdFx0em9vbVJlY3QuYXR0cignZGlzcGxheScsICdibG9jaycpO1xuXHRcdFx0XHRpZiAoZWwudGFnTmFtZSAhPT0gJ2NpcmNsZScpIHJldHVybjtcblx0XHRcdFx0Y29uZmlnLmV2ZW50SG92ZXIoZWwpO1xuXHRcdFx0ICB9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHR5cGVvZiBjb25maWcuZXZlbnRDbGljayA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0ICB6b29tUmVjdC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHpvb21SZWN0LmF0dHIoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXHRcdFx0XHR2YXIgZWwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGQzLmV2ZW50LmNsaWVudFgsIGQzLmV2ZW50LmNsaWVudFkpO1xuXHRcdFx0XHR6b29tUmVjdC5hdHRyKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0XHRcdGlmIChlbC50YWdOYW1lICE9PSAnY2lyY2xlJykgcmV0dXJuO1xuXHRcdFx0XHRjb25maWcuZXZlbnRDbGljayhlbCk7XG5cdFx0XHQgIH0pO1xuXHRcdFx0fVxuXG5cdFx0XHR4U2NhbGUucmFuZ2UoWzAsIGdyYXBoV2lkdGhdKS5kb21haW4oW2NvbmZpZy5zdGFydCwgY29uZmlnLmVuZF0pO1xuXG5cdFx0XHR6b29tLngoeFNjYWxlKTtcblxuXHRcdFx0ZnVuY3Rpb24gdXBkYXRlWm9vbSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coZDMuZXZlbnQuc291cmNlRXZlbnQpO1xuICAgICAgICBpZiAoZDMuZXZlbnQuc291cmNlRXZlbnQudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgTW91c2VFdmVudF0nKSB7XG4gICAgICAgIHpvb20udHJhbnNsYXRlKFtkMy5ldmVudC50cmFuc2xhdGVbMF0sIDBdKTtcbiAgICAgICAgY3R4LnRyYW5zbGF0ZShkMy5ldmVudC50cmFuc2xhdGVbMF0sIDApO1xuXHRcdFx0ICB9XG5cblx0XHRcdCAgaWYgKGQzLmV2ZW50LnNvdXJjZUV2ZW50LnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IFdoZWVsRXZlbnRdJykge1xuXHRcdFx0XHR6b29tLnNjYWxlKGQzLmV2ZW50LnNjYWxlKTtcblx0XHRcdCAgfVxuICAgICAgICBkcmF3QWdhaW4oKTtcblx0XHRcdCAgcmVkcmF3KCk7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIHJlZHJhd0RlbGltaXRlcigpIHtcblx0XHRcdCAgc3ZnLnNlbGVjdCgnLmRlbGltaXRlcicpLnJlbW92ZSgpO1xuXHRcdFx0ICB2YXIgZGVsaW1pdGVyRWwgPSBzdmdcblx0XHRcdFx0LmFwcGVuZCgnZycpXG5cdFx0XHRcdC5jbGFzc2VkKCdkZWxpbWl0ZXInLCB0cnVlKVxuXHRcdFx0XHQuYXR0cignd2lkdGgnLCBncmFwaFdpZHRoKVxuXHRcdFx0XHQuYXR0cignaGVpZ2h0JywgMTApXG5cdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBjb25maWcubWFyZ2luLmxlZnQgKyAnLCAnICsgKGNvbmZpZy5tYXJnaW4udG9wIC0gNDUpICsgJyknKVxuXHRcdFx0XHQuY2FsbChkZWxpbWl0ZXIoe1xuXHRcdFx0XHQgIHhTY2FsZTogeFNjYWxlLFxuXHRcdFx0XHQgIGRhdGVGb3JtYXQ6IGNvbmZpZy5sb2NhbGUgPyBjb25maWcubG9jYWxlLnRpbWVGb3JtYXQoXCIlZCAlQiAlWVwiKSA6IGQzLnRpbWUuZm9ybWF0KFwiJWQgJUIgJVlcIilcblx0XHRcdFx0fSkpXG5cdFx0XHQgIDtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gem9vbUVuZCgpIHtcblx0XHRcdCAgaWYgKGNvbmZpZy5ldmVudFpvb20pIHtcblx0XHRcdFx0Y29uZmlnLmV2ZW50Wm9vbSh4U2NhbGUpO1xuXHRcdFx0ICB9XG5cdFx0XHQgIGlmIChjb25maWcuaGFzRGVsaW1pdGVyKSB7XG5cdFx0XHRcdHJlZHJhd0RlbGltaXRlcigpO1xuXHRcdFx0ICB9XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIGRyYXdYQXhpcyh3aGVyZSkge1xuXG5cdFx0XHQgIC8vIGNvcHkgY29uZmlnLnRpY2tGb3JtYXQgYmVjYXVzZSBkMyBmb3JtYXQubXVsdGkgZWRpdCBpdHMgZ2l2ZW4gdGlja0Zvcm1hdCBkYXRhXG5cdFx0XHQgIHZhciB0aWNrRm9ybWF0RGF0YSA9IFtdO1xuXG5cdFx0XHQgIGNvbmZpZy50aWNrRm9ybWF0LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0dmFyIHRpY2sgPSBpdGVtLnNsaWNlKDApO1xuXHRcdFx0XHR0aWNrRm9ybWF0RGF0YS5wdXNoKHRpY2spO1xuXHRcdFx0ICB9KTtcblxuXHRcdFx0ICB2YXIgdGlja0Zvcm1hdCA9IGNvbmZpZy5sb2NhbGUgPyBjb25maWcubG9jYWxlLnRpbWVGb3JtYXQubXVsdGkodGlja0Zvcm1hdERhdGEpIDogZDMudGltZS5mb3JtYXQubXVsdGkodGlja0Zvcm1hdERhdGEpO1xuXHRcdFx0ICB2YXIgeEF4aXMgPSBkMy5zdmcuYXhpcygpXG5cdFx0XHRcdC5zY2FsZSh4U2NhbGUpXG5cdFx0XHRcdC5vcmllbnQod2hlcmUpXG5cdFx0XHRcdC50aWNrRm9ybWF0KHRpY2tGb3JtYXQpXG5cdFx0XHQgIDtcblxuXHRcdFx0ICBpZiAodHlwZW9mIGNvbmZpZy5heGlzRm9ybWF0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGNvbmZpZy5heGlzRm9ybWF0KHhBeGlzKTtcblx0XHRcdCAgfVxuXG5cdFx0XHQgIHZhciB5ID0gKHdoZXJlID09ICdib3R0b20nID8gcGFyc2VJbnQoZ3JhcGhIZWlnaHQpIDogMCkgKyBjb25maWcubWFyZ2luLnRvcCAtIDQwO1xuXG5cdFx0XHQgIGdyYXBoLnNlbGVjdCgnLngtYXhpcy4nICsgd2hlcmUpLnJlbW92ZSgpO1xuXHRcdFx0ICB2YXIgeEF4aXNFbCA9IGdyYXBoXG5cdFx0XHRcdC5hcHBlbmQoJ2cnKVxuXHRcdFx0XHQuY2xhc3NlZCgneC1heGlzJywgdHJ1ZSlcblx0XHRcdFx0LmNsYXNzZWQod2hlcmUsIHRydWUpXG5cdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBjb25maWcubWFyZ2luLmxlZnQgKyAnLCAnICsgeSArICcpJylcblx0XHRcdFx0LmNhbGwoeEF4aXMpXG5cdFx0XHQgIDtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gcmVkcmF3KCkge1xuXG5cdFx0XHQgIHZhciBoYXNUb3BBeGlzID0gdHlwZW9mIGNvbmZpZy5oYXNUb3BBeGlzID09PSAnZnVuY3Rpb24nID8gY29uZmlnLmhhc1RvcEF4aXMoZGF0YSkgOiBjb25maWcuaGFzVG9wQXhpcztcblx0XHRcdCAgaWYgKGhhc1RvcEF4aXMpIHtcblx0XHRcdFx0ZHJhd1hBeGlzKCd0b3AnKTtcblx0XHRcdCAgfVxuXG5cdFx0XHQgIHZhciBoYXNCb3R0b21BeGlzID0gdHlwZW9mIGNvbmZpZy5oYXNCb3R0b21BeGlzID09PSAnZnVuY3Rpb24nID8gY29uZmlnLmhhc0JvdHRvbUF4aXMoZGF0YSkgOiBjb25maWcuaGFzQm90dG9tQXhpcztcblx0XHRcdCAgaWYgKGhhc0JvdHRvbUF4aXMpIHtcblx0XHRcdFx0ZHJhd1hBeGlzKCdib3R0b20nKTtcblx0XHRcdCAgfVxuXG5cdFx0XHQgIHpvb20uc2l6ZShbY29uZmlnLndpZHRoLCBoZWlnaHRdKTtcblxuXHRcdFx0ICBncmFwaC5zZWxlY3QoJy5ncmFwaC1ib2R5JykucmVtb3ZlKCk7XG5cdFx0XHQgIHZhciBncmFwaEJvZHkgPSBncmFwaFxuXHRcdFx0XHQuYXBwZW5kKCdnJylcblx0XHRcdFx0LmNsYXNzZWQoJ2dyYXBoLWJvZHknLCB0cnVlKVxuXHRcdFx0XHQuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgY29uZmlnLm1hcmdpbi5sZWZ0ICsgJywgJyArIChjb25maWcubWFyZ2luLnRvcCAtIDE1KSArICcpJyk7XG5cblx0XHRcdCAgdmFyIGxpbmVzID0gZ3JhcGhCb2R5LnNlbGVjdEFsbCgnZycpLmRhdGEoZGF0YSk7XG5cblx0XHRcdCAgbGluZXMuZW50ZXIoKVxuXHRcdFx0XHQuYXBwZW5kKCdnJylcblx0XHRcdFx0LmNsYXNzZWQoJ2xpbmUnLCB0cnVlKVxuXHRcdFx0XHQuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHQgIHJldHVybiAndHJhbnNsYXRlKDAsJyArIHlTY2FsZShkLm5hbWUpICsgJyknO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuc3R5bGUoJ2ZpbGwnLCBjb25maWcuZXZlbnRMaW5lQ29sb3IpXG5cdFx0XHRcdC5jYWxsKGV2ZW50TGluZSh7IHhTY2FsZTogeFNjYWxlLCBldmVudENvbG9yOiBjb25maWcuZXZlbnRDb2xvciB9KSlcblx0XHRcdCAgO1xuXG5cdFx0XHQgIGxpbmVzLmV4aXQoKS5yZW1vdmUoKTtcblx0XHRcdH1cblxuXHRcdFx0cmVkcmF3KCk7XG5cdFx0XHRpZiAoY29uZmlnLmhhc0RlbGltaXRlcikge1xuXHRcdFx0ICByZWRyYXdEZWxpbWl0ZXIoKTtcblx0XHRcdH1cblx0XHRcdGlmIChjb25maWcuZXZlbnRab29tKSB7XG5cdFx0XHQgIGNvbmZpZy5ldmVudFpvb20oeFNjYWxlKTtcblx0XHRcdH1cblx0XHQgIH0pO1xuXHRcdH1cblxuXHRcdGNvbmZpZ3VyYWJsZShldmVudERyb3BHcmFwaCwgY29uZmlnKTtcblxuXHRcdHJldHVybiBldmVudERyb3BHcmFwaDtcbiAgfTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qIGdsb2JhbCByZXF1aXJlLCBtb2R1bGUsIGQzICovXG5cbnZhciBjb25maWd1cmFibGUgPSByZXF1aXJlKCcuL3V0aWwvY29uZmlndXJhYmxlJyk7XG52YXIgZmlsdGVyRGF0YSA9IHJlcXVpcmUoJy4vZmlsdGVyRGF0YScpO1xuXG52YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgeFNjYWxlOiBudWxsXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkMywgY3R4KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoY29uZmlnKSB7XG5cbiAgICBjb25maWcgPSBjb25maWcgfHwge1xuICAgICAgeFNjYWxlOiBudWxsLFxuICAgICAgZXZlbnRDb2xvcjogbnVsbFxuICAgIH07XG4gICAgZm9yICh2YXIga2V5IGluIGRlZmF1bHRDb25maWcpIHtcbiAgICAgIGNvbmZpZ1trZXldID0gY29uZmlnW2tleV0gfHwgZGVmYXVsdENvbmZpZ1trZXldO1xuICAgIH1cblxuICAgIHZhciBldmVudExpbmUgPSBmdW5jdGlvbiBldmVudExpbmUoc2VsZWN0aW9uKSB7XG4gICAgICBzZWxlY3Rpb24uZWFjaChmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBkMy5zZWxlY3QodGhpcykuc2VsZWN0QWxsKCd0ZXh0JykucmVtb3ZlKCk7XG5cbiAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLnRleHQoZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgdmFyIGNvdW50ID0gZmlsdGVyRGF0YShkLmRhdGVzLCBjb25maWcueFNjYWxlKS5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4gZC5uYW1lICsgKGNvdW50ID4gMCA/ICcgKCcgKyBjb3VudCArICcpJyA6ICcnKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdlbmQnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKC0yMCknKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsICdibGFjaycpXG4gICAgICAgIDtcblxuICAgICAgICAvL2QzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoJ2NpcmNsZScpLnJlbW92ZSgpO1xuXG4gICAgICAgIC8qdmFyIGNpcmNsZSA9IGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoJ2NpcmNsZScpXG4gICAgICAgICAgLmRhdGEoZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgLy8gZmlsdGVyIHZhbHVlIG91dHNpZGUgb2YgcmFuZ2VcbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJEYXRhKGQuZGF0ZXMsIGNvbmZpZy54U2NhbGUpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIGNpcmNsZS5lbnRlcigpXG4gICAgICAgICAgLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgICAuYXR0cignY3gnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlnLnhTY2FsZShkKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIGNvbmZpZy5ldmVudENvbG9yKVxuICAgICAgICAgIC5hdHRyKCdjeScsIC01KVxuICAgICAgICAgIC5hdHRyKCdyJywgMTApXG4gICAgICAgIDtcblxuICAgICAgICBjaXJjbGUuZXhpdCgpLnJlbW92ZSgpOyovXG5cbiAgICAgICAgdmFyIGRhdGEgPSBkMy5zZWxlY3QodGhpcykuc2VsZWN0QWxsKCdjYW52YXMnKVxuICAgICAgICAgIC5kYXRhKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJEYXRhKGQuZGF0ZXMsIGNvbmZpZy54U2NhbGUpO1xuICAgICAgICAgIH0pO1xuLypcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHguYXJjKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiAxMDA7XG4gICAgICAgIH0sIDM1MC8yLCAxMCwgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gY29uZmlnLmV2ZW50Q29sb3I7XG4gICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcblxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5hcmMoNzUwLzIsIDM1MC8yLCAxMCwgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgICBjdHguZmlsbFN0eWxlPVwicmVkXCI7XG4gICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTsqL1xuXG4gICAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgIGN0eC5hcmMoZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy54U2NhbGUoZCk7XG4gICAgICAgICAgfSwgMzUwLzIsIDEwLCAwLCAyICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbmZpZy5ldmVudENvbG9yO1xuICAgICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICB9KTtcblxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbmZpZ3VyYWJsZShldmVudExpbmUsIGNvbmZpZyk7XG5cbiAgICByZXR1cm4gZXZlbnRMaW5lO1xuICB9O1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLyogZ2xvYmFsIG1vZHVsZSAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZpbHRlckRhdGUoZGF0YSwgc2NhbGUpIHtcbiAgZGF0YSA9IGRhdGEgfHwgW107XG4gIHZhciBmaWx0ZXJlZERhdGEgPSBbXTtcbiAgdmFyIGJvdW5kYXJ5ID0gc2NhbGUucmFuZ2UoKTtcbiAgdmFyIG1pbiA9IGJvdW5kYXJ5WzBdO1xuICB2YXIgbWF4ID0gYm91bmRhcnlbMV07XG4gIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoZGF0dW0pIHtcbiAgICB2YXIgdmFsdWUgPSBzY2FsZShkYXR1bSk7XG4gICAgaWYgKHZhbHVlIDwgbWluIHx8IHZhbHVlID4gbWF4KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZpbHRlcmVkRGF0YS5wdXNoKGRhdHVtKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGZpbHRlcmVkRGF0YTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qIGdsb2JhbCByZXF1aXJlLCBkZWZpbmUsIG1vZHVsZSAqL1xuXG52YXIgZXZlbnREcm9wcyA9IHJlcXVpcmUoJy4vZXZlbnREcm9wcycpO1xuXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgZGVmaW5lKCdkMy5jaGFydC5ldmVudERyb3BzJywgW1wiZDNcIl0sIGZ1bmN0aW9uIChkMykge1xuICAgIGQzLmNoYXJ0ID0gZDMuY2hhcnQgfHwge307XG4gICAgZDMuY2hhcnQuZXZlbnREcm9wcyA9IGV2ZW50RHJvcHMoZDMsIGRvY3VtZW50KTtcbiAgfSk7XG59IGVsc2UgaWYgKHdpbmRvdykge1xuICB3aW5kb3cuZDMuY2hhcnQgPSB3aW5kb3cuZDMuY2hhcnQgfHwge307XG4gIHdpbmRvdy5kMy5jaGFydC5ldmVudERyb3BzID0gZXZlbnREcm9wcyh3aW5kb3cuZDMsIGRvY3VtZW50KTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gZXZlbnREcm9wcztcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29uZmlndXJhYmxlKHRhcmdldEZ1bmN0aW9uLCBjb25maWcsIGxpc3RlbmVycykge1xuICBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMgfHwge307XG4gIGZvciAodmFyIGl0ZW0gaW4gY29uZmlnKSB7XG4gICAgKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHRhcmdldEZ1bmN0aW9uW2l0ZW1dID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY29uZmlnW2l0ZW1dO1xuICAgICAgICBjb25maWdbaXRlbV0gPSB2YWx1ZTtcbiAgICAgICAgaWYgKGxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShpdGVtKSkge1xuICAgICAgICAgIGxpc3RlbmVyc1tpdGVtXSh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFyZ2V0RnVuY3Rpb247XG4gICAgICB9O1xuICAgIH0pKGl0ZW0pOyAvLyBmb3IgZG9lc24ndCBjcmVhdGUgYSBjbG9zdXJlLCBmb3JjaW5nIGl0XG4gIH1cbn07XG4iXX0=
