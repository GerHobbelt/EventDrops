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
        zoom.on("zoomstart", zoomStart);

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

      var coorX_start;

      var coorX_end;

      function zoomStart() {
        if (d3.event.sourceEvent.toString() === '[object MouseEvent]') {
          //console.log(d3.mouse(this)[0]);
          coorX_start = d3.mouse(this)[0];
        }
      }

			function updateZoom() {
        //console.log(d3.event.sourceEvent);
        if (d3.event.sourceEvent.toString() === '[object MouseEvent]') {
          zoom.translate([d3.event.translate[0], 0]);
          //ctx.translate(d3.event.translate[0], 0);
			  }

			  if (d3.event.sourceEvent.toString() === '[object WheelEvent]') {
				  zoom.scale(d3.event.scale);
			  }
        //drawAgain();
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
        if (d3.event.sourceEvent.toString() === '[object MouseEvent]') {
          coorX_end = d3.mouse(this)[0];
          ctx.translate(coorX_end - coorX_start, 0);
          drawAgain();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9tZWxvZGllL0J1cmVhdS9FdmVudERyb3BzL2xpYi9jYW52YXNIYW5kbGVyLmpzIiwiL2hvbWUvbWVsb2RpZS9CdXJlYXUvRXZlbnREcm9wcy9saWIvZGVsaW1pdGVyLmpzIiwiL2hvbWUvbWVsb2RpZS9CdXJlYXUvRXZlbnREcm9wcy9saWIvZXZlbnREcm9wcy5qcyIsIi9ob21lL21lbG9kaWUvQnVyZWF1L0V2ZW50RHJvcHMvbGliL2V2ZW50TGluZS5qcyIsIi9ob21lL21lbG9kaWUvQnVyZWF1L0V2ZW50RHJvcHMvbGliL2ZpbHRlckRhdGEuanMiLCIvaG9tZS9tZWxvZGllL0J1cmVhdS9FdmVudERyb3BzL2xpYi9tYWluLmpzIiwiL2hvbWUvbWVsb2RpZS9CdXJlYXUvRXZlbnREcm9wcy9saWIvdXRpbC9jb25maWd1cmFibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuLyogZ2xvYmFsIHJlcXVpcmUsIG1vZHVsZSAqL1xuXG52YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgeFNjYWxlOiBudWxsXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkMywgZG9jdW1lbnQsIGNvbmZpZykge1xuICByZXR1cm4gZnVuY3Rpb24gKGNvbmZpZykge1xuXG4gICAgY29uZmlnID0gY29uZmlnIHx8IHtcbiAgICAgIHhTY2FsZTogbnVsbCxcbiAgICAgIGV2ZW50Q29sb3I6IG51bGxcbiAgICB9O1xuICAgIGZvciAodmFyIGtleSBpbiBkZWZhdWx0Q29uZmlnKSB7XG4gICAgIGNvbmZpZ1trZXldID0gY29uZmlnW2tleV0gfHwgZGVmYXVsdENvbmZpZ1trZXldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbnZhc0hhbmRsZXIoeCwgeSkge1xuICAgICAgdGhpcy5ncmFwaFdpZHRoID0geDtcbiAgICAgIHRoaXMuZ3JhcGhIZWlnaHQgPSB5O1xuICAgICAgdGhpcy5sYXN0WCA9IGdyYXBoV2lkdGgvMjtcbiAgICAgIHRoaXMubGFzdFkgPSBncmFwaEhlaWdodC8yO1xuICAgICAgdGhpcy5tb3VzZURvd24gPSAwO1xuICAgICAgdGhpcy5jdHggPSBudWxsO1xuICAgICAgdGhpcy5jYW52YXMgPSBudWxsO1xuICAgIH1cblxuICAgIC8qdmFyIGdyYXBoSGVpZ2h0LCBncmFwaFdpZHRoO1xuICAgIHZhciBsYXN0WCwgbGFzdFk7XG4gICAgdmFyIGN0eDtcbiAgICB2YXIgbW91c2VEb3duID0gMDtcbiAgICB2YXIgZHJhZ1N0YXJ0LCBkcmFnZ2VkOyovXG5cbiAgICAvKnZhciBjYW52YXNIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGdyYXBoV2lkdGggPSBjb25maWcud2lkdGggLSBjb25maWcubWFyZ2luLnJpZ2h0IC0gY29uZmlnLm1hcmdpbi5sZWZ0O1xuICAgICAgYWxlcnQoZ3JhcGhXaWR0aCk7XG4gICAgICB2YXIgZ3JhcGhIZWlnaHQgPSBkYXRhLmxlbmd0aCAqIDQwO1xuICAgICAgYWxlcnQoZ3JhcGhIZWlnaHQpO1xuICAgICAgdmFyIGN0eCA9IChjYW52YXMubm9kZSgpKS5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgdmFyIG1vdXNlRG93biA9IDA7XG4gICAgICB2YXIgbGFzdFggPSBncmFwaFdpZHRoLzI7XG4gICAgICB2YXIgbGFzdFkgPSBncmFwaEhlaWdodC8yO1xuICAgIH0qL1xuXG4gICAgICB0aGlzLmluaXQgPSBmdW5jdGlvbiAoc2VsZWN0aW9uLCB4LCB5KSB7XG4gICAgICAgIC8qdGhpcy5ncmFwaFdpZHRoID0geDtcbiAgICAgICAgdGhpcy5ncmFwaEhlaWdodCA9IHk7XG4gICAgICAgIHRoaXMubW91c2VEb3duID0gMDtcbiAgICAgICAgdGhpcy5sYXN0WCA9IHgvMjtcbiAgICAgICAgdGhpcy5sYXN0WSA9IHkvMjsqL1xuXG4gICAgICAgIHNlbGVjdGlvbi5lYWNoKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnNlbGVjdCgnY2FudmFzJykucmVtb3ZlKCk7XG4gICAgICAgICAgdmFyIGNhbnZhcyA9IGQzLnNlbGVjdCh0aGlzKVxuICAgICAgICAgICAgLmFwcGVuZCgnY2FudmFzJylcbiAgICAgICAgICAgIC5hdHRyKCdpZCcsIFwibW9uX2NhbnZhc1wiKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy5ncmFwaFdpZHRoKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuZ3JhcGhIZWlnaHQpXG4gICAgICAgICAgICA7XG4gICAgICAgICAgdGhpcy5jdHggPSBjYW52YXMubm9kZSgpLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbigpe1xuICAgICAgICAvLyBDbGVhciB0aGUgZW50aXJlIGNhbnZhc1xuICAgICAgICB2YXIgdG9wWCA9IDA7XG4gICAgICAgIHZhciB0b3BZID0gMDtcbiAgICAgICAgLy9hbGVydChncmFwaFdpZHRoKTtcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KHRvcFgsIHRvcFksIHRvcFggKyBncmFwaFdpZHRoLCB0b3BZICsgZ3JhcGhIZWlnaHQpO1xuXG4gICAgICAgIGN0eC5mb250ID0gXCIzMHB4IEFyaWFsXCI7XG4gICAgICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuICAgICAgICBjdHguZmlsbFRleHQoXCJUb3RvXCIsNzUwLzIsMzUpO1xuICAgICAgICBjdHguZmlsbFRleHQoXCJUb3RvXCIsNzUwLzIsNzUpO1xuICAgICAgICBjdHguZmlsbFRleHQoXCJUb3RvXCIsNzUwLzIsMTE1KTtcbiAgICAgICAgY3R4LmZpbGxUZXh0KFwiVG90b1wiLDc1MC8yLDE1NSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZHJhd0NpcmNsZSA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoPVwiMlwiO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZT1cIiNGRjQ0MjJcIjtcbiAgICAgICAgY29udGV4dC5hcmMoeCwgeSwgOTAsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubW91c2VEb3duSGFuZGxlciA9IGZ1bmN0aW9uKGV2dCl7XG4gICAgICAgIC8vIHBlcm1pdHMgY29tcGF0aWJpbGl0eSB3aXRoIGV2ZXJ5IGJyb3dzZXJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5tb3pVc2VyU2VsZWN0ID0gZG9jdW1lbnQuYm9keS5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gZG9jdW1lbnQuYm9keS5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgICAvL2xhc3RYID0gZXZ0Lm9mZnNldFggfHwgKGV2dC5wYWdlWCAtIGNhbnZhcy5ub2RlKCkub2Zmc2V0TGVmdCk7XG4gICAgICAgIGxhc3RYID0gZXZ0LmNsaWVudFg7XG4gICAgICAgIC8vbGFzdFkgPSBncmFwaEhlaWdodC8yO1xuICAgICAgICAvL2FsZXJ0KGxhc3RYKTtcbiAgICAgICAgdmFyIGRyYWdTdGFydCA9IHtcbiAgICAgICAgICB4IDogbGFzdFgsXG4gICAgICAgICAgeSA6IGxhc3RZXG4gICAgICAgIH07XG4gICAgICAgIHZhciBkcmFnZ2VkID0gZmFsc2U7XG4gICAgICAgIG1vdXNlRG93bisrO1xuXG4gICAgICAgIC8vY2FudmFzLm5vZGUoKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBjLm1vdXNlTW92ZUhhbmRsZXIsZmFsc2UpO1xuICAgICAgICAvL2NhbnZhcy5ub2RlKCkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGMubW91c2VVcEhhbmRsZXIsZmFsc2UpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm1vdXNlTW92ZUhhbmRsZXIgPSBmdW5jdGlvbihldnQpe1xuICAgICAgICAvL2xhc3RYID0gZXZ0Lm9mZnNldFggfHwgKGV2dC5wYWdlWCAtIGNhbnZhcy5ub2RlKCkub2Zmc2V0TGVmdCk7XG4gICAgICAgIGxhc3RYID0gZXZ0LmNsaWVudFg7XG4gICAgICAgIGRyYWdnZWQgPSB0cnVlO1xuICAgICAgICBpZiAoZHJhZ1N0YXJ0ICYmIG1vdXNlRG93bil7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZShsYXN0WC1kcmFnU3RhcnQueCwgbGFzdFktZHJhZ1N0YXJ0LnkpO1xuICAgICAgICAgIC8vY3R4LnRyYW5zbGF0ZShbZDMuZXZlbnQudHJhbnNsYXRlWzBdLCAwXSk7XG4gICAgICAgICAgZHJhd0FnYWluKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5tb3VzZVVwSGFuZGxlciA9IGZ1bmN0aW9uKGV2dCl7XG4gICAgICAgIC8vY2FudmFzLm5vZGUoKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBjLm1vdXNlTW92ZUhhbmRsZXIsZmFsc2UpO1xuICAgICAgICAvL2NhbnZhcy5ub2RlKCkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgYy5tb3VzZURvd25IYW5kbGVyLGZhbHNlKTtcblxuICAgICAgICBkcmFnU3RhcnQgPSBudWxsO1xuICAgICAgICBtb3VzZURvd24tLTtcbiAgICAgICAgaWYgKCFkcmFnZ2VkKSB6b29tKGV2dC5zaGlmdEtleSA/IC0xIDogMSApO1xuICAgICAgfVxuICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qIGdsb2JhbCByZXF1aXJlLCBtb2R1bGUsIGQzICovXG5cbnZhciBjb25maWd1cmFibGUgPSByZXF1aXJlKCcuL3V0aWwvY29uZmlndXJhYmxlJyk7XG5cbnZhciBkZWZhdWx0Q29uZmlnID0ge1xuICB4U2NhbGU6IG51bGwsXG4gIGRhdGVGb3JtYXQ6IG51bGxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGQzKSB7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChjb25maWcpIHtcblxuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgICBmb3IgKHZhciBrZXkgaW4gZGVmYXVsdENvbmZpZykge1xuICAgICAgY29uZmlnW2tleV0gPSBjb25maWdba2V5XSB8fCBkZWZhdWx0Q29uZmlnW2tleV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVsaW1pdGVyKHNlbGVjdGlvbikge1xuICAgICAgc2VsZWN0aW9uLmVhY2goZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnNlbGVjdEFsbCgndGV4dCcpLnJlbW92ZSgpO1xuXG4gICAgICAgIHZhciBsaW1pdHMgPSBjb25maWcueFNjYWxlLmRvbWFpbigpO1xuXG4gICAgICAgIGQzLnNlbGVjdCh0aGlzKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy5kYXRlRm9ybWF0KGxpbWl0c1swXSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2xhc3NlZCgnc3RhcnQnLCB0cnVlKVxuICAgICAgICA7XG5cbiAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLnRleHQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICByZXR1cm4gY29uZmlnLmRhdGVGb3JtYXQobGltaXRzWzFdKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdlbmQnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBjb25maWcueFNjYWxlLnJhbmdlKClbMV0gKyAnKScpXG4gICAgICAgICAgLmNsYXNzZWQoJ2VuZCcsIHRydWUpXG4gICAgICAgIDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbmZpZ3VyYWJsZShkZWxpbWl0ZXIsIGNvbmZpZyk7XG5cbiAgICByZXR1cm4gZGVsaW1pdGVyO1xuICB9O1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLyogZ2xvYmFsIHJlcXVpcmUsIG1vZHVsZSAqL1xuXG52YXIgY29uZmlndXJhYmxlID0gcmVxdWlyZSgnLi91dGlsL2NvbmZpZ3VyYWJsZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkMywgZG9jdW1lbnQpIHtcbiAgLy92YXIgZXZlbnRMaW5lID0gcmVxdWlyZSgnLi9ldmVudExpbmUnKShkMyk7XG4gIHZhciBkZWxpbWl0ZXIgPSByZXF1aXJlKCcuL2RlbGltaXRlcicpKGQzKTtcbiAgdmFyIGNhbnZhc0hhbmRsZXIgPSByZXF1aXJlKCcuL2NhbnZhc0hhbmRsZXInKShkMywgZG9jdW1lbnQpO1xuXG4gIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuXHRcdHN0YXJ0OiBuZXcgRGF0ZSgwKSxcblx0XHRlbmQ6IG5ldyBEYXRlKCksXG5cdFx0bWluU2NhbGU6IDAsXG5cdFx0bWF4U2NhbGU6IEluZmluaXR5LFxuXHRcdHdpZHRoOiAxMDAwLFxuXHRcdG1hcmdpbjoge1xuXHRcdCAgdG9wOiA2MCxcblx0XHQgIGxlZnQ6IDIwMCxcblx0XHQgIGJvdHRvbTogNDAsXG5cdFx0ICByaWdodDogNTBcblx0XHR9LFxuXHRcdGxvY2FsZTogbnVsbCxcblx0XHRheGlzRm9ybWF0OiBudWxsLFxuXHRcdHRpY2tGb3JtYXQ6IFtcblx0XHRcdFtcIi4lTFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmdldE1pbGxpc2Vjb25kcygpOyB9XSxcblx0XHRcdFtcIjolU1wiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmdldFNlY29uZHMoKTsgfV0sXG5cdFx0XHRbXCIlSTolTVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmdldE1pbnV0ZXMoKTsgfV0sXG5cdFx0XHRbXCIlSSAlcFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmdldEhvdXJzKCk7IH1dLFxuXHRcdFx0W1wiJWEgJWRcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5nZXREYXkoKSAmJiBkLmdldERhdGUoKSAhPSAxOyB9XSxcblx0XHRcdFtcIiViICVkXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZ2V0RGF0ZSgpICE9IDE7IH1dLFxuXHRcdFx0W1wiJUJcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5nZXRNb250aCgpOyB9XSxcblx0XHRcdFtcIiVZXCIsIGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZTsgfV1cblx0XHRdLFxuXHRcdGV2ZW50SG92ZXI6IG51bGwsXG5cdFx0ZXZlbnRab29tOiBudWxsLFxuXHRcdGV2ZW50Q2xpY2s6IG51bGwsXG5cdFx0aGFzRGVsaW1pdGVyOiB0cnVlLFxuXHRcdGhhc1RvcEF4aXM6IHRydWUsXG5cdFx0aGFzQm90dG9tQXhpczogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHQgIHJldHVybiBkYXRhLmxlbmd0aCA+PSAxMDtcblx0XHR9LFxuXHRcdGV2ZW50TGluZUNvbG9yOiAnYmxhY2snLFxuXHRcdGV2ZW50Q29sb3I6IG51bGxcbiAgfTtcblxuICByZXR1cm4gZnVuY3Rpb24gZXZlbnREcm9wcyhjb25maWcpIHtcblx0XHR2YXIgeFNjYWxlID0gZDMudGltZS5zY2FsZSgpO1xuXHRcdHZhciB5U2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKCk7XG5cdFx0Y29uZmlnID0gY29uZmlnIHx8IHt9O1xuXHRcdGZvciAodmFyIGtleSBpbiBkZWZhdWx0Q29uZmlnKSB7XG5cdFx0ICBjb25maWdba2V5XSA9IGNvbmZpZ1trZXldIHx8IGRlZmF1bHRDb25maWdba2V5XTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBldmVudERyb3BHcmFwaChzZWxlY3Rpb24pIHtcblx0XHQgIHNlbGVjdGlvbi5lYWNoKGZ1bmN0aW9uIChkYXRhKSB7XG5cblx0XHQgIFx0d2luZG93LnJlcXVlc3RBbmltRnJhbWUgPSAoZnVuY3Rpb24oKXtcblx0XHQgICAgICByZXR1cm4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgICAgfHxcblx0XHQgICAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcblx0XHQgICAgICAgICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgfHxcblx0XHQgICAgICAgICAgICAgIHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICAgfHxcblx0XHQgICAgICAgICAgICAgIHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgfHxcblx0XHQgICAgICAgICAgICAgIGZ1bmN0aW9uKC8qIGZ1bmN0aW9uICovIGNhbGxiYWNrLCAvKiBET01FbGVtZW50ICovIGVsZW1lbnQpIHtcblx0XHQgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XG5cdFx0ICAgICAgICAgICAgICB9O1xuXHQgICAgXHR9KSgpO1xuXG5cdFx0XHRcdHZhciB6b29tID0gZDMuYmVoYXZpb3Iuem9vbSgpLmNlbnRlcihudWxsKS5zY2FsZUV4dGVudChbY29uZmlnLm1pblNjYWxlLCBjb25maWcubWF4U2NhbGVdKS5vbihcInpvb21cIiwgdXBkYXRlWm9vbSk7XG5cblx0XHRcdFx0em9vbS5vbihcInpvb21lbmRcIiwgem9vbUVuZCk7XG4gICAgICAgIHpvb20ub24oXCJ6b29tc3RhcnRcIiwgem9vbVN0YXJ0KTtcblxuXHRcdFx0XHR2YXIgZ3JhcGhXaWR0aCA9IGNvbmZpZy53aWR0aCAtIGNvbmZpZy5tYXJnaW4ucmlnaHQgLSBjb25maWcubWFyZ2luLmxlZnQ7XG5cdFx0XHRcdHZhciBncmFwaEhlaWdodCA9IGRhdGEubGVuZ3RoICogNDA7XG5cdFx0XHRcdHZhciBoZWlnaHQgPSBncmFwaEhlaWdodCArIGNvbmZpZy5tYXJnaW4udG9wICsgY29uZmlnLm1hcmdpbi5ib3R0b207XG5cblx0XHRcdFx0dmFyIGNhbnZhc193aWR0aCA9ICBncmFwaFdpZHRoO1xuXHRcdFx0XHR2YXIgY2FudmFzX2hlaWdodCA9IGdyYXBoSGVpZ2h0O1xuXG4gICAgICAgIHZhciBsYXN0WCA9IGdyYXBoV2lkdGgvMjtcbiAgICAgICAgdmFyIGxhc3RZID0gZ3JhcGhIZWlnaHQvMjtcbiAgICAgICAgdmFyIGRyYWdnZWQsIGRyYWdTdGFydDtcbiAgICAgICAgdmFyIG1vdXNlRG93biA9IDA7XG5cblx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpLnNlbGVjdCgnY2FudmFzJykucmVtb3ZlKCk7XG4gIFx0XHRcdHZhciBjYW52YXMgPSBkMy5zZWxlY3QodGhpcylcbiAgXHRcdFx0ICAuYXBwZW5kKCdjYW52YXMnKVxuICBcdFx0XHQgIC5hdHRyKCdpZCcsIFwibW9uX2NhbnZhc1wiKVxuICBcdFx0XHQgIC5hdHRyKCd3aWR0aCcsIGNhbnZhc193aWR0aClcbiAgXHRcdFx0ICAuYXR0cignaGVpZ2h0JywgY2FudmFzX2hlaWdodCk7XG5cblx0XHQgICAgdmFyIGN0eCA9IChjYW52YXMubm9kZSgpKS5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgIHZhciBldmVudExpbmUgPSByZXF1aXJlKCcuL2V2ZW50TGluZScpKGQzLCBjdHgpO1xuXG5cdFx0XHRmdW5jdGlvbiBkcmF3QWdhaW4oKXtcblx0XHRcdCAgLy8gQ2xlYXIgdGhlIGVudGlyZSBjYW52YXNcblx0XHRcdCAgdmFyIHRvcFggPSAwO1xuXHRcdFx0ICB2YXIgdG9wWSA9IDA7XG5cdFx0XHQgIGN0eC5jbGVhclJlY3QodG9wWCwgdG9wWSwgdG9wWCArIGNhbnZhcy5ub2RlKCkud2lkdGgsIHRvcFkgKyBjYW52YXMubm9kZSgpLmhlaWdodCk7XG5cblx0XHRcdCAgY3R4LmZvbnQgPSBcIjMwcHggQXJpYWxcIjtcblx0XHRcdFx0Y3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG5cdFx0XHRcdGN0eC5maWxsVGV4dChcIlRvdG9cIiw3NTAvMiwzNSk7XG5cdFx0XHRcdGN0eC5maWxsVGV4dChcIlRvdG9cIiw3NTAvMiw3NSk7XG5cdFx0XHRcdGN0eC5maWxsVGV4dChcIlRvdG9cIiw3NTAvMiwxMTUpO1xuXHRcdFx0XHRjdHguZmlsbFRleHQoXCJUb3RvXCIsNzUwLzIsMTU1KTtcblx0XHRcdH1cblx0XHRcdC8vIGRyYXcgdGhlIGNhbnZhcyBmb3IgdGhlIGZpcnN0IHRpbWVcblx0XHRcdGRyYXdBZ2FpbigpO1xuXG4gICAgICBjYW52YXMubm9kZSgpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgLy8gcGVybWl0cyBjb21wYXRpYmlsaXR5IHdpdGggZXZlcnkgYnJvd3NlclxuICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm1velVzZXJTZWxlY3QgPSBkb2N1bWVudC5ib2R5LnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSBkb2N1bWVudC5ib2R5LnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICAgIGxhc3RYID0gZXZ0LmNsaWVudFg7XG4gICAgICAgIGRyYWdTdGFydCA9IHtcbiAgICAgICAgICB4IDogbGFzdFgsXG4gICAgICAgICAgeSA6IGxhc3RZXG4gICAgICAgIH07XG4gICAgICAgIGRyYWdnZWQgPSBmYWxzZTtcbiAgICAgICAgbW91c2VEb3duKys7XG4gICAgICB9LGZhbHNlKTtcblxuICAgICAgY2FudmFzLm5vZGUoKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIGxhc3RYID0gZXZ0LmNsaWVudFg7XG4gICAgICAgIGRyYWdnZWQgPSB0cnVlO1xuICAgICAgICBpZiAoZHJhZ1N0YXJ0ICYmIG1vdXNlRG93bil7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZShsYXN0WC1kcmFnU3RhcnQueCwgbGFzdFktZHJhZ1N0YXJ0LnkpO1xuICAgICAgICAgIGRyYXdBZ2FpbigpO1xuICAgICAgICAgIHJlZHJhdygpO1xuICAgICAgICAgIC8vem9vbS50cmFuc2xhdGUoW2QzLmV2ZW50LnRyYW5zbGF0ZVswXSwgMF0pO1xuICAgICAgICB9XG4gICAgICB9LGZhbHNlKTtcblxuICAgICAgY2FudmFzLm5vZGUoKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICBkcmFnU3RhcnQgPSBudWxsO1xuICAgICAgICBtb3VzZURvd24tLTtcbiAgICAgICAgaWYgKCFkcmFnZ2VkKSB6b29tKGV2dC5zaGlmdEtleSA/IC0xIDogMSApO1xuICAgICAgfSxmYWxzZSk7XG5cblx0XHRcdC8qdmFyIGMgPSBuZXcgY2FudmFzSGFuZGxlcihncmFwaFdpZHRoLCBncmFwaEhlaWdodCk7XG5cbiAgICAgIGMuaW5pdChzZWxlY3Rpb24sIGdyYXBoV2lkdGgsIGdyYXBoSGVpZ2h0KTtcblx0XHRcdGMuZHJhdygpOyovXG5cblx0XHRcdC8qdmFyIGxhc3RYPWNhbnZhcy5ub2RlKCkud2lkdGgvMiwgbGFzdFk9Y2FudmFzLm5vZGUoKS5oZWlnaHQvMjtcblx0XHRcdHZhciBtb3VzZURvd24gPSAwO1xuXHRcdFx0dmFyIGRyYWdnZWQ7XG5cdFx0XHR2YXIgZHJhZ1N0YXJ0ID0ge1xuXHRcdFx0XHR4IDogbGFzdFgsXG5cdFx0XHRcdHkgOiBsYXN0WVxuXHRcdFx0fTtcbmNvbnNvbGUubG9nKCdvaycpOyovXG5cbiAgICAgIC8qdmFyIGNhbnZhcyA9IGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoJ2NhbnZhcycpO1xuXG5cdFx0XHQvLyBldmVudCBcImNsaWNraW5nXCJcblx0XHRcdGNhbnZhcy5ub2RlKCkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgYy5tb3VzZURvd25IYW5kbGVyLGZhbHNlKTtcblxuICAgICAgY2FudmFzLm5vZGUoKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBjLm1vdXNlTW92ZUhhbmRsZXIsZmFsc2UpO1xuXG4gICAgICBjYW52YXMubm9kZSgpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBjLm1vdXNlVXBIYW5kbGVyLGZhbHNlKTtcbiovXG5cdFx0XHQvLyBldmVudCBcIm1vdXNlIG1vdmluZ1wiXG5cdFx0XHQvL2NhbnZhcy5ub2RlKCkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgYy5tb3VzZU1vdmVIYW5kbGVyLGZhbHNlKTtcblxuXHRcdFx0Ly8gZXZlbnQgXCJzdG9wIGNsaWNraW5nXCJcblx0XHRcdC8vY2FudmFzLm5vZGUoKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgYy5tb3VzZVVwSGFuZGxlcixmYWxzZSk7XG5cblx0XHRcdC8qdmFyIHNjYWxlRmFjdG9yID0gMS4xO1xuXHRcdFx0dmFyIHpvb20gPSBmdW5jdGlvbihjbGlja3Mpe1xuXHRcdFx0ICB2YXIgcHQgPSBjdHgudHJhbnNmb3JtZWRQb2ludChsYXN0WCxsYXN0WSk7XG5cdFx0XHQgIGN0eC50cmFuc2xhdGUocHQueCxwdC55KTtcblx0XHRcdCAgdmFyIGZhY3RvciA9IE1hdGgucG93KHNjYWxlRmFjdG9yLGNsaWNrcyk7XG5cdFx0XHQgIGN0eC5zY2FsZShmYWN0b3IsMSk7XG5cdFx0XHQgIGN0eC50cmFuc2xhdGUoLXB0LngsLXB0LnkpO1xuXHRcdFx0ICBkcmF3QWdhaW4oKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGhhbmRsZVNjcm9sbCA9IGZ1bmN0aW9uKGV2dCl7XG5cdFx0XHQgIHZhciBkZWx0YSA9IGV2dC53aGVlbERlbHRhID8gZXZ0LndoZWVsRGVsdGEvNDAgOiBldnQuZGV0YWlsID8gLWV2dC5kZXRhaWwgOiAwO1xuXHRcdFx0ICBpZiAoZGVsdGEpIHpvb20oZGVsdGEpO1xuXHRcdFx0ICByZXR1cm4gZXZ0LnByZXZlbnREZWZhdWx0KCkgJiYgZmFsc2U7XG5cdFx0XHR9O1xuXHRcdFx0Y2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ0RPTU1vdXNlU2Nyb2xsJyxoYW5kbGVTY3JvbGwsZmFsc2UpO1xuXHRcdFx0Y2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLGhhbmRsZVNjcm9sbCxmYWxzZSk7XG5cblx0XHRcdCovXG5cblxuXHRcdFx0ZDMuc2VsZWN0KHRoaXMpLnNlbGVjdCgnc3ZnJykucmVtb3ZlKCk7XG5cblx0XHRcdHZhciBzdmcgPSBkMy5zZWxlY3QodGhpcylcblx0XHRcdCAgLmFwcGVuZCgnc3ZnJylcblx0XHRcdCAgLmF0dHIoJ3dpZHRoJywgY29uZmlnLndpZHRoKVxuXHRcdFx0ICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuXHRcdFx0O1xuXG5cdFx0XHR2YXIgZ3JhcGggPSBzdmcuYXBwZW5kKCdnJylcblx0XHRcdCAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgMjUpJyk7XG5cblx0XHRcdHZhciB5RG9tYWluID0gW107XG5cdFx0XHR2YXIgeVJhbmdlID0gW107XG5cblx0XHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnQsIGluZGV4KSB7XG5cdFx0XHQgIHlEb21haW4ucHVzaChldmVudC5uYW1lKTtcblx0XHRcdCAgeVJhbmdlLnB1c2goaW5kZXggKiA0MCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0eVNjYWxlLmRvbWFpbih5RG9tYWluKS5yYW5nZSh5UmFuZ2UpO1xuXG5cdFx0XHQvLyB0aGlzIHBhcnQgaW4gY29tbWVudHMgdXNlZCB0byBkcmF3IGxpbmVzIGluIHN2ZyBvbiB0aGUgZ3JhcGhcblxuXHRcdFx0Ly8gdHJhbnNsYXRpb24gZGUgNDAgcG91ciBsZXMgbGlnbmVzXG5cblx0XHRcdHZhciB5QXhpc0VsID0gZ3JhcGguYXBwZW5kKCdnJylcblx0XHRcdCAgLmNsYXNzZWQoJ3ktYXhpcycsIHRydWUpXG5cdFx0XHQgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsIDYwKScpO1xuXG5cdFx0XHR2YXIgeVRpY2sgPSB5QXhpc0VsLmFwcGVuZCgnZycpLnNlbGVjdEFsbCgnZycpLmRhdGEoeURvbWFpbik7XG5cblx0XHRcdC8vdmFyIHlUaWNrID0gZ3JhcGguYXBwZW5kKCdnJykuc2VsZWN0QWxsKCdnJykuZGF0YSh5RG9tYWluKTtcblxuXHRcdFx0eVRpY2suZW50ZXIoKVxuXHRcdFx0ICAuYXBwZW5kKCdnJylcblx0XHRcdCAgLmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0cmV0dXJuICd0cmFuc2xhdGUoMCwgJyArIHlTY2FsZShkKSArICcpJztcblx0XHRcdCAgfSlcblx0XHRcdCAgLmFwcGVuZCgnbGluZScpXG5cdFx0XHQgIC5jbGFzc2VkKCd5LXRpY2snLCB0cnVlKVxuXHRcdFx0ICAuYXR0cigneDEnLCBjb25maWcubWFyZ2luLmxlZnQpXG5cdFx0XHQgIC5hdHRyKCd4MicsIGNvbmZpZy5tYXJnaW4ubGVmdCArIGdyYXBoV2lkdGgpO1xuXG5cdFx0XHR5VGljay5leGl0KCkucmVtb3ZlKCk7XG5cblx0XHRcdHZhciBjdXJ4LCBjdXJ5O1xuXHRcdFx0dmFyIHpvb21SZWN0ID0gc3ZnXG5cdFx0XHQgIC5hcHBlbmQoJ3JlY3QnKVxuXHRcdFx0ICAuY2FsbCh6b29tKVxuXHRcdFx0ICAuY2xhc3NlZCgnem9vbScsIHRydWUpXG5cdFx0XHQgIC5hdHRyKCd3aWR0aCcsIGdyYXBoV2lkdGgpXG5cdFx0XHQgIC5hdHRyKCdoZWlnaHQnLCBoZWlnaHQgKVxuXHRcdFx0ICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgY29uZmlnLm1hcmdpbi5sZWZ0ICsgJywgMzUpJylcblx0XHRcdDtcblxuXHRcdFx0aWYgKHR5cGVvZiBjb25maWcuZXZlbnRIb3ZlciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0ICB6b29tUmVjdC5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24oZCwgZSkge1xuXHRcdFx0XHR2YXIgZXZlbnQgPSBkMy5ldmVudDtcblx0XHRcdFx0aWYgKGN1cnggPT0gZXZlbnQuY2xpZW50WCAmJiBjdXJ5ID09IGV2ZW50LmNsaWVudFkpIHJldHVybjtcblx0XHRcdFx0Y3VyeCA9IGV2ZW50LmNsaWVudFg7XG5cdFx0XHRcdGN1cnkgPSBldmVudC5jbGllbnRZO1xuXHRcdFx0XHR6b29tUmVjdC5hdHRyKCdkaXNwbGF5JywgJ25vbmUnKTtcblx0XHRcdFx0dmFyIGVsID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChkMy5ldmVudC5jbGllbnRYLCBkMy5ldmVudC5jbGllbnRZKTtcblx0XHRcdFx0em9vbVJlY3QuYXR0cignZGlzcGxheScsICdibG9jaycpO1xuXHRcdFx0XHRpZiAoZWwudGFnTmFtZSAhPT0gJ2NpcmNsZScpIHJldHVybjtcblx0XHRcdFx0Y29uZmlnLmV2ZW50SG92ZXIoZWwpO1xuXHRcdFx0ICB9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHR5cGVvZiBjb25maWcuZXZlbnRDbGljayA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0ICB6b29tUmVjdC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHpvb21SZWN0LmF0dHIoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXHRcdFx0XHR2YXIgZWwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGQzLmV2ZW50LmNsaWVudFgsIGQzLmV2ZW50LmNsaWVudFkpO1xuXHRcdFx0XHR6b29tUmVjdC5hdHRyKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0XHRcdGlmIChlbC50YWdOYW1lICE9PSAnY2lyY2xlJykgcmV0dXJuO1xuXHRcdFx0XHRjb25maWcuZXZlbnRDbGljayhlbCk7XG5cdFx0XHQgIH0pO1xuXHRcdFx0fVxuXG5cdFx0XHR4U2NhbGUucmFuZ2UoWzAsIGdyYXBoV2lkdGhdKS5kb21haW4oW2NvbmZpZy5zdGFydCwgY29uZmlnLmVuZF0pO1xuXG5cdFx0XHR6b29tLngoeFNjYWxlKTtcblxuICAgICAgdmFyIGNvb3JYX3N0YXJ0O1xuXG4gICAgICB2YXIgY29vclhfZW5kO1xuXG4gICAgICBmdW5jdGlvbiB6b29tU3RhcnQoKSB7XG4gICAgICAgIGlmIChkMy5ldmVudC5zb3VyY2VFdmVudC50b1N0cmluZygpID09PSAnW29iamVjdCBNb3VzZUV2ZW50XScpIHtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKGQzLm1vdXNlKHRoaXMpWzBdKTtcbiAgICAgICAgICBjb29yWF9zdGFydCA9IGQzLm1vdXNlKHRoaXMpWzBdO1xuICAgICAgICB9XG4gICAgICB9XG5cblx0XHRcdGZ1bmN0aW9uIHVwZGF0ZVpvb20oKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coZDMuZXZlbnQuc291cmNlRXZlbnQpO1xuICAgICAgICBpZiAoZDMuZXZlbnQuc291cmNlRXZlbnQudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgTW91c2VFdmVudF0nKSB7XG4gICAgICAgICAgem9vbS50cmFuc2xhdGUoW2QzLmV2ZW50LnRyYW5zbGF0ZVswXSwgMF0pO1xuICAgICAgICAgIC8vY3R4LnRyYW5zbGF0ZShkMy5ldmVudC50cmFuc2xhdGVbMF0sIDApO1xuXHRcdFx0ICB9XG5cblx0XHRcdCAgaWYgKGQzLmV2ZW50LnNvdXJjZUV2ZW50LnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IFdoZWVsRXZlbnRdJykge1xuXHRcdFx0XHQgIHpvb20uc2NhbGUoZDMuZXZlbnQuc2NhbGUpO1xuXHRcdFx0ICB9XG4gICAgICAgIC8vZHJhd0FnYWluKCk7XG5cdFx0XHQgIHJlZHJhdygpO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiByZWRyYXdEZWxpbWl0ZXIoKSB7XG5cdFx0XHQgIHN2Zy5zZWxlY3QoJy5kZWxpbWl0ZXInKS5yZW1vdmUoKTtcblx0XHRcdCAgdmFyIGRlbGltaXRlckVsID0gc3ZnXG5cdFx0XHRcdC5hcHBlbmQoJ2cnKVxuXHRcdFx0XHQuY2xhc3NlZCgnZGVsaW1pdGVyJywgdHJ1ZSlcblx0XHRcdFx0LmF0dHIoJ3dpZHRoJywgZ3JhcGhXaWR0aClcblx0XHRcdFx0LmF0dHIoJ2hlaWdodCcsIDEwKVxuXHRcdFx0XHQuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgY29uZmlnLm1hcmdpbi5sZWZ0ICsgJywgJyArIChjb25maWcubWFyZ2luLnRvcCAtIDQ1KSArICcpJylcblx0XHRcdFx0LmNhbGwoZGVsaW1pdGVyKHtcblx0XHRcdFx0ICB4U2NhbGU6IHhTY2FsZSxcblx0XHRcdFx0ICBkYXRlRm9ybWF0OiBjb25maWcubG9jYWxlID8gY29uZmlnLmxvY2FsZS50aW1lRm9ybWF0KFwiJWQgJUIgJVlcIikgOiBkMy50aW1lLmZvcm1hdChcIiVkICVCICVZXCIpXG5cdFx0XHRcdH0pKVxuXHRcdFx0ICA7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIHpvb21FbmQoKSB7XG5cdFx0XHQgIGlmIChjb25maWcuZXZlbnRab29tKSB7XG5cdFx0XHRcdGNvbmZpZy5ldmVudFpvb20oeFNjYWxlKTtcblx0XHRcdCAgfVxuXHRcdFx0ICBpZiAoY29uZmlnLmhhc0RlbGltaXRlcikge1xuXHRcdFx0XHRyZWRyYXdEZWxpbWl0ZXIoKTtcblx0XHRcdCAgfVxuICAgICAgICBpZiAoZDMuZXZlbnQuc291cmNlRXZlbnQudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgTW91c2VFdmVudF0nKSB7XG4gICAgICAgICAgY29vclhfZW5kID0gZDMubW91c2UodGhpcylbMF07XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZShjb29yWF9lbmQgLSBjb29yWF9zdGFydCwgMCk7XG4gICAgICAgICAgZHJhd0FnYWluKCk7XG4gICAgICAgIH1cblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gZHJhd1hBeGlzKHdoZXJlKSB7XG5cblx0XHRcdCAgLy8gY29weSBjb25maWcudGlja0Zvcm1hdCBiZWNhdXNlIGQzIGZvcm1hdC5tdWx0aSBlZGl0IGl0cyBnaXZlbiB0aWNrRm9ybWF0IGRhdGFcblx0XHRcdCAgdmFyIHRpY2tGb3JtYXREYXRhID0gW107XG5cblx0XHRcdCAgY29uZmlnLnRpY2tGb3JtYXQuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHR2YXIgdGljayA9IGl0ZW0uc2xpY2UoMCk7XG5cdFx0XHRcdHRpY2tGb3JtYXREYXRhLnB1c2godGljayk7XG5cdFx0XHQgIH0pO1xuXG5cdFx0XHQgIHZhciB0aWNrRm9ybWF0ID0gY29uZmlnLmxvY2FsZSA/IGNvbmZpZy5sb2NhbGUudGltZUZvcm1hdC5tdWx0aSh0aWNrRm9ybWF0RGF0YSkgOiBkMy50aW1lLmZvcm1hdC5tdWx0aSh0aWNrRm9ybWF0RGF0YSk7XG5cdFx0XHQgIHZhciB4QXhpcyA9IGQzLnN2Zy5heGlzKClcblx0XHRcdFx0LnNjYWxlKHhTY2FsZSlcblx0XHRcdFx0Lm9yaWVudCh3aGVyZSlcblx0XHRcdFx0LnRpY2tGb3JtYXQodGlja0Zvcm1hdClcblx0XHRcdCAgO1xuXG5cdFx0XHQgIGlmICh0eXBlb2YgY29uZmlnLmF4aXNGb3JtYXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0Y29uZmlnLmF4aXNGb3JtYXQoeEF4aXMpO1xuXHRcdFx0ICB9XG5cblx0XHRcdCAgdmFyIHkgPSAod2hlcmUgPT0gJ2JvdHRvbScgPyBwYXJzZUludChncmFwaEhlaWdodCkgOiAwKSArIGNvbmZpZy5tYXJnaW4udG9wIC0gNDA7XG5cblx0XHRcdCAgZ3JhcGguc2VsZWN0KCcueC1heGlzLicgKyB3aGVyZSkucmVtb3ZlKCk7XG5cdFx0XHQgIHZhciB4QXhpc0VsID0gZ3JhcGhcblx0XHRcdFx0LmFwcGVuZCgnZycpXG5cdFx0XHRcdC5jbGFzc2VkKCd4LWF4aXMnLCB0cnVlKVxuXHRcdFx0XHQuY2xhc3NlZCh3aGVyZSwgdHJ1ZSlcblx0XHRcdFx0LmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIGNvbmZpZy5tYXJnaW4ubGVmdCArICcsICcgKyB5ICsgJyknKVxuXHRcdFx0XHQuY2FsbCh4QXhpcylcblx0XHRcdCAgO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiByZWRyYXcoKSB7XG5cblx0XHRcdCAgdmFyIGhhc1RvcEF4aXMgPSB0eXBlb2YgY29uZmlnLmhhc1RvcEF4aXMgPT09ICdmdW5jdGlvbicgPyBjb25maWcuaGFzVG9wQXhpcyhkYXRhKSA6IGNvbmZpZy5oYXNUb3BBeGlzO1xuXHRcdFx0ICBpZiAoaGFzVG9wQXhpcykge1xuXHRcdFx0XHRkcmF3WEF4aXMoJ3RvcCcpO1xuXHRcdFx0ICB9XG5cblx0XHRcdCAgdmFyIGhhc0JvdHRvbUF4aXMgPSB0eXBlb2YgY29uZmlnLmhhc0JvdHRvbUF4aXMgPT09ICdmdW5jdGlvbicgPyBjb25maWcuaGFzQm90dG9tQXhpcyhkYXRhKSA6IGNvbmZpZy5oYXNCb3R0b21BeGlzO1xuXHRcdFx0ICBpZiAoaGFzQm90dG9tQXhpcykge1xuXHRcdFx0XHRkcmF3WEF4aXMoJ2JvdHRvbScpO1xuXHRcdFx0ICB9XG5cblx0XHRcdCAgem9vbS5zaXplKFtjb25maWcud2lkdGgsIGhlaWdodF0pO1xuXG5cdFx0XHQgIGdyYXBoLnNlbGVjdCgnLmdyYXBoLWJvZHknKS5yZW1vdmUoKTtcblx0XHRcdCAgdmFyIGdyYXBoQm9keSA9IGdyYXBoXG5cdFx0XHRcdC5hcHBlbmQoJ2cnKVxuXHRcdFx0XHQuY2xhc3NlZCgnZ3JhcGgtYm9keScsIHRydWUpXG5cdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBjb25maWcubWFyZ2luLmxlZnQgKyAnLCAnICsgKGNvbmZpZy5tYXJnaW4udG9wIC0gMTUpICsgJyknKTtcblxuXHRcdFx0ICB2YXIgbGluZXMgPSBncmFwaEJvZHkuc2VsZWN0QWxsKCdnJykuZGF0YShkYXRhKTtcblxuXHRcdFx0ICBsaW5lcy5lbnRlcigpXG5cdFx0XHRcdC5hcHBlbmQoJ2cnKVxuXHRcdFx0XHQuY2xhc3NlZCgnbGluZScsIHRydWUpXG5cdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbihkKSB7XG5cdFx0XHRcdCAgcmV0dXJuICd0cmFuc2xhdGUoMCwnICsgeVNjYWxlKGQubmFtZSkgKyAnKSc7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5zdHlsZSgnZmlsbCcsIGNvbmZpZy5ldmVudExpbmVDb2xvcilcblx0XHRcdFx0LmNhbGwoZXZlbnRMaW5lKHsgeFNjYWxlOiB4U2NhbGUsIGV2ZW50Q29sb3I6IGNvbmZpZy5ldmVudENvbG9yIH0pKVxuXHRcdFx0ICA7XG5cblx0XHRcdCAgbGluZXMuZXhpdCgpLnJlbW92ZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZWRyYXcoKTtcblx0XHRcdGlmIChjb25maWcuaGFzRGVsaW1pdGVyKSB7XG5cdFx0XHQgIHJlZHJhd0RlbGltaXRlcigpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGNvbmZpZy5ldmVudFpvb20pIHtcblx0XHRcdCAgY29uZmlnLmV2ZW50Wm9vbSh4U2NhbGUpO1xuXHRcdFx0fVxuXHRcdCAgfSk7XG5cdFx0fVxuXG5cdFx0Y29uZmlndXJhYmxlKGV2ZW50RHJvcEdyYXBoLCBjb25maWcpO1xuXG5cdFx0cmV0dXJuIGV2ZW50RHJvcEdyYXBoO1xuICB9O1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLyogZ2xvYmFsIHJlcXVpcmUsIG1vZHVsZSwgZDMgKi9cblxudmFyIGNvbmZpZ3VyYWJsZSA9IHJlcXVpcmUoJy4vdXRpbC9jb25maWd1cmFibGUnKTtcbnZhciBmaWx0ZXJEYXRhID0gcmVxdWlyZSgnLi9maWx0ZXJEYXRhJyk7XG5cbnZhciBkZWZhdWx0Q29uZmlnID0ge1xuICB4U2NhbGU6IG51bGxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGQzLCBjdHgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChjb25maWcpIHtcblxuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7XG4gICAgICB4U2NhbGU6IG51bGwsXG4gICAgICBldmVudENvbG9yOiBudWxsXG4gICAgfTtcbiAgICBmb3IgKHZhciBrZXkgaW4gZGVmYXVsdENvbmZpZykge1xuICAgICAgY29uZmlnW2tleV0gPSBjb25maWdba2V5XSB8fCBkZWZhdWx0Q29uZmlnW2tleV07XG4gICAgfVxuXG4gICAgdmFyIGV2ZW50TGluZSA9IGZ1bmN0aW9uIGV2ZW50TGluZShzZWxlY3Rpb24pIHtcbiAgICAgIHNlbGVjdGlvbi5lYWNoKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoJ3RleHQnKS5yZW1vdmUoKTtcblxuICAgICAgICBkMy5zZWxlY3QodGhpcykuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAudGV4dChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICB2YXIgY291bnQgPSBmaWx0ZXJEYXRhKGQuZGF0ZXMsIGNvbmZpZy54U2NhbGUpLmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybiBkLm5hbWUgKyAoY291bnQgPiAwID8gJyAoJyArIGNvdW50ICsgJyknIDogJycpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ2VuZCcpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoLTIwKScpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgJ2JsYWNrJylcbiAgICAgICAgO1xuXG4gICAgICAgIC8vZDMuc2VsZWN0KHRoaXMpLnNlbGVjdEFsbCgnY2lyY2xlJykucmVtb3ZlKCk7XG5cbiAgICAgICAgLyp2YXIgY2lyY2xlID0gZDMuc2VsZWN0KHRoaXMpLnNlbGVjdEFsbCgnY2lyY2xlJylcbiAgICAgICAgICAuZGF0YShmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAvLyBmaWx0ZXIgdmFsdWUgb3V0c2lkZSBvZiByYW5nZVxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlckRhdGEoZC5kYXRlcywgY29uZmlnLnhTY2FsZSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgY2lyY2xlLmVudGVyKClcbiAgICAgICAgICAuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAgIC5hdHRyKCdjeCcsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWcueFNjYWxlKGQpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgY29uZmlnLmV2ZW50Q29sb3IpXG4gICAgICAgICAgLmF0dHIoJ2N5JywgLTUpXG4gICAgICAgICAgLmF0dHIoJ3InLCAxMClcbiAgICAgICAgO1xuXG4gICAgICAgIGNpcmNsZS5leGl0KCkucmVtb3ZlKCk7Ki9cblxuICAgICAgICB2YXIgZGF0YSA9IGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoJ2NhbnZhcycpXG4gICAgICAgICAgLmRhdGEoZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpbHRlckRhdGEoZC5kYXRlcywgY29uZmlnLnhTY2FsZSk7XG4gICAgICAgICAgfSk7XG4vKlxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5hcmMoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIDEwMDtcbiAgICAgICAgfSwgMzUwLzIsIDEwLCAwLCAyICogTWF0aC5QSSk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb25maWcuZXZlbnRDb2xvcjtcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmFyYyg3NTAvMiwgMzUwLzIsIDEwLCAwLCAyICogTWF0aC5QSSk7XG4gICAgICAgIGN0eC5maWxsU3R5bGU9XCJyZWRcIjtcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpOyovXG5cbiAgICAgICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgY3R4LmFyYyhmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlnLnhTY2FsZShkKTtcbiAgICAgICAgICB9LCAzNTAvMiwgMTAsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguZmlsbFN0eWxlID0gY29uZmlnLmV2ZW50Q29sb3I7XG4gICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgY29uZmlndXJhYmxlKGV2ZW50TGluZSwgY29uZmlnKTtcblxuICAgIHJldHVybiBldmVudExpbmU7XG4gIH07XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKiBnbG9iYWwgbW9kdWxlICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmlsdGVyRGF0ZShkYXRhLCBzY2FsZSkge1xuICBkYXRhID0gZGF0YSB8fCBbXTtcbiAgdmFyIGZpbHRlcmVkRGF0YSA9IFtdO1xuICB2YXIgYm91bmRhcnkgPSBzY2FsZS5yYW5nZSgpO1xuICB2YXIgbWluID0gYm91bmRhcnlbMF07XG4gIHZhciBtYXggPSBib3VuZGFyeVsxXTtcbiAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChkYXR1bSkge1xuICAgIHZhciB2YWx1ZSA9IHNjYWxlKGRhdHVtKTtcbiAgICBpZiAodmFsdWUgPCBtaW4gfHwgdmFsdWUgPiBtYXgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZmlsdGVyZWREYXRhLnB1c2goZGF0dW0pO1xuICB9KTtcblxuICByZXR1cm4gZmlsdGVyZWREYXRhO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLyogZ2xvYmFsIHJlcXVpcmUsIGRlZmluZSwgbW9kdWxlICovXG5cbnZhciBldmVudERyb3BzID0gcmVxdWlyZSgnLi9ldmVudERyb3BzJyk7XG5cbmlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICBkZWZpbmUoJ2QzLmNoYXJ0LmV2ZW50RHJvcHMnLCBbXCJkM1wiXSwgZnVuY3Rpb24gKGQzKSB7XG4gICAgZDMuY2hhcnQgPSBkMy5jaGFydCB8fCB7fTtcbiAgICBkMy5jaGFydC5ldmVudERyb3BzID0gZXZlbnREcm9wcyhkMywgZG9jdW1lbnQpO1xuICB9KTtcbn0gZWxzZSBpZiAod2luZG93KSB7XG4gIHdpbmRvdy5kMy5jaGFydCA9IHdpbmRvdy5kMy5jaGFydCB8fCB7fTtcbiAgd2luZG93LmQzLmNoYXJ0LmV2ZW50RHJvcHMgPSBldmVudERyb3BzKHdpbmRvdy5kMywgZG9jdW1lbnQpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBldmVudERyb3BzO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb25maWd1cmFibGUodGFyZ2V0RnVuY3Rpb24sIGNvbmZpZywgbGlzdGVuZXJzKSB7XG4gIGxpc3RlbmVycyA9IGxpc3RlbmVycyB8fCB7fTtcbiAgZm9yICh2YXIgaXRlbSBpbiBjb25maWcpIHtcbiAgICAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgdGFyZ2V0RnVuY3Rpb25baXRlbV0gPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjb25maWdbaXRlbV07XG4gICAgICAgIGNvbmZpZ1tpdGVtXSA9IHZhbHVlO1xuICAgICAgICBpZiAobGlzdGVuZXJzLmhhc093blByb3BlcnR5KGl0ZW0pKSB7XG4gICAgICAgICAgbGlzdGVuZXJzW2l0ZW1dKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YXJnZXRGdW5jdGlvbjtcbiAgICAgIH07XG4gICAgfSkoaXRlbSk7IC8vIGZvciBkb2Vzbid0IGNyZWF0ZSBhIGNsb3N1cmUsIGZvcmNpbmcgaXRcbiAgfVxufTtcbiJdfQ==
