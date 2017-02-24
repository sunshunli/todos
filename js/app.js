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
            editedTodo: null
        },

        watch: {
            todos: {
                handler: todoStorage.save,
                deep: true
            }
        },

        methods: {
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





})(window);
