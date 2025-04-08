// Global variables
let currentUser = null;

// Use Firebase services from global scope
const auth = window.auth;
const db = window.db;
const firebase = window.firebase;

// Authentication functions
async function loginUser(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
}

async function registerUser(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
}

async function logoutUser() {
    return auth.signOut();
}

// Firestore helper functions
async function addTodoItem(userId, todoData) {
    return db.collection('users').doc(userId).collection('todos').add(todoData);
}

async function updateTodoItem(userId, todoId, updates) {
    return db.collection('users').doc(userId).collection('todos').doc(todoId).update(updates);
}

async function deleteTodoItem(userId, todoId) {
    return db.collection('users').doc(userId).collection('todos').doc(todoId).delete();
}

function getTodosQuery(userId) {
    return db.collection('users').doc(userId).collection('todos')
             .orderBy('createdAt', 'desc');
}

// UI Functions
function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'flex';
}

function showLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'flex';
}

// Authentication Functions
async function login() {
    const email = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    
    try {
        const userCredential = await loginUser(email, password);
        currentUser = userCredential.user;
        window.location.href = 'todo.html';
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
}

async function register() {
    const email = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const errorDiv = document.getElementById('register-error');
    errorDiv.style.display = 'none';
    
    if (!email || !password) {
        errorDiv.textContent = 'Email and password are required';
        errorDiv.style.display = 'block';
        return;
    }

    try {
        const userCredential = await registerUser(email, password);
        errorDiv.style.display = 'none';
        const successDiv = document.getElementById('register-error');
        successDiv.className = 'success-message';
        successDiv.textContent = 'Registration successful!';
        successDiv.style.display = 'block';
        setTimeout(() => {
            showLogin();
            successDiv.style.display = 'none';
            successDiv.className = 'error-message';
        }, 2000);
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
}

async function logout() {
    try {
        await auth.signOut();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Todo Functions
function loadTodos() {
    if (!auth.currentUser) return;
    
    getTodosQuery(auth.currentUser.uid).onSnapshot((querySnapshot) => {
        const todos = [];
        querySnapshot.forEach((doc) => {
            todos.push({ id: doc.id, ...doc.data() });
        });
        renderTodos(todos);
    });
}

function renderTodos(todos) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo('${todo.id}', this.checked)">
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
        await addTodoItem(auth.currentUser.uid, {
            text: text.trim(),
            completed: false,
            createdAt: new Date()
        });
        document.getElementById('new-todo').value = '';
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

async function toggleTodo(id, completed) {
    try {
        await updateTodoItem(auth.currentUser.uid, id, {
            completed: completed
        });
    } catch (error) {
        console.error('Error toggling todo:', error);
    }
}

async function deleteTodo(id) {
    try {
        await deleteTodoItem(auth.currentUser.uid, id);
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

// Auth state listener
auth.onAuthStateChanged((user) => {
    if (window.location.pathname.endsWith('todo.html')) {
        if (!user) {
            window.location.href = 'index.html';
        } else {
            currentUser = user;
            loadTodos();
        }
    }
});
