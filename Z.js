// IIFE
!(function(w) {

  // only add Z method to the window
  // if it hasn't already been added
  if (!w.Z) {

    // PubSub store
    var topics = {};

    // attach the methods, load, update, mount and watch
    w.Z = {

      // this is basically just a Promise.all polyfil
      // A way to make multiple asynchronous ajax requests
      // Then call a callback when all have resloved
      load: function(arr, callback) {

        // store for resolved requests
        var arrResolved = [];

        // loop over the array of objects
        // which are the individual requests
        arr.forEach(function(obj, index) {

          // placehold the response as "null"
          arrResolved[index] = null;

          // standard ajax
          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {

              // update the resolved array with the response
              arrResolved[index] =
                xhr.status == (obj.status || 200)

                  // if the object has its own callback
                  ? obj.callback

                    // pass the response to it
                    ? obj.callback(xhr.responseText)

                    // else just update the resolved array with the response
                    : xhr.responseText

                  // if 404 or 405 etc resolve as undefined
                  // NOTE: might be worth passing the
                  // error code as the response
                  : undefined;

              // make the response global using the id as the object key
              Z.load[obj.id] = arrResolved[index];

              // if all requests have resolved
              if (!~arrResolved.indexOf(null)) {

                // call the callback
                callback(arrResolved);
              }
            }
          };

          // more standard ajax
          // allow for "PUT" or "POST" methods etc
          xhr.open(obj.method || "GET", obj.url, true);

          // and custom headers in request
          for (var id in obj.headers) {
            xhr.setRequestHeader(id, obj.headers[id]);
          }
          xhr.send(obj.body);
        });
      },

      // the mount method
      mount: function(obj, noSubscribe) {

        // only subscribe when there is an id
        // only subscribe on Z.mount
        if (obj.id && !noSubscribe) {

          // create subscription
          topics[obj.id] = {

            // array of potential watchers
            W: [],

            // Update methods
            F: function(data) {

              // loop over data object methods
              for (var k in data) {

                // update/add new methods
                obj[k] = data[k];
              }

              // re-mount (update) with new objects
              // not resubscribed
              Z.mount(obj, true);
            }
          };
        }

        // assign the methods to a variables
        var inner = obj.inner;
        var outer = obj.outer;
        var state = obj.state;
        var before = obj.before;
        var after = obj.after;
        var passedObj = {
          state: state,
          prev: Z[obj.id]
        };

        // check for before method, and check if it returns false
        if ((before && before(passedObj.state, passedObj.prev)) != false) {

          // render to the mount DOM element
          var render = obj.render(passedObj.state, passedObj.prev);
          if (inner) {
            inner.innerHTML = render;
          }
          if (outer) {
            outer.outerHTML = render;
          }

          // check for after method
          after && after(passedObj.state, passedObj.prev);
        }

        // update state to global method
        Z[obj.id] = state;
      },

      // the update method is just a 
      // PubSub container function
      update: function(id, obj) {
        if (topics[id]) {

          // Publish  
          topics[id].F(obj);

          // Publish to any watchers
          topics[id].W.forEach(function(fn) {
            fn();
          });
        }
      },

      // the watch method is just a
      // PubSub container function
      watch: function(id, obj) {

        // Subscribe if topic (id of the mount) exists
        topics[id] && topics[id].W.push(obj);
      }
    };
  }
})(window);