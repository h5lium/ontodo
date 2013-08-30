(function(){
	window.UserView = Backbone.View.extend({
		initialize: function(options){
			// models
			this.system = options.system;
			this.user = options.user;
			
			this.$span_date = $('#span_date');
			this.$span_nickname = $('#span_nickname');
			this.$input_nickname = $('#input_nickname');
		},
		
		renderDate: function(){
			var system = this.system;
			var date = system.get('date');
			this.$span_date.html(_.formatDate(date).replace(/ /g, '&nbsp;'));
		},
		renderUser: function(){
			var user = this.user;
			var nickname = user.get('nickname');
			this.$span_nickname.text(nickname);
			this.$input_nickname.attr('value', nickname);
		},
		
		events: {
			'submit #user_form': 'updateUser'
		},
		updateUser: function(ev){
			var $form = $(ev.target);
			var data = $form.getFormData();
			var user = this.user;
			var rejection = user.validate(data);
			if (rejection) {
				// TODO: use alertify or somewhat
				alert(rejection);
			} else {
				this.user.set(data).save();
				// close dialog
				$('#user_dialog').dialog('close');
			}
			
			return false;
		}
	});
	
	window.TodoView = Backbone.View.extend({
		initialize: function(options){
			// models
			this.todoSet = options.todoSet;
			
			this.$todo_table = $('#todo_table');
			this.$done_table = $('#done_table');
		},
		
		render: function(){
			var $todo_table = this.$todo_table,
				$done_table = this.$done_table;
			var $tmpTodo = $('<tbody>'),
				$tmpDone = $('<tbody>');
			
			_.each(this.todoSet.models, function(todo, index){
				// create <tr> by each
				var isDone = todo.attributes.isDone;
				
				if (isDone) {
					$tmpDone.append(_.template(['<tr data-todo-index="'+ index +'">',
						'<td><input type="checkbox" name="select" value="'+ index +'" /></td>',
						'<td><%= title %></td>',
						'<td><%= completeDate? _.formatDate(completeDate).replace(/ /g, "&nbsp;"): "" %></td>',
						'<td><%= summary %></td>',
						'<td>', '<button id="btn_check" class="pure-button">详细</button>', '</td>',
					'</tr>'].join(''), todo.attributes));
				} else {
					$tmpTodo.append(_.template(['<tr data-todo-index="'+ index +'">',
						'<td><input type="checkbox" name="select" value="', index, '" /></td>',
						'<td><%= title %></td>',
						'<td><%= progress %> %</td>',
						'<td><%= _.formatDate(createDate).replace(/ /g, "&nbsp;") %></td>',
						'<td><%= caution %></td>',
						'<td>', '<button id="btn_check" class="pure-button">详细</button>', '</td>',
					'</tr>'].join(''), todo.attributes));
				}
			});
			$todo_table.find('tbody').html($tmpTodo.html());
			$done_table.find('tbody').html($tmpDone.html());
		},
		
		events: {
			'click #btn_check': 'checkTodoDialog',
			'click #btn_update': 'updateTodo',
			'click #btn_delete': 'deleteTodos',
			'click #btn_complete': 'completeTodos',
			'click #btn_unmake': 'unmakeTodos',

            'submit #create_form': 'createTodo',
            'submit #check_form': 'checkTodo'
		},
		checkTodoDialog: function(ev){
			var $button = $(ev.target);
			var $tr = $button.closest('tr');
			var index = Number($tr.data('todo-index'));
            var todo = todoSet.models[index];
            // set index
            $('#check_form').find('[name="index"]').val(index);
            // set data
            $('#input_check_title').val(todo.get('title'));
            $('#input_check_progress').val(todo.get('progress'));
            $('#input_check_caution').val(todo.get('caution'));
            $('#input_check_summary').val(todo.get('summary'));

			// open dialog
            $('#check_dialog').dialog('open');
		},
		checkTodo: function(ev){
            var $form = $(ev.target);
            var data = $form.getFormData();
            var index = data.index;
            // delete key index
            delete data.index;
            var todo = todoSet.models[index];
            var tmpTodo = new Todo();
            tmpTodo.set(data);
            var rejection = todo.validate(tmpTodo.attributes);
            if (rejection) {
                alert(rejection);
            } else {
                todo.set(data);
                this.todoSet.trigger('update').save();
                // close dialog
                $form.closest('.dialog').dialog('close');
            }
		},
        createTodo: function(ev){
            var $form = $(ev.target);
            var data = $form.getFormData();
            var rejection = Todo.prototype.validate(data);
            if (rejection) {
                alert(rejection);
            } else {
                var todo = new Todo();
                todo.set(data);
                this.todoSet.add(todo).save();
                // close dialog
                $form.closest('.dialog').dialog('close');
            }
        },

        deleteTodos: function(ev){
            var selected = this.getSelectedTodos(ev);
            this.todoSet.remove(selected).save();
        },
		completeTodos: function(ev){
			this.toggleTodos(ev, true);
		},
        unmakeTodos: function(ev){
            this.toggleTodos(ev, false);
        },
        toggleTodos: function(ev, isDone){
            var selected = this.getSelectedTodos(ev);
            _.each(selected, function(todo, index){
                var data = isDone? {
                    isDone: true,
                    completeDate: new Date()
                }: {
                    isDone: false
                }
                todo.set(data);
            });

            this.todoSet.trigger('update').save();
        },
        getSelectedTodos: function(ev){
            var $button = $(ev.target);
            var $form = $button.closest('form');
            var formData = $form.getFormData();
            var indices = (function(value){
                // make array
                var arr = value? (_.isArray(value)? value: [value]): [];
                // make numbers
                return arr.map(function(x){
                    return Number(x);
                });
            })(formData.select);
            return _.filter(this.todoSet.models, function(todo, index){
                return _.contains(indices, index);
            });
        }
	});
})();
