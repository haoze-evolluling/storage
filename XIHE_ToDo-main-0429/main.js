// 羲和 - 待办事项管理应用 JavaScript

// DOM 元素
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const themeToggle = document.getElementById('theme-toggle');
const timeDisplay = document.getElementById('time-display');
const timeElement = timeDisplay.querySelector('.time');
const dateElement = timeDisplay.querySelector('.date');

// 初始化主题
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
}

// 更新时间显示
function updateTime() {
  const now = new Date();
  
  // 格式化时间 (时:分:秒)
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  timeElement.textContent = `${hours}:${minutes}:${seconds}`;
  
  // 格式化日期 (年-月-日 星期几)
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekday = weekdays[now.getDay()];
  dateElement.textContent = `${year}-${month}-${day} ${weekday}`;
}

// 切换主题
function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// 添加新的待办事项
function addTodo(e) {
  e.preventDefault();
  const todoText = todoInput.value.trim();
  
  if (todoText) {
    createTodoItem(todoText);
    saveTodos();
    todoInput.value = '';
  }
}

// 创建待办事项元素
function createTodoItem(text, completed = false) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  if (completed) li.classList.add('completed');
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;
  checkbox.addEventListener('change', toggleComplete);
  
  const label = document.createElement('label');
  label.textContent = text;
  
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = '&times;';
  deleteBtn.addEventListener('click', deleteTodo);
  
  li.appendChild(checkbox);
  li.appendChild(label);
  li.appendChild(deleteBtn);
  todoList.appendChild(li);
}

// 切换完成状态
function toggleComplete() {
  const todoItem = this.parentElement;
  todoItem.classList.toggle('completed');
  saveTodos();
}

// 删除待办事项
function deleteTodo() {
  const todoItem = this.parentElement;
  todoItem.remove();
  saveTodos();
}

// 保存待办事项到本地存储
function saveTodos() {
  const todos = [];
  document.querySelectorAll('.todo-item').forEach(item => {
    todos.push({
      text: item.querySelector('label').textContent,
      completed: item.classList.contains('completed')
    });
  });
  localStorage.setItem('todos', JSON.stringify(todos));
}

// 从本地存储加载待办事项
function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.forEach(todo => {
    createTodoItem(todo.text, todo.completed);
  });
}

// 事件监听器
todoForm.addEventListener('submit', addTodo);
themeToggle.addEventListener('click', toggleTheme);

// 初始化应用
function initApp() {
  initTheme();
  loadTodos();
  updateTime();
  setInterval(updateTime, 1000); // 每秒更新一次时间
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);