// Todo App Functionality
let todosRef;
let unsubscribe;

// Get UI update function from auth.js (loaded via script tag)
const updateAuthUI = window.updateAuthUI;

function loadTodos() {
  const user = firebase.auth().currentUser;
  if (user) {
    // Clean up any existing listener first
    if (unsubscribe) {
      unsubscribe();
    }
    
    todosRef = firebase.firestore()
      .collection('users')
      .doc(user.uid)
      .collection('todos');
    
    unsubscribe = todosRef
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const todoList = document.getElementById('todo-list');
        // Store current scroll position
        const scrollPos = todoList.scrollTop;
        todoList.innerHTML = '';
        
        // Use Set to track rendered todos and prevent duplicates
        const renderedIds = new Set();
        snapshot.forEach(doc => {
          if (!renderedIds.has(doc.id)) {
            renderedIds.add(doc.id);
            const todo = doc.data();
            renderTodo(doc.id, todo.text, todo.completed);
          }
        });

        if (snapshot.empty) {
          todoList.innerHTML = '<li class="empty-state">No todos yet. Add one above!</li>';
        }
        // Restore scroll position
        todoList.scrollTop = scrollPos;
      }, error => {
        console.error('Todo listener error:', error);
      });
  }
}

function setupTodoHandlers() {
  const newTodoInput = document.getElementById('new-todo');
  const addBtn = document.getElementById('add-btn');

  addBtn.addEventListener('click', () => {
    const text = newTodoInput.value.trim();
    if (text && todosRef) {
      todosRef.add({
        text: text,
        completed: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        newTodoInput.value = '';
      });
    }
  });

  newTodoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBtn.click();
  });
}

function renderTodo(id, text, completed) {
  const todoList = document.getElementById('todo-list');
  const li = document.createElement('li');
  li.className = `todo-item ${completed ? 'completed' : ''}`;
  
  li.innerHTML = `
    <input type="checkbox" ${completed ? 'checked' : ''}>
    <span>${text}</span>
    <button class="delete-btn">×</button>
  `;

  li.querySelector('input').addEventListener('change', (e) => {
    todosRef.doc(id).update({ completed: e.target.checked });
  });

  li.querySelector('.delete-btn').addEventListener('click', () => {
    todosRef.doc(id).delete();
  });

  todoList.appendChild(li);
}

// Initialize when auth state changes
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    updateAuthUI(user);
    loadTodos();
    setupTodoHandlers();
  } else {
    updateAuthUI(null);
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    todosRef = null;
  }
});
