(function(){
	window.System = Backbone.Model.extend({
		defaults: {
			date: null
		},
		initialize: function(){
		    this.set({
                date: new Date()
            });
		}
	});
	
	window.User = Backbone.Model.extend({
		defaults: {
			nickname: ''
		},
		initialize: function(){
			var fetchOK = this.fetch();
			if (! fetchOK) {
				// first time
				var names = ['米老鼠', '白雪公主', '孙悟空', '多啦A梦', '奥特曼'];
				var userData = {
					nickname: names[Math.floor(Math.random() * names.length)]
				}
				this.set(userData).save();
			}
		},
		validate: function(attrs){
			try {
				// overwrite attrs
				var nickname = attrs.nickname = '' + attrs.nickname;
			
				if (! nickname) {
					return '昵称不能为空';
				}
				if (_.strWidth(nickname) > 18) {
					return '昵称过长';
				}
			} catch (err) {
				return err.message;
			}
		},
		// overwrite
		fetch: function(){
			// read from local storage
			var userData = store.get('user');
			if (! this.validate(userData)) {
				this.set(userData);
				// return true when successfully fetched
				return true;
			}
		},
		// overwrite
		save: function(){
			var userData = this.attributes;
			// save to local storage
			store.set('user', userData);
		}
	});
	
	window.Todo = Backbone.Model.extend({
		defaults: {
			title: '[ 代办事项 ]',
			progress: 0.0,
			createDate: null,
			caution: '',
			completeDate: null,
			summary: '',
			isDone: false
		},
		initialize: function(){
			// create date
			this.set({
				createDate: new Date()
			});
		},
		validate: function(attrs){
			try {
				// overwrite attrs
				var title = attrs.title = attrs.title? '' + attrs.title: '',
					progress = attrs.progress = (function(value){
						value = Number(value);
						return isNaN(value)? 0: value;
					})(attrs.progress),
					createDate = attrs.createDate = createDate? new Date(attrs.createDate): new Date(),
					caution = attrs.caution = attrs.caution? '' + attrs.caution: attrs.caution,
					completeDate = attrs.completeDate = (function(value){
						return value? new Date(value) : null;
					})(attrs.completeDate),
					summary = attrs.summary = attrs.summary? '' + attrs.summary: '',
					isDone = attrs.isDone = !! attrs.isDone;
				
				if (! title) {
					return '标题不能为空';
				}
				if (_.strWidth(title) > 20) {
					return '标题过长';
				}
				if (progress < 0 || progress > 100) {
					return '进度无效';
				}
				if (createDate.getTime() > Date.now()) {
					return '新增日期无效';
				}
				if (isDone && completeDate && completeDate.getTime() > Date.now()) {
					return '完成日期无效';
				}
			} catch (err) {
				return err.message;
			}
		}
	});
})();
