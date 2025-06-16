// app.js

// DOM Elements
const loginForm = document.getElementById('login-form');
const passwordInput = document.getElementById('password');
const errorDiv = document.getElementById('error');
const githubLoginBtn = document.getElementById('github-login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Supabase GitHub Login
if (githubLoginBtn || signupBtn) {
  const githubAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' });
    if (error) console.error('GitHub Auth Error:', error.message);
  };

  if (githubLoginBtn) githubLoginBtn.addEventListener('click', githubAuth);
  if (signupBtn) signupBtn.addEventListener('click', githubAuth);
}

// Hardcoded Admin Login
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = passwordInput.value.trim();
    if (password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      window.location.href = 'dashboard.html';
    } else {
      errorDiv.textContent = 'Invalid admin password.';
    }
  });
}

// Dark Mode Toggle
if (darkModeToggle) {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'enabled') document.body.classList.add('dark');

  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
  });
}

// Dashboard Logic
if (window.location.pathname.includes('dashboard.html')) {
  if (!localStorage.getItem('isAdmin')) window.location.href = 'index.html';

  const form = document.getElementById('property-form');
  const propertyList = document.getElementById('properties');

  const loadProperties = () => {
    return JSON.parse(localStorage.getItem('properties') || '[]');
  };

  const saveProperties = (properties) => {
    localStorage.setItem('properties', JSON.stringify(properties));
  };

  const renderProperties = () => {
    const properties = loadProperties();
    propertyList.innerHTML = '';
    properties.forEach((p) => {
      const div = document.createElement('div');
      div.className = 'property-card';
      div.innerHTML = `
        <img src="${p.image}" alt="${p.title}" />
        <div class="property-info">
          <h3>${p.title}</h3>
          <p><strong>Location:</strong> ${p.location}</p>
          <p><strong>Price:</strong> $${p.price}</p>
          <p>${p.description}</p>
          <div class="btn-group">
            <button onclick="editProperty(${p.id})">Edit</button>
            <button onclick="deleteProperty(${p.id})" class="danger">Delete</button>
            <a href="property.html?id=${p.id}" class="view-link" target="_blank">View</a>
          </div>
        </div>
      `;
      propertyList.appendChild(div);
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
      description: document.getElementById('description').value,
    };
    const properties = loadProperties();
    properties.push(newProperty);
    saveProperties(properties);
    form.reset();
    renderProperties();
  });

  window.editProperty = (id) => {
    const properties = loadProperties();
    const p = properties.find((x) => x.id === id);
    if (!p) return;
    document.getElementById('title').value = p.title;
    document.getElementById('location').value = p.location;
    document.getElementById('price').value = p.price;
    document.getElementById('image').value = p.image;
    document.getElementById('description').value = p.description;
    deleteProperty(id);
  };

  window.deleteProperty = (id) => {
    let properties = loadProperties();
    properties = properties.filter((x) => x.id !== id);
    saveProperties(properties);
    renderProperties();
  };

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('isAdmin');
      window.location.href = 'index.html';
    });
  }

  renderProperties();
}

// Property Detail View (property.html)
if (window.location.pathname.includes('property.html')) {
  const id = new URLSearchParams(window.location.search).get('id');
  const property = JSON.parse(localStorage.getItem('properties') || '[]').find(p => p.id == id);
  const container = document.getElementById('property-detail');

  if (property && container) {
    container.innerHTML = `
      <div class="property-detail-card">
        <img src="${property.image}" alt="${property.title}" />
        <div class="details">
          <h2>${property.title}</h2>
          <p><strong>Location:</strong> ${property.location}</p>
          <p><strong>Price:</strong> $${property.price}</p>
          <p>${property.description}</p>
        </div>
      </div>
    `;
  } else if (container) {
    container.innerHTML = `<p class="error-msg">Property not found.</p>`;
  }
}
