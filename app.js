// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  TwitterAuthProvider,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();

// Replace with your actual Firebase Admin UID
const adminUID = "REPLACE_WITH_ADMIN_UID";

// Login Page Logic
if (document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password)
      .then(() => window.location.href = 'dashboard.html')
      .catch(error => alert(error.message));
  });

  document.getElementById('google-login').addEventListener('click', () => {
    signInWithPopup(auth, googleProvider)
      .then(() => window.location.href = 'dashboard.html')
      .catch(error => alert(error.message));
  });

  document.getElementById('twitter-login').addEventListener('click', () => {
    signInWithPopup(auth, twitterProvider)
      .then(() => window.location.href = 'dashboard.html')
      .catch(error => alert(error.message));
  });
}

// Logout Button Logic
if (document.getElementById('logout-btn')) {
  document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = 'index.html');
  });
}

// Auth State Handling with Redirect Protection
onAuthStateChanged(auth, user => {
  const path = window.location.pathname;

  const isLoginPage = path.endsWith('/') || path.endsWith('index.html');
  const isDashboardPage = path.endsWith('dashboard.html');

  // Redirect logic
  if (user && isLoginPage) {
    window.location.href = 'dashboard.html';
    return;
  }

  if (!user && isDashboardPage) {
    window.location.href = 'index.html';
    return;
  }

  // Show email and admin controls
  if (user && document.getElementById('user-email')) {
    document.getElementById('user-email').textContent = user.email;
    if (user.uid === adminUID && document.getElementById('admin-section')) {
      document.getElementById('admin-section').classList.remove('hidden');
    }
  }
});

  
