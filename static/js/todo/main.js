var system = new System();
var user = new User();

var todoSet = new TodoSet();

$(function() {
	// userView
	var userView = new UserView({
		el : $('#module_wrapper'),
		system: system,
		user: user
	});
	userView.renderDate();
	userView.renderUser();
	// watch system.date
	system.bind('change:date', function() {
		userView.renderDate();
	});
	// update every second
	setInterval(updateDate, 1000);
	function updateDate() {
		system.set({
			date : new Date()
		});
	}
	// watch user
	user.bind('change', function() {
		userView.renderUser();
	});
	
	
	
	// todoView
	var todoView = new TodoView({
		el: $('#module_wrapper'),
		todoSet: todoSet
	});
	todoView.render();
	// watch todoSet
	todoSet.bind('add remove update', function(){
		todoView.render();
	});
});
