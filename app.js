// Handle admin login
const loginForm = document.getElementById('login-form');
const signupBtn = document.getElementById('signup-btn');
const githubLoginBtn = document.getElementById('github-login-btn');

if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
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

if (signupBtn) {
  signupBtn.addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' });
    if (error) console.error('GitHub sign-up error:', error.message);
  });
}

if (githubLoginBtn) {
  githubLoginBtn.addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' });
    if (error) console.error('GitHub login error:', error.message);
  });
}

// Dashboard logic
if (window.location.pathname.includes('dashboard.html')) {
  const isAdmin = localStorage.getItem('isAdmin');
  if (!isAdmin) window.location.href = 'index.html';

  const form = document.getElementById('property-form');
  const container = document.getElementById('properties');
  const logoutBtn = document.getElementById('logout');

  form.addEventListener('submit', function (e) {
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

  function renderProperties() {
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    container.innerHTML = '';
    properties.forEach(p => {
      const div = document.createElement('div');
      div.innerHTML = `
        <h3>${p.title}</h3>
        <p><strong>Location:</strong> ${p.location}</p>
        <p><strong>Price:</strong> $${p.price}</p>
        <img src="${p.image}" alt="Property Image">
        <p>${p.description}</p>
        <button onclick="editProperty(${p.id})">Edit</button>
        <button onclick="deleteProperty(${p.id})">Delete</button>
      `;
      container.appendChild(div);
    });
  }

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

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
  });

  renderProperties();
}
