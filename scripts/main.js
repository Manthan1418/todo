import { auth } from './firebase-config.js';
import { loginUser, registerUser, showRegister, showLogin } from './auth.js';
import { getTodosQuery, renderTodos } from './todos.js';

// Global references
window.auth = auth;
window.db = firebase.firestore();

// Expose functions to HTML
window.login = async function() {
    const email = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    
    try {
        await loginUser(email, password);
        window.location.href = 'todo.html';
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
};

window.register = async function() {
    const email = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const errorDiv = document.getElementById('register-error');
    
    try {
        await registerUser(email, password);
        errorDiv.textContent = 'Registration successful!';
        errorDiv.style.display = 'block';
        setTimeout(showLogin, 2000);
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
};

window.logout = async function() {
    try {
        await auth.signOut();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
};

// Todo functions
window.addTodo = async function() {
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
};

window.toggleTodo = async function(id, completed) {
    try {
        await updateTodoItem(auth.currentUser.uid, id, { completed });
    } catch (error) {
        console.error('Error toggling todo:', error);
    }
};

window.deleteTodo = async function(id) {
    try {
        await deleteTodoItem(auth.currentUser.uid, id);
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
};

// Auth state listener
auth.onAuthStateChanged((user) => {
    if (window.location.pathname.endsWith('todo.html')) {
        if (!user) {
            window.location.href = 'index.html';
        } else {
            getTodosQuery(user.uid).onSnapshot((snapshot) => {
                const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                renderTodos(todos);
            });
        }
    }
});
