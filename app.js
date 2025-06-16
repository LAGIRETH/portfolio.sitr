// app.js

document.addEventListener('DOMContentLoaded', () => {
  // Authentication Elements
  const loginForm = document.getElementById('login-form');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('error');
  const githubLoginBtn = document.getElementById('github-login-btn');
  const signupBtn = document.getElementById('signup-btn');

  // Property Management Elements
  const form = document.getElementById('property-form');
  const container = document.getElementById('properties');
  const logoutBtn = document.getElementById('logout');

  // GitHub Auth
  if (signupBtn) {
    signupBtn.addEventListener('click', async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'github' });
      if (error) console.error('GitHub signup error:', error);
    });
  }

  if (githubLoginBtn) {
    githubLoginBtn.addEventListener('click', async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'github' });
      if (error) console.error('GitHub login error:', error);
    });
  }

  // Hardcoded Password Login
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const password = passwordInput.value.trim();
      if (password === 'admin123') {
        localStorage.setItem('isAdmin', 'true');
        window.location.href = 'dashboard.html';
      } else {
        errorMessage.textContent = 'Invalid password';
        errorMessage.style.color = 'red';
      }
    });
  }

  // Admin Panel Auth Guard
  if (window.location.pathname.includes('dashboard.html')) {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      window.location.href = 'index.html';
    }

    // Render existing properties
    renderProperties();

    // Add Property
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const newProperty = {
        id: Date.now(),
        title: document.getElementById('title').value.trim(),
        location: document.getElementById('location').value.trim(),
        price: document.getElementById('price').value.trim(),
        image: document.getElementById('image').value.trim(),
        description: document.getElementById('description').value.trim()
      };
      const properties = JSON.parse(localStorage.getItem('properties') || '[]');
      properties.push(newProperty);
      localStorage.setItem('properties', JSON.stringify(properties));
      form.reset();
      renderProperties();
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('isAdmin');
      window.location.href = 'index.html';
    });
  }

  // Render function
  function renderProperties() {
    if (!container) return;
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    container.innerHTML = '';

    if (properties.length === 0) {
      container.innerHTML = '<p>No properties added yet.</p>';
      return;
    }

    properties.forEach(p => {
      const div = document.createElement('div');
      div.classList.add('property-card');
      div.innerHTML = `
        <img src="${p.image}" alt="${p.title}" class="property-image" />
        <div class="property-details">
          <h3>${p.title}</h3>
          <p><strong>Location:</strong> ${p.location}</p>
          <p><strong>Price:</strong> $${p.price}</p>
          <p>${p.description}</p>
          <div class="property-actions">
            <button onclick="editProperty(${p.id})">Edit</button>
            <button onclick="deleteProperty(${p.id})">Delete</button>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
  }

  // Edit & Delete exposed globally
  window.deleteProperty = function (id) {
    let properties = JSON.parse(localStorage.getItem('properties'));
    properties = properties.filter(p => p.id !== id);
    localStorage.setItem('properties', JSON.stringify(properties));
    renderProperties();
  }

  window.editProperty = function (id) {
    const properties = JSON.parse(localStorage.getItem('properties'));
    const property = properties.find(p => p.id === id);
    if (!property) return;
    document.getElementById('title').value = property.title;
    document.getElementById('location').value = property.location;
    document.getElementById('price').value = property.price;
    document.getElementById('image').value = property.image;
    document.getElementById('description').value = property.description;
    deleteProperty(id);
  }
});
