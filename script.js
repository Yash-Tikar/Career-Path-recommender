import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA2a2Y-EYY_jzkCK1EPrVphKIsTGsR8j3U",
  authDomain: "career-path-recommender-52ae0.firebaseapp.com",
  projectId: "career-path-recommender-52ae0",
  storageBucket: "career-path-recommender-52ae0.firebasestorage.app",
  messagingSenderId: "226020568146",
  appId: "1:226020568146:web:1fa8a00f2d276f7929838b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.register = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("message");

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      msg.style.color = "green";
      msg.innerText = "Registration successful!";
    })
    .catch(error => {
      msg.style.color = "red";
      msg.innerText = error.message;
    });
};

window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("message");

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
  msg.style.color = "green";
  msg.innerText = "Login successful! Redirecting...";

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1000); // 1 second delay
})

    .catch(error => {
      msg.style.color = "red";
      msg.innerText = error.message;
    });
};

window.showLogin = function () {
  document.getElementById("form-title").innerText = "Login";
  document.getElementById("username").style.display = "none";
  document.getElementById("submitBtn").innerText = "Login";
  document.getElementById("submitBtn").onclick = login;
};
