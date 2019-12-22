!function(w) {
  if (!w.Z) {
    var topics = {};
    w.Z = {
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
        Z[obj.key] = obj.data;
        obj.before && obj.before();
        if(obj.inner){
          obj.inner.innerHTML = obj.render();
        }
        if(obj.outer){
          obj.outer.outerHTML = obj.render();
        }
        obj.after && obj.after();
      },
      update: function(key, obj) {
        if(topics[key]){
          topics[key].f(obj);
          topics[key].l.forEach(function(fn) {
            fn();
          });
        }
      },
      watch: function(key, obj) {
        topics[key] && topics[key].l.push(obj);
      }
    };
  }
}(window);
