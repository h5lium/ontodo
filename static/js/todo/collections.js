(function(){
	window.TodoSet = Backbone.Collection.extend({
		model: Todo,
		initialize: function(){
			var fetchOK = this.fetch();
			if (! fetchOK) {
				// first time
				var todosArr = [];
				var numTodos = 3;
				_.times(numTodos, function(i){
					var todo = new Todo();
					todo.set({
						title: '[ 待办事项 '+ (i+1) +' ]',
						progress: Math.floor(Math.random() * 100)
					});
					todosArr.push(todo);
				});
				this.reset(todosArr).save();
			}
		},
		// overwrite
		fetch: function(){
			var context = this;
			// read from local storage
			var todosData = store.get('todos');
			if (_.isArray(todosData)) {
				// filter abnormal
				todosData = _.filter(todosData, function(todoData){
					if (! Todo.prototype.validate(todoData)) {
						var todo = new Todo();
						todo.set(todoData);
						context.add(todo);
						return true;
					}
				});
				store.set('todos', todosData);
				return true;
			}
		},
		// overwrite
		save: function(){
			var todosData = [];
			// extract todos attr data
			_.each(this.models, function(todo){
				todosData.push(todo.attributes);
			});
			// save to local storage
			store.set('todos', todosData);
		}
	});
})();
