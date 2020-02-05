!(function(w) {
  if (!w.Z) {
    var topics = {};
    w.Z = {
      load: function(arr, callback, id) {
        if(!callback){
          console.error('Z.load id:"' + id + ' no callback function');
        }
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
        // warn against trying to update when the id doesn't exist
        if(!topics[id]){
          console.warn('Z.update id:"' + id + '" does not exist');
        }
        if (topics[id]) {
          topics[id].f(obj);
          topics[id].l.forEach(function(fn) {
            fn();
          });
        }
      },
      mount: function(obj, noSubscribe) {
        if (obj.id && !noSubscribe) {
          // warn against mounting with the same id
          if(topics[obj.id]){
            (document.documentElement.contains(obj.inner) || document.documentElement.contains(obj.outer)) && console.warn('Z.mount id:"' + obj.id + '" already exists');
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
        if(typeof inner == "undefined" && typeof outer == "undefined"){
          console.error('Z.mount id:"' + obj.id + '" must reference either inner: or outer:');
        }
        if(inner === null){
          console.error('Z.mount id:"' + obj.id + '" inner: not found in the DOM');
        }
        if(outer === null){
          console.error('Z.mount id:"' + obj.id + '" outer: not found in the DOM');
        }
        if(inner && inner.length){
          console.error('Z.mount id:"' + obj.id + '" inner: has multiple DOM elements');
        }
        if(outer && outer.length){
          console.error('Z.mount id:"' + obj.id + '" outer: has multiple DOM elements');
        }
        if(before && typeof before != "function"){
          console.error('Z.mount id:"' + obj.id + '" before: is not a function')
        }
        if(after && typeof after != "function"){
          console.error('Z.mount id:"' + obj.id + '" after: is not a function')
        }
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
        // warn against trying to watch when the id doesn't exist
        if(!topics[id]){
          console.error('Z.watch id:"' + id + '" does not exist');
        }
        topics[id] && topics[id].l.push(obj);
      }
    };
  }else{
    console.warn('Z already loaded');
  }
})(window);