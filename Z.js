!(function(w) {
  if (!w.Z) {
    var topics = {};
    w.Z = {
      load: function(arr, callback) {
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
        if (topics[id]) {
          topics[id].f(obj);
          topics[id].l.forEach(function(fn) {
            fn();
          });
        }
      },
      mount: function(obj, noSubscribe) {
        if (obj.id && !noSubscribe) {
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
      },
      watch: function(id, obj) {
        topics[id] && topics[id].l.push(obj);
      }
    };
  }
})(window);