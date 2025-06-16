// app.js
import { supabase } from './supabase-config.js';

// Elements
const loginForm = document.getElementById('login-form');
const githubLoginBtn = document.getElementById('github-login-btn');
const signupBtn = document.getElementById('signup-btn');

// Handle admin login with hardcoded password
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    if (password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      window.location.href = 'dashboard.html';
    } else {
      document.getElementById('error').textContent = 'Invalid password';
    }
  });
}

// GitHub OAuth signup/login via Supabase
const handleOAuthLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  });
  if (error) {
    console.error('GitHub login failed:', error.message);
    alert('GitHub login failed.');
  }
};

if (signupBtn) signupBtn.addEventListener('click', handleOAuthLogin);
if (githubLoginBtn) githubLoginBtn.addEventListener('click', handleOAuthLogin);

// DASHBOARD Page Logic
if (window.location.pathname.includes('dashboard.html')) {
  const isAdmin = localStorage.getItem('isAdmin');
  if (!isAdmin) {
    window.location.href = 'index.html';
  }

  const form = document.getElementById('property-form');
  const container = document.getElementById('properties');
  const logoutBtn = document.getElementById('logout');

  const renderProperties = () => {
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    container.innerHTML = '';
    properties.forEach((p) => {
      const div = document.createElement('div');
      div.classList.add('property-card');
      div.innerHTML = `
        <div class="border p-4 rounded-md shadow-md bg-white text-gray-800 mb-4">
          <h3 class="text-xl font-semibold">${p.title}</h3>
          <p><strong>Location:</strong> ${p.location}</p>
          <p><strong>Price:</strong> $${p.price}</p>
          <img src="${p.image}" class="my-2 max-w-xs rounded-md shadow-sm">
          <p>${p.description}</p>
          <div class="mt-2 space-x-2">
            <button onclick="editProperty(${p.id})" class="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
            <button onclick="deleteProperty(${p.id})" class="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newProperty = {
      id: Date.now(),
      title: document.getElementById('title').value,
      location: document.getElementById('location').value,
      price: document.getElementById('price').value,
      image: document.getElementById('image').value,
      description: document.getElementById('description').value
    };
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    properties.push(newProperty);
    localStorage.setItem('properties', JSON.stringify(properties));
    form.reset();
    renderProperties();
  });

  window.editProperty = (id) => {
    const properties = JSON.parse(localStorage.getItem('properties'));
    const property = properties.find(p => p.id === id);
    if (!property) return;
    document.getElementById('title').value = property.title;
    document.getElementById('location').value = property.location;
    document.getElementById('price').value = property.price;
    document.getElementById('image').value = property.image;
    document.getElementById('description').value = property.description;
    window.deleteProperty(id); // remove old entry
  };

  window.deleteProperty = (id) => {
    let properties = JSON.parse(localStorage.getItem('properties'));
    properties = properties.filter(p => p.id !== id);
    localStorage.setItem('properties', JSON.stringify(properties));
    renderProperties();
  };

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
  });

  // Initial render
  renderProperties();
}
