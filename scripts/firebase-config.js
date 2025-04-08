// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: "AIzaSyBEq8M4nqpvcK6wvk8sJM3DJA_AAOvnFe8",
  authDomain: "todo-b6a7d.firebaseapp.com",
  projectId: "todo-b6a7d",
  storageBucket: "todo-b6a7d.appspot.com",
  messagingSenderId: "352197942799",
  appId: "1:352197942799:web:5846eb13782eb9d13c4d7a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export services
const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
