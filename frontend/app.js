// Lightweight state container for the logged in user.
const session = {
  token: null,
  setToken(value) {
    this.token = value;
    const status = document.getElementById('token-status');
    if (value) {
      status.textContent = 'Authenticated';
      document.getElementById('todo-section').hidden = false;
    } else {
      status.textContent = 'Not authenticated';
      document.getElementById('todo-section').hidden = true;
    }
  },
};

// Utility for printing status messages without relying on dev tools.
function log(message) {
  const consoleOutput = document.getElementById('console-output');
  const timestamp = new Date().toLocaleTimeString();
  consoleOutput.textContent = `[${timestamp}] ${message}\n` + consoleOutput.textContent;
}

// Base URL of the NestJS API. When running both on the same machine, CORS is
// not required because we open this file straight from disk. If you host the
// front-end elsewhere, make sure to configure CORS on the backend.
const API_BASE = 'http://localhost:' + (window.API_PORT || 8888);

async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (session.token) {
    headers.set('Authorization', `Bearer ${session.token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Surface backend validation errors in the UI instead of failing silently.
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || response.statusText);
  }

  // Some endpoints (e.g. register) return JSON payloads we want to inspect.
  return response.json().catch(() => null);
}

// --- Registration ---------------------------------------------------------

document.getElementById('register-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const user = await apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    log(`Registered ${user.email}`);
  } catch (error) {
    log(`Registration failed: ${error.message}`);
  }
});

// --- Login ----------------------------------------------------------------

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const { access_token } = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    session.setToken(access_token);
    log('Logged in successfully.');
  } catch (error) {
    session.setToken(null);
    log(`Login failed: ${error.message}`);
  }
});

// --- Todos ----------------------------------------------------------------

document.getElementById('todo-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = document.getElementById('todo-message').value;
  const date = document.getElementById('todo-date').value;

  try {
    await apiRequest('/todos', {
      method: 'POST',
      body: JSON.stringify({ message, date }),
    });
    log('Todo created. Refreshing list...');
    await refreshTodos();
    event.target.reset();
  } catch (error) {
    log(`Failed to create todo: ${error.message}`);
  }
});

async function refreshTodos() {
  if (!session.token) {
    log('Cannot fetch todos: please log in first.');
    return;
  }

  try {
    const todos = await apiRequest('/todos');
    const list = document.getElementById('todo-list');
    list.innerHTML = '';

    if (!todos.length) {
      list.innerHTML = '<li>No todos yet.</li>';
      return;
    }

    for (const todo of todos) {
      // Template literal keeps rendering straightforward without libraries.
      const item = document.createElement('li');
      item.innerHTML = `
        <h3>${todo.message}</h3>
        <p><strong>Date:</strong> ${new Date(todo.date).toLocaleDateString()}</p>
        <p><strong>Cat fact:</strong> ${todo.catFact}</p>
      `;
      list.appendChild(item);
    }
  } catch (error) {
    log(`Failed to fetch todos: ${error.message}`);
  }
}

document.getElementById('refresh-todos').addEventListener('click', refreshTodos);

// Immediately show whether we have an existing token from a previous session.
session.setToken(null);
