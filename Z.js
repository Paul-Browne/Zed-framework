// IIFE
!function(w, d) {
  // check if Z is already loaded
  if (!w.Z) {
    // PubSub store
    var topics = {};

    function injector(resolved, obj) {
      if ("data" in resolved && "render" in resolved) {
        Z[obj.key] = isString(resolved.data) ? JSON.parse(resolved.data) : resolved.data;
        obj.before && obj.before();
        var resolvedRender = resolved.render;
        if (isString(resolved.render)) {
          if(obj.inner){
            obj.inner.innerHTML = resolvedRender;
          }
          if(obj.outer){
            obj.outer.outerHTML = resolvedRender;
          }
          // inject nested scripts into the head.
          var scripts = new DOMParser()
            .parseFromString(resolvedRender, "text/html")
            .querySelectorAll("SCRIPT");
          for (var i = 0; i < scripts.length; i++) {
            var newScript = d.createElement("SCRIPT");
            scripts[i].src
              ? (newScript.src = scripts[i].src)
              : (newScript.innerHTML = scripts[i].innerHTML);
            d.head.appendChild(newScript);
          }
        } else {
          if(obj.inner){
            obj.inner.innerHTML = resolvedRender();
          }
          if(obj.outer){
            obj.outer.outerHTML = resolvedRender();
          }
        }
        obj.after && obj.after();
      }
    }

    function ajax(resolved, obj, method) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          resolved[method] = xhr.responseText;
          injector(resolved, obj);
        }
      };
      xhr.open("GET", obj[method], true);
      xhr.send();
    }

    function isString(string) {
      return typeof string === "string";
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
        // async ajax
        var resolved = {};
        ["data", "render"].forEach(function(el) {
          isString(obj[el])
            ? ajax(resolved, obj, el)
            : (resolved[el] = obj[el]);
        });
        injector(resolved, obj);
      },
      watch: function(key, obj) {
        topics[key] && topics[key].l.push(obj);
      }
    };
  }
  // init
}(window, document);
