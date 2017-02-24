(function (window) {
	'use strict';

    // 定义本地存储方法，保存输入信息
    var STORAGE_KEY = 'todos-vuejs';
    var todoStorage = {
        // 获取当前本地存储中的数据，以数组形式返回，如果本地存储中没有数据，
        // localStorage.getItem(STORAGE_KEY)将返回null；因此参数可以用||来给出一个空数组
        fetch: function() {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        },
        // 将输入数据保存到本地存储
        save: function(todos) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        }
    };

    var filters = {
        all: function(todos) {
            return todos;
        },
        active: function(todos) {
            return todos.filter(function (obj) {
                return !obj.completed;
            });
        },
        completed: function (todos) {
            return todos.filter(function (obj) {
                return obj.completed;
            });
        }
    };

    // 创建Vue的根实例
    var app = new Vue({
        // 使用Vue管理class='todoapp'的代码段
        el: '.todoapp',

        // Vue的数据
        data: {
            // 本地存储中以前存储的数据
            todos: todoStorage.fetch(),
            // 新输入的数据
            newTodo: '',
            editedTodo: null,
            visibility: 'all'
        },

        watch: {
            todos: {
                handler: todoStorage.save,
                deep: true
            }
        },

        computed : {
            filteredTodos: function () {
                return filters[this.visibility](this.todos);
            },

            remaining: function(){
                var tmpTodos = this.todos.filter(function(obj) {
                    return !obj.completed;
                });
                return tmpTodos.length;
            },

            allDone: {
                get: function () {
                    return this.remaining === 0;
                },
                set: function (value) {
                    this.todos.forEach(function (obj) {
                        obj.completed = value;
                    });
                }
            }
        },

        methods: {
            pluralize: function(word, count) {
                return word + (count === 1 ? '' : 's');
            },

            /**
            * 将输入的数据保存到本地存储
             */
            addTodo: function() {
                // 去除输入数据前后空格
                var value = this.newTodo.trim();
                if (!value) {
                    return;
                }
                // 将输入数据保存到本地存储
                this.todos.push({title: value, completed: false});
                // 在UI上清空输入数据
                this.newTodo = '';
            },

            removeTodo: function(todo) {
                var index = this.todos.indexOf(todo);
                this.todos.splice(index, 1);
            },

            editTodo: function(todo) {
                this.beforeEditCache = todo.title;
                this.editedTodo = todo;
            },

            cancelEdit: function(todo) {
                this.editedTodo = null;
                todo.title = this.beforeEditCache;
            },

            doneEdit: function(todo) {
                this.editedTodo = null;
                todo.title = todo.title.trim();
                if (!todo.title) {
                    this.removeTodo(todo);
                }
            },

            removeCompleted: function () {
                this.todos = filters.active(this.todos);
            }
        },

        // 新建指令,使元素自动获取焦点
        directives: {
            'todo-focus': function(el, binding) {
                if (binding.value) {
                    el.focus();
                }
            }
        }

    });

    var onHashChange = function () {
        var hash = location.hash.replace(/#\/?/, '');
        if (filters[hash]) {
            app.visibility = hash;
        } else {
            app.visibility = 'all';
            location.hash = '';
        }
    };

    window.onhashchange = onHashChange;



})(window);
