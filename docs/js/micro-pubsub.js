!function(W){
	if(!W.pubsub){
		W.pubsub = {};
		var topics = {};
		W.pubsub.subscribe = function(topic, func){
			topics[topic] = topics[topic] || [];
			topics[topic].push(func);
		}

		W.pubsub.publish = function(topic, data){
			var subscribers = topics[topic];
			var len = subscribers ? subscribers.length : 0;
			while (len--) {
			    subscribers[len](data);
			}
		}
	}
}(window)


!function(W){
	if(!W.pubsub){
		W.pubsub = {};
		var topics = {};
		W.pubsub.subscribe = function(topic, func){
			topics[topic] = func;
		}
		W.pubsub.publish = function(topic, data){
			topics[topic] && topics[topic](data);
		}
	}
}(window)


!function(W){
	var topics = {};
	W.subscribe = function(topic, func){
		topics[topic] = func;
	}
	W.publish = function(topic, data){
		topics[topic] && topics[topic](data);
	}
}(window);


subscribe("test", function(data){
	console.log( data.toUpperCase() );
})

publish("test", "hello world" );



