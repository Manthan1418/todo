import { db } from './firebase-config.js';

// Firestore operations
export async function addTodoItem(userId, todoData) {
    return db.collection('users').doc(userId).collection('todos').add(todoData);
}

export async function updateTodoItem(userId, todoId, updates) {
    return db.collection('users').doc(userId).collection('todos').doc(todoId).update(updates);
}

export async function deleteTodoItem(userId, todoId) {
    return db.collection('users').doc(userId).collection('todos').doc(todoId).delete();
}

export function getTodosQuery(userId) {
    return db.collection('users').doc(userId).collection('todos')
             .orderBy('createdAt', 'desc');
}

// Todo UI Functions
export function renderTodos(todos) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="window.toggleTodo('${todo.id}', this.checked)">
            <span class="${todo.completed ? 'completed' : ''}">${todo.text}</span>
            <button onclick="window.deleteTodo('${todo.id}')">Delete</button>
        `;
        todoList.appendChild(li);
    });
}
