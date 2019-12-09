!function(w, d) {
  if (!w.Z) {
    var topics = {};
    w.Z = {
      previous: {},
      update: function(key, obj) {
        if(topics[key]){
          topics[key].f(obj);
          topics[key].l.forEach(function(fn) {
            fn();
          });
        }
      },
      mount: function(obj, noSubscribe) {
        if (obj.key && !noSubscribe) {
          topics[obj.key] = {
            l: [],
            f: function(data) {
              for (var k in data) {
                obj[k] = data[k];
              }
              Z.mount(obj, true);
            }
          };
        }
        Z.previous[obj.key] = JSON.parse(JSON.stringify(Z[obj.key]));
        Z[obj.key] = obj.data;
        obj.before && obj.before();
        obj.inner ? obj.inner.innerHTML = obj.render() : obj.outer.outerHTML = obj.render();
        obj.after && obj.after();
      },
      listen: function(key, obj) {
        topics[key] && topics[key].l.push(obj);
      }
    };
  }
}(window, document);
