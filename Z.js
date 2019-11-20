// IIFE
! function(w, d) {
    // check if Z is already loaded
    if (!w.Z) {
        // object store
        w.Z = {};
        // PubSub store
        var topics = {};

        function injector(resolved, obj){
            if ('data' in resolved && 'html' in resolved) {
                Z[obj.key] = isString(resolved.data) ? JSON.parse(resolved.data) : resolved.data;
                if(isString(resolved.html)){
                    obj.inner ? obj.inner.innerHTML = resolved.html : obj.outer.outerHTML = resolved.html;
                    // inject nested scripts into the head.
                    var scripts = new DOMParser().parseFromString(resolved.html, 'text/html').querySelectorAll("SCRIPT");
                    for(var i = 0; i < scripts.length; i++){
                        var newScript = d.createElement("SCRIPT");
                        scripts[i].src ? newScript.src = scripts[i].src : newScript.innerHTML = scripts[i].innerHTML;
                        d.head.appendChild(newScript);
                    }
                }else{
                    obj.inner ? obj.inner.innerHTML = resolved.html() : obj.outer.outerHTML = resolved.html();
                }
            }
        }

        function ajax(resolved, obj, method){
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

        function isString(string){
            return typeof string === "string";
        }

        // update method (simple PubSub publish)
        Z.update = function(obj) {
            topics[obj.key] && topics[obj.key](obj);
        }
        // render
        Z.render = function(obj, noSubscribe) {
            if (obj.key && !noSubscribe) {
                topics[obj.key] = function(data) {
                    for (var k in data) {
                        obj[k] = data[k];
                    }
                    Z.render(obj, true);
                };
            }
            // async ajax
            var resolved = {};
            ["data", "html"].forEach(function(el){
                isString(obj[el]) ? ajax(resolved, obj, el) : resolved[el] = obj[el];    
            })
            injector(resolved, obj);
        }
    }
    // init    
}(window, document);