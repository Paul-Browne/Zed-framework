// IIFE
!function(w, d) {
  // check if Z is already loaded
  if (!w.Z) {
    // PubSub store
    var topics = {};

    function injector(obj) {
      var resolvedData = obj.data;
      var resolvedRender = obj.render;
      var inner = obj.inner;
      var outer = obj.outer;
      var key = obj.key;
      var before = obj.before;
      var after = obj.after; 
      if( (before && before(resolvedData, Z[key]) != false )){
        if(inner){
          inner.innerHTML = resolvedRender(resolvedData, Z[key]);
        }
        if(outer){
          outer.outerHTML = resolvedRender(resolvedData, Z[key]);
        }
        after && after(resolvedData, Z[key]);
      }
      Z[key] = resolvedData;
    }

    // object store
    w.Z = {
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
        if( (obj.pre && obj.pre()) != false){
          if(typeof obj.data === "string"){
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
              if (xhr.readyState == 4 && xhr.status == 200) {
                obj.data = JSON.parse(xhr.responseText);
                injector(obj);
              }
            };
            xhr.open("GET", obj.data, true);
            xhr.send();
          }else{
            injector(obj);
          }
        }
      },
      watch: function(key, obj) {
        topics[key] && topics[key].l.push(obj);
      }
    };
  }
  // init
}(window, document);
