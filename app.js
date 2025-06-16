// app.js

const loginForm = document.getElementById('login-form');
const githubLogin = document.getElementById('github-login');

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

  githubLogin.addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github'
    });
    if (error) {
      document.getElementById('error').textContent = 'GitHub login failed';
    }
  });
}

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
      div.className = 'p-4 border rounded shadow';
      div.innerHTML = `
        <h3 class="text-xl font-bold">${p.title}</h3>
        <p><strong>Location:</strong> ${p.location}</p>
        <p><strong>Price:</strong> $${p.price}</p>
        <img src="${p.image}" class="max-w-xs my-2">
        <p>${p.description}</p>
        <button onclick="deleteProperty(${p.id})" class="bg-red-500 text-white px-4 py-2 mt-2 rounded">Delete</button>
      `;
      container.appendChild(div);
    });
  }

  window.deleteProperty = function (id) {
    let properties = JSON.parse(localStorage.getItem('properties'));
    properties = properties.filter(p => p.id !== id);
    localStorage.setItem('properties', JSON.stringify(properties));
    renderProperties();
  };

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
  });

  renderProperties();
}
