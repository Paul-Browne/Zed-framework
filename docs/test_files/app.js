"use strict";perfMonitor.startFPSMonitor(),perfMonitor.startMemMonitor(),perfMonitor.initProfiler("render");var data=[];function update(){requestAnimationFrame(update),data=ENV.generateData().toArray(),perfMonitor.startProfile("render"),m.redraw(),perfMonitor.endProfile("render")}m.mount(document.getElementById("app"),{view:function(){return m("div",[m("table",{className:"table table-striped latest-data"},[m("tbody",data.map(function(e){return m("tr",{key:e.dbname},[m("td",{className:"dbname"},e.dbname),m("td",{className:"query-count"},[m("span",{className:e.lastSample.countClassName},e.lastSample.nbQueries)]),e.lastSample.topFiveQueries.map(function(e){return m("td",{className:e.elapsedClassName},[e.formatElapsed,m("div",{className:"popover left"},[m("div",{className:"popover-content"},e.query),m("div",{className:"arrow"})])])})])}))])])}}),update();