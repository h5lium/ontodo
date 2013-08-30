(function(){
	// remove the initial hash info
	var url = location.href;
	var index = url.indexOf('#');
	if (index !== -1) {
		location.href = url.substring(0, index);
		return;
	}
	
	
	// Router
	var Router = Backbone.Router.extend({
		routes: {
			'user/*action': 'userAction'	// XXX: never followed by the leading '/'
		},
		userAction: function(action){
			alert(action);
		}
	});
	
	
	
	var router = new Router();
	// start routers
	Backbone.history.start();
})();
