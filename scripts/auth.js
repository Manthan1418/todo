import { auth } from './firebase-config.js';

// Authentication functions
export async function loginUser(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
}

export async function registerUser(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
}

export async function logoutUser() {
    return auth.signOut();
}

// UI Functions
export function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'flex';
}

export function showLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'flex';
}
