// Authentication functions
let currentUser = null;

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'flex';
}

function showLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'flex';
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            currentUser = await response.json();
            window.location.href = 'todo.html';
        } else {
            const errorDiv = document.getElementById('login-error');
            errorDiv.textContent = 'Login failed. Please check your credentials.';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    
    const errorDiv = document.getElementById('register-error');
    errorDiv.style.display = 'none';
    
    if (!username || !password) {
        errorDiv.textContent = 'Username and password are required';
        errorDiv.style.display = 'block';
        return;
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        if (response.ok && result.success) {
            errorDiv.style.display = 'none';
            const successDiv = document.getElementById('register-error');
            successDiv.className = 'success-message';
            successDiv.textContent = result.message;
            successDiv.style.display = 'block';
            setTimeout(() => {
                showLogin();
                successDiv.style.display = 'none';
                successDiv.className = 'error-message';
            }, 2000);
        } else {
            errorDiv.textContent = result.error || 'Registration failed';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
    }
}

function logout() {
    fetch('/api/auth/logout', { method: 'POST' })
        .then(() => {
            window.location.href = 'index.html';
        });
}

// Todo functions
async function loadTodos() {
    if (!currentUser) return;
    
    try {
        const response = await fetch('/api/todos');
        const todos = await response.json();
        renderTodos(todos);
    } catch (error) {
        console.error('Error loading todos:', error);
    }
}

function renderTodos(todos) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo('${todo.id}', this.checked)">
            <span class="${todo.completed ? 'completed' : ''}">${todo.text}</span>
            <button onclick="deleteTodo('${todo.id}')">Delete</button>
        `;
        todoList.appendChild(li);
    });
}

async function addTodo() {
    const text = document.getElementById('new-todo').value;
    if (!text.trim()) return;
    
    try {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text })
        });
        
        if (response.ok) {
            document.getElementById('new-todo').value = '';
            loadTodos();
        }
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

async function toggleTodo(id, completed) {
    try {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed })
        });
        
        if (response.ok) {
            loadTodos();
        }
    } catch (error) {
        console.error('Error toggling todo:', error);
    }
}

async function deleteTodo(id) {
    try {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadTodos();
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

// Check authentication on todo page load
if (window.location.pathname.endsWith('todo.html')) {
    fetch('/api/auth/check-auth')
        .then(response => {
            if (!response.ok) {
                window.location.href = 'index.html';
            } else {
                return response.json();
            }
        })
        .then(user => {
            currentUser = user;
            loadTodos();
        });
}
