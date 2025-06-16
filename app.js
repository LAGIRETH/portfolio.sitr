import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const adminUID = 'REPLACE_WITH_YOUR_ADMIN_UID';

const emailSpan = document.getElementById('user-email');
const logoutBtn = document.getElementById('logoutBtn');
const adminPanel = document.getElementById('admin-panel');
const form = document.getElementById('propertyForm');
const list = document.getElementById('propertyList');

onAuthStateChanged(auth, user => {
  if (user) {
    emailSpan.textContent = user.email;
    if (user.uid === adminUID) {
      adminPanel.classList.remove('hidden');
    }
    loadProperties();
  } else {
    window.location.href = 'index.html';
  }
});

logoutBtn.addEventListener('click', () => {
  signOut(auth);
});

form?.addEventListener('submit', async e => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const location = document.getElementById('location').value;
  const price = document.getElementById('price').value;

  await addDoc(collection(db, 'properties'), { title, location, price });
  form.reset();
  loadProperties();
});

async function loadProperties() {
  const querySnapshot = await getDocs(collection(db, 'properties'));
  list.innerHTML = '';
  querySnapshot.forEach(doc => {
    const { title, location, price } = doc.data();
    list.innerHTML += `
      <div class="bg-white p-4 rounded shadow">
        <h4 class="font-bold">${title}</h4>
        <p>${location}</p>
        <p class="text-green-700 font-semibold">$${price}</p>
      </div>`;
  });
}
