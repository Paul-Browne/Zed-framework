// IIFE
!(function(w, d) {
  // check if Z is already loaded
  if (!w.Z) {
    // PubSub store
    var topics = {};

    function injector(resolved, obj) {
      if ("data" in resolved && "render" in resolved) {
        Z.previous[obj.key] = Z[obj.key];
        Z[obj.key] = isString(resolved.data)
          ? JSON.parse(resolved.data)
          : resolved.data;
        obj.before && obj.before();
        if (isString(resolved.render)) {
          obj.inner
            ? (obj.inner.innerHTML = resolved.render)
            : (obj.outer.outerHTML = resolved.render);
          // inject nested scripts into the head.
          var scripts = new DOMParser()
            .parseFromString(resolved.render, "text/html")
            .querySelectorAll("SCRIPT");
          for (var i = 0; i < scripts.length; i++) {
            var newScript = d.createElement("SCRIPT");
            scripts[i].src
              ? (newScript.src = scripts[i].src)
              : (newScript.innerHTML = scripts[i].innerHTML);
            d.head.appendChild(newScript);
          }
        } else {
          obj.inner
            ? (obj.inner.innerHTML = resolved.render())
            : (obj.outer.outerHTML = resolved.render());
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
      previous: {},
      update: function(key, obj) {
        topics[key].f(obj);
        topics[key].l.forEach(function(fn) {
          fn();
        });
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
      listen: function(key, obj) {
        topics[key].l.push(obj);
      }
    };
  }
  // init
})(window, document);
