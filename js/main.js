/**
 * Main JS - Handles Login, Dashboard, and Data Fetching
 */

const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
  const loginSection = document.getElementById('login-section');
  const dashboardSection = document.getElementById('dashboard-section');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const userInfo = document.getElementById('user-info');
  const studentNameDisplay = document.getElementById('student-name-display');
  const btnLogout = document.getElementById('btnLogout');
  const welcomeText = document.getElementById('welcome-text');

  const mainMenu = document.getElementById('mainMenu');
  const contentView = document.getElementById('content-view');
  const contentTitle = document.getElementById('content-title');
  const contentList = document.getElementById('content-list');
  const btnBackToMenu = document.getElementById('btnBackToMenu');

  // Check login state on load
  const token = localStorage.getItem('token');
  if (token) {
    fetchUserData();
  }

  // --- Auth Handlers ---

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
      loginError.textContent = 'Logging in...';
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('student', JSON.stringify(data.student));
      
      loginError.textContent = '';
      showDashboard(data.student);
    } catch (err) {
      loginError.textContent = err.message;
    }
  });

  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    showLogin();
  });

  async function fetchUserData() {
    try {
      const res = await fetch(`${API_BASE}/me`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Token invalid');
      const student = await res.json();
      localStorage.setItem('student', JSON.stringify(student));
      showDashboard(student);
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('student');
      showLogin();
    }
  }

  function showLogin() {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    userInfo.classList.add('hidden');
  }

  function showDashboard(student) {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    userInfo.classList.remove('hidden');
    
    studentNameDisplay.textContent = student.name || student.username;
    welcomeText.textContent = `Welcome, ${student.name || student.username}!`;
    
    // Reset view to main menu
    mainMenu.classList.remove('hidden');
    contentView.classList.add('hidden');
  }

  // --- Menu Handlers ---

  document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('click', () => {
      const view = card.getAttribute('data-view');
      loadContent(view);
    });
  });

  btnBackToMenu.addEventListener('click', () => {
    contentView.classList.add('hidden');
    mainMenu.classList.remove('hidden');
  });

  async function loadContent(viewType) {
    mainMenu.classList.add('hidden');
    contentView.classList.remove('hidden');
    contentList.innerHTML = '<p>Loading...</p>';
    
    let title = '';
    let endpoint = '';
    
    if (viewType === 'materials') {
      title = 'Study Materials';
      endpoint = '/materials';
    } else if (viewType === 'daily-tasks') {
      title = 'Daily Tasks';
      endpoint = '/daily-tasks';
    } else if (viewType === 'homeworks') {
      title = 'Homework Projects';
      endpoint = '/homeworks';
    }
    
    contentTitle.textContent = title;
    
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to load data');
      const data = await res.json();
      
      contentList.innerHTML = '';
      if (data.length === 0) {
        contentList.innerHTML = '<p>No data available yet.</p>';
        return;
      }
      
      data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'content-item';
        div.innerHTML = `
          <h3 style="margin-bottom: 0.5rem;">${item.title}</h3>
          <p style="color: #64748b; font-size: 0.95rem;">${item.content || item.description || ''}</p>
          ${viewType === 'daily-tasks' ? `<button class="btn-choose-hw" style="margin-top: 1rem;" onclick="startTask(${item.id})">Start Task</button>` : ''}
          ${viewType === 'homeworks' ? `<a href="homework/homework-${item.id}/index.html" class="btn-choose-hw" style="display:inline-flex; margin-top: 1rem;">Open Homework</a>` : ''}
        `;
        contentList.appendChild(div);
      });
      
    } catch (err) {
      contentList.innerHTML = `<p style="color: red;">Error: ${err.message}</p>`;
    }
  }

});

// Global function for daily task button (Example)
window.startTask = async function(taskId) {
  alert(`Starting Daily Task ID: ${taskId}\nThe system will record your progress.`);
  // Here we would ideally open the quiz UI and then submit the log to /api/daily-tasks/:taskId/log
};
