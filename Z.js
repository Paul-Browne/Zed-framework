// IIFE
! function(w, d) {
    // check if Z is already loaded
    if (!w.Z) {
        // object store
        w.Z = {};
        // PubSub store
        var topics = {};
        // last key in object filter
        function filt(obj) {
            var x = Object.keys(obj);
            return x[x.length-1];
        }
        // update method (simple PubSub publish)
        Z.update = function(obj) {
            topics[filt(obj)] && topics[filt(obj)](obj);
        }
        // render
        Z.render = function(obj, noSubscribe) {
            var x = filt(obj);
            if (x && !noSubscribe) {
                topics[x] = function(data) {
                    for (var key in data) {
                        obj[key] = data[key];
                    }
                    Z.render(obj, true);
                };
            }
            // async ajax
            var objResolved = {};
            var arr = obj.html ? [obj.html] : [];
            typeof obj[x] === 'string' ? arr.push(obj[x]) : Z[x] = obj[x];
            arr.forEach(function(url, index) {
                objResolved[index] = "";
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        objResolved[index] = xhr.responseText;
                        var allResolved = true;
                        for (var key in objResolved) {
                            if (objResolved[key] == "") {
                                allResolved = false;
                            }
                        }
                        if (allResolved) {
                            if (objResolved[1]) {
                                Z[x] = JSON.parse(objResolved[1]);
                            }
                            obj.inner ? obj.inner.innerHTML = objResolved[0] : obj.outer.outerHTML = objResolved[0];
                            var scripts = new DOMParser().parseFromString(objResolved[0], 'text/html').querySelectorAll("SCRIPT");
                            var i = 0;
                            var j = scripts.length;
                            while (i < j) {
                                var newScript = d.createElement("SCRIPT");
                                scripts[i].src ? newScript.src = scripts[i].src : newScript.innerHTML = scripts[i].innerHTML;
                                d.head.appendChild(newScript);
                                i++;
                            }
                        }
                    }
                };
                xhr.open("GET", url, true);
                xhr.send();
            });
        }
    }
    // init    
}(window, document);