! function(w, d) {
    if (!w.Z) {
        w.Z = {};
        var topics = {};

        // function subscribe(topic, f) {
        //     console.log('subscribed!', topic);
        //     topics[topic] = topics[topic] || [];
        //     topics[topic].push({f: f});
        // }

        // function publish(topic, args) {
        //     console.log('published!', topic);
        //     var subscribers = topics[topic];
        //     var len = subscribers ? subscribers.length : 0;
        //     while (len--) {
        //         subscribers[len].f(topic, args);
        //     }
        // }

        function ajax(url, cb) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    cb(xhr.responseText);
                }
            };
            xhr.open("GET", url, true);
            xhr.send();
        }

        function inject(obj, html) {
            obj.container.innerHTML = html;
            var scripts = new DOMParser().parseFromString(html, 'text/html').querySelectorAll("SCRIPT");
            var i = 0;
            var j = scripts.length;
            while (i < j) {
                var newScript = d.createElement("SCRIPT");
                scripts[i].src ? newScript.src = scripts[i].src : newScript.innerHTML = scripts[i].innerHTML;
                d.head.appendChild(newScript);
                i++;
            }
        }

        // function subscriber(channel, obj) {
        //     console.log('subscribed!', channel);
        //     topics[channel] = topics[channel] || [];
        //     topics[channel].push({f: function(message, data) {
        //         for (var key in data) {
        //             obj[key] = data[key];
        //         }
        //         Z.render(obj, true);
        //     }});
        // }

        function filt(obj) {
          return Object.keys(obj).filter(function(el) {
              return el != "html" && el != "container";
          })[0];
        }

        Z.update = function(obj) {
            //publish(Object.keys(obj)[0], obj);
            var y = filt(obj);
            var subscribers = topics[y];
            var len = subscribers ? subscribers.length : 0;
            while (len--) {
                subscribers[len].f(y, obj);
            }
        }

        Z.render = function(obj, noSubscribe) {
            var x = filt(obj);
            if (x && !noSubscribe) {
                topics[x] = topics[x] || [];
                topics[x].push({f: function(message, data) {
                    for (var key in data) {
                        obj[key] = data[key];
                    }
                    Z.render(obj, true);
                }});
            }
            if (typeof obj[x] === 'string') {
                ajax(obj[x], function(json) {
                    Z[x] = JSON.parse(json);
                    ajax(obj.html, function(res) {
                        inject(obj, res);
                    });
                });
            } else {
                Z[x] = obj[x];
                ajax(obj.html, function(res) {
                    inject(obj, res);
                });
            }
        }
    }
}(window, document);