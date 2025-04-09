// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBEq8M4nqpvcK6wvk8sJM3DJA_AAOvnFe8",
  authDomain: "todo-b6a7d.firebaseapp.com",
  projectId: "todo-b6a7d",
  storageBucket: "todo-b6a7d.firebasestorage.app",
  messagingSenderId: "352197942799",
  appId: "1:352197942799:web:5846eb13782eb9d13c4d7a",
  measurementId: "G-3S1K8FR8M3"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM elements
const authContainer = document.getElementById('auth-container');
const todoContainer = document.getElementById('todo-container');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');

// Auth state UI updates (exposed globally)
window.updateAuthUI = function(user) {
  if (user) {
    // User is signed in
    authContainer.style.display = 'none';
    todoContainer.style.display = 'block';
  } else {
    // No user signed in
    authContainer.style.display = 'block';
    todoContainer.style.display = 'none';
  }
}

// Initial UI setup
updateAuthUI(auth.currentUser);

// Login function
loginBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  
  if (!email || !password) {
    showMessage('Please enter both email and password', 'error');
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = 'Signing in...';
  
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      showMessage('Successfully signed in!', 'success');
    })
    .catch(error => {
      showMessage(error.message, 'error');
    })
    .finally(() => {
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
    });
});

// Signup function
signupBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  
  if (!email || !password) {
    showMessage('Please enter both email and password', 'error');
    return;
  }

  signupBtn.disabled = true;
  signupBtn.textContent = 'Creating account...';
  
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      showMessage('Account created successfully!', 'success');
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        showMessage('This email is already registered. Please login instead.', 'error');
      } else {
        showMessage(error.message, 'error');
      }
    })
    .finally(() => {
      signupBtn.disabled = false;
      signupBtn.textContent = 'Sign Up';
    });
});

// Show message to user
function showMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `auth-message ${type}`;
  messageDiv.textContent = message;
  
  // Remove any existing messages
  const existingMessage = document.querySelector('.auth-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  authContainer.insertBefore(messageDiv, authContainer.firstChild);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Logout function
logoutBtn.addEventListener('click', () => {
  auth.signOut();
});

