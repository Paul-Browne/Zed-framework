!(function(w) {
  if (!w.Z) {
    var topics = {};
    w.Z = {
      dev: {
        showTimers: false
      },
      load: function(arr, callback, id) {
        w.Z.dev.showTimers && console.time(id + ' Z.load');
        var arrResolved = [];
        arr.forEach(function(obj, index) {
          arrResolved[index] = null;
          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
              arrResolved[index] =
                xhr.status == (obj.status || 200)
                  ? obj.callback
                    ? obj.callback(xhr.responseText)
                    : xhr.responseText
                  : undefined;
              Z.load[obj.id] = arrResolved[index];
              if (!~arrResolved.indexOf(null)) {
                w.Z.dev.showTimers && console.timeEnd(id + ' Z.load');
                callback(arrResolved);
              }
            }
          };
          xhr.open(obj.method || "GET", obj.url, true);
          for (var id in obj.headers) {
            xhr.setRequestHeader(id, obj.headers[id]);
          }
          xhr.send(obj.body);
        });
      },
      update: function(id, obj) {
        // warn against trying to update when the id doesn't exist
        if(!topics[id]){
          console.log("Z.update: " + id + " doesn't exist");
        }
        w.Z.dev.showTimers && topics[id] && console.time(id + ' Z.updated');
        if (topics[id]) {
          topics[id].f(obj);
          topics[id].l.forEach(function(fn) {
            fn();
          });
        }
        w.Z.dev.showTimers && topics[id] && console.timeEnd(id + ' Z.updated');
      },
      mount: function(obj, noSubscribe) {

        w.Z.dev.showTimers && !noSubscribe && console.time(obj.id + ' Z.mount');

        if (obj.id && !noSubscribe) {

          // warn against mounting with the same id
          if(topics[obj.id]){
            console.log("Z.mount: " + obj.id + " already exists");
          }

          topics[obj.id] = {
            l: [],
            f: function(data) {
              for (var k in data) {
                obj[k] = data[k];
              }
              Z.mount(obj, true);
            }
          };
        }
        var inner = obj.inner;
        var outer = obj.outer;
        var state = obj.state;
        var before = obj.before;
        var after = obj.after;
        var o = {
          state: state,
          prev: Z[obj.id]
        };
        if ((before && before(o.state, o.prev)) != false) {
          var x = obj.render(o.state, o.prev);
          if (inner) {
            inner.innerHTML = x;
          }
          if (outer) {
            outer.outerHTML = x;
          }
          after && after(o.state, o.prev);
        }
        Z[obj.id] = state;
        w.Z.dev.showTimers && !noSubscribe && console.timeEnd(obj.id + ' Z.mount');
      },
      watch: function(id, obj) {
        // warn against trying to watch when the id doesn't exist
        if(!topics[id]){
          console.log("Z.watch: " + id + " doesn't exist");
        }
        topics[id] && topics[id].l.push(obj);
      }
    };
  }
})(window);