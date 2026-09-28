/**
 * Main JS - Handles Login, Dashboard, Materials, Daily Tasks, Exams
 */

const API_BASE = '/api';
let activeExamId = null;

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

  // Anti-cheat visibility listener for Exams
  document.addEventListener('visibilitychange', () => {
    if (activeExamId && document.hidden) {
      alert('EXAM VIOLATION: You switched tabs or minimized the browser! The exam has been terminated.');
      fetch(`${API_BASE}/exams/${activeExamId}/terminate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      activeExamId = null;
      loadContent('exams');
    }
  });

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
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('student', JSON.stringify(data.student));
      
      if (data.student.role === 'admin') {
          window.location.href = 'admin.html';
          return;
      }
      
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
      
      if (student.role === 'admin') window.location.href = 'admin.html';
      else showDashboard(student);
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
    if (activeExamId) {
       const confirmLeave = confirm("Exam in progress! Leaving will terminate your session. Continue?");
       if (!confirmLeave) return;
       activeExamId = null;
    }
    contentView.classList.add('hidden');
    mainMenu.classList.remove('hidden');
  });

  async function loadContent(viewType) {
    mainMenu.classList.add('hidden');
    contentView.classList.remove('hidden');
    contentList.innerHTML = '<p>Loading...</p>';
    
    if (viewType === 'materials') {
      contentTitle.textContent = 'Select Material Topic';
      await renderTopics('materials');
    } else if (viewType === 'daily-tasks') {
      contentTitle.textContent = 'Select Daily Task Topic';
      await renderTopics('daily-tasks');
    } else if (viewType === 'homeworks') {
      contentTitle.textContent = 'Homework Projects';
      const homeworkList = [
        { id: 1, title: 'Homework 1: Processor Architecture & Memory Subsystems' },
        { id: 2, title: 'Homework 2: C++ Pointers & Memory Debugging' },
        { id: 3, title: 'Homework 3: Digital Forensics & Assembly Investigation (Operation Red Moon)' }
      ];

      // Add Homework 4 to 16
      for (let i = 4; i <= 16; i++) {
        homeworkList.push({ id: i, title: `Homework ${i}` });
      }

      contentList.innerHTML = homeworkList.map(hw => `
        <div class="content-item">
          <h3>${hw.title}</h3>
          <button class="btn-choose-hw" style="margin-top: 1rem;" onclick="openHomework(${hw.id})">Open Homework ${hw.id}</button>
        </div>
      `).join('');
    } else if (viewType === 'leaderboard') {
      contentTitle.textContent = '🏆 Class Leaderboard';
      await renderLeaderboard();
    }
  }

  async function renderTopics(nextAction) {
    const res = await fetch(`${API_BASE}/topics`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }});
    const topics = await res.json();
    contentList.innerHTML = '';
    
    if (topics.length === 0) {
      contentList.innerHTML = '<p>No topics available.</p>';
      return;
    }
    
    topics.forEach(t => {
      const div = document.createElement('div');
      div.className = 'content-item';
      div.innerHTML = `
        <h3>${t.name}</h3>
        <button class="btn-choose-hw" style="margin-top: 1rem;" onclick="openTopic(${t.id}, '${nextAction}')">Open</button>
      `;
      contentList.appendChild(div);
    });
  }
  
  async function renderLeaderboard() {
    const res = await fetch(`${API_BASE}/leaderboard`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }});
    const leaderboard = await res.json();
    contentList.innerHTML = `
      <table class="table-data" style="margin-top:0;">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Accuracy</th>
            <th>Total Solved</th>
          </tr>
        </thead>
        <tbody>
          ${leaderboard.map((lb, idx) => {
             let rankBadge = '';
             if (idx === 0) rankBadge = '<span class="rank-1">🥇 1st</span>';
             else if (idx === 1) rankBadge = '<span class="rank-2">🥈 2nd</span>';
             else if (idx === 2) rankBadge = '<span class="rank-3">🥉 3rd</span>';
             else rankBadge = `<span>#${idx + 1}</span>`;
             return `
              <tr>
                <td>${rankBadge}</td>
                <td style="font-weight:bold;">${lb.name}</td>
                <td>${parseFloat(lb.accuracy).toFixed(1)}%</td>
                <td>${lb.total_questions}</td>
              </tr>
             `;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  // --- Global Functions for onclick ---
  window.openTopic = async function(topicId, type) {
      contentList.innerHTML = '<p>Loading...</p>';
      if (type === 'materials') {
          contentTitle.textContent = 'Study Material';
          const res = await fetch(`${API_BASE}/topics/${topicId}/materials`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }});
          const materials = await res.json();
          contentList.innerHTML = '';
          materials.forEach(m => {
              const div = document.createElement('div');
              div.className = 'content-item';
              let contentHtml = '';
              if (m.type === 'pdf') {
                  contentHtml = `<iframe src="${m.content}" width="100%" height="500px"></iframe>
                                 <br><a href="${m.content}" target="_blank">Download PDF</a>`;
              } else if (m.type === 'md') {
                  contentHtml = `<div style="padding: 1rem; background: #fff; border: 1px solid #ddd;">${marked.parse(m.content)}</div>`;
              } else if (m.type === 'html') {
                  contentHtml = `<div style="padding: 1rem; background: #fff; border: 1px solid #ddd;">${m.content}</div>`;
              }
              
              div.innerHTML = `<h3>${m.title}</h3><div style="margin-top:1rem;">${contentHtml}</div>`;
              contentList.appendChild(div);
          });
      } else if (type === 'daily-tasks') {
          contentTitle.textContent = 'Daily Tasks (10 Questions)';
          const res = await fetch(`${API_BASE}/topics/${topicId}/daily_tasks`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }});
          const questions = await res.json();
          contentList.innerHTML = '';
          if (questions.length === 0) return contentList.innerHTML = '<p>No questions available for this topic.</p>';
          
          const form = document.createElement('form');
          questions.forEach((q, i) => {
              const imgHtml = q.image_url ? `<img src="${q.image_url}" style="max-width:100%; margin-top:10px; display:block;">` : '';
              form.innerHTML += `
                <div class="content-item" style="margin-bottom: 1rem;">
                    <p><strong>Question ${i+1}:</strong> ${q.question_text}</p>
                    ${imgHtml}
                    ${q.type === 'code' ? 
                      `<textarea id="ans_${q.id}" rows="4" style="width:100%; margin-top:10px; font-family: monospace;" placeholder="Write your code..."></textarea>` : 
                      `<input type="text" id="ans_${q.id}" style="width:100%; padding:0.5rem; margin-top:10px;" placeholder="Short answer...">`
                    }
                    <button type="button" class="btn-choose-hw" style="margin-top:10px; font-size:0.8rem;" onclick="submitAnswer(${topicId}, ${q.id})">Check Answer</button>
                    <span id="res_${q.id}" style="margin-left: 10px; font-weight:bold;"></span>
                </div>
              `;
          });
          contentList.appendChild(form);
      }
  };
  
  window.submitAnswer = async function(topicId, questionId) {
      const input = document.getElementById(`ans_${questionId}`);
      const resultSpan = document.getElementById(`res_${questionId}`);
      if (!input.value.trim()) return alert('Please enter your answer!');
      
      const res = await fetch(`${API_BASE}/daily_tasks/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify({ topic_id: topicId, question_id: questionId, user_answer: input.value })
      });
      const data = await res.json();
      
      if (data.is_correct) {
          resultSpan.textContent = '✔️ Correct!';
          resultSpan.style.color = 'green';
      } else {
          resultSpan.textContent = '❌ Incorrect!';
          resultSpan.style.color = 'red';
      }
  };

  let currentExamQuestions = [];
  let currentQuestionIndex = 0;
  let examTimerInterval = null;
  let editiumInstance = null;

  window.startExam = async function(examId, durationMinutes) {
      activeExamId = examId;
      contentTitle.textContent = `EXAM IN PROGRESS`;
      contentList.innerHTML = '<p>Loading exam...</p>';
      
      try {
          const res = await fetch(`${API_BASE}/exams/${examId}/questions`, {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          currentExamQuestions = await res.json();
          if (currentExamQuestions.length === 0) throw new Error("No questions found.");
          currentQuestionIndex = 0;

          const endTimeKey = `exam_${examId}_endTime`;
          let endTime = localStorage.getItem(endTimeKey);
          if (!endTime) {
              endTime = Date.now() + durationMinutes * 60000;
              localStorage.setItem(endTimeKey, endTime);
          }

          let layoutHtml = `
            <div style="padding: 1rem; border: 2px solid red; background: #fff0f0; border-radius: 8px; margin-bottom: 1rem;">
                <h3 style="color: red; margin-top: 0; margin-bottom:0;">⚠️ ANTI-CHEAT WARNING: Do not open other tabs or minimize the browser. Doing so will immediately terminate your exam.</h3>
            </div>
            <div style="display: flex; gap: 2rem; min-height: 60vh;">
                <!-- Left Panel (70%) -->
                <div style="flex: 7; display: flex; flex-direction: column; gap: 1rem;">
                   <div id="examNavBoxes" style="display: flex; gap: 0.5rem; flex-wrap: wrap;"></div>
                   <div id="examQuestionContent" style="flex: 1; padding: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.05);"></div>
                </div>

                <!-- Right Panel (30%) -->
                <div style="flex: 3; display: flex; flex-direction: column; gap: 1rem;">
                   <div id="examTimerDisplay" style="padding: 1rem; background: #fff; color: red; border: 2px solid red; border-radius: 8px; font-weight: bold; text-align: center; font-size: 1.5rem;"></div>
                   <div id="examAnswerInputContainer" style="flex: 1; min-height: 300px; background: white; border-radius: 8px;"></div>
                   <div style="display: flex; gap: 1rem;">
                      <button id="btnPrevQ" class="btn" style="flex: 1;" onclick="navExam(-1)">Previous</button>
                      <button id="btnNextQ" class="btn" style="flex: 1;" onclick="navExam(1)">Next</button>
                   </div>
                   <button class="btn btn-danger" style="margin-top: 1rem;" onclick="submitExamFinal(${examId})">Submit Exam</button>
                </div>
            </div>
          `;
          contentList.innerHTML = layoutHtml;

          // Timer Loop
          clearInterval(examTimerInterval);
          examTimerInterval = setInterval(() => {
              let remain = Math.max(0, endTime - Date.now());
              let mins = Math.floor(remain / 60000);
              let secs = Math.floor((remain % 60000) / 1000);
              document.getElementById('examTimerDisplay').textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
              if (remain === 0) {
                  clearInterval(examTimerInterval);
                  alert("Waktu habis! Ujian otomatis dikumpulkan.");
                  submitExamFinal(examId);
              }
          }, 1000);

          // Build Nav Boxes
          const navContainer = document.getElementById('examNavBoxes');
          currentExamQuestions.forEach((q, idx) => {
              const box = document.createElement('div');
              box.textContent = idx + 1;
              box.style.cssText = `width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #e2e8f0; border-radius: 4px; cursor: pointer; font-weight: bold; border: 2px solid transparent;`;
              box.id = `navBox_${idx}`;
              box.onclick = () => jumpToQuestion(idx);
              navContainer.appendChild(box);
          });

          // Initialize Editium
          editiumInstance = new Editium({
              container: document.getElementById('examAnswerInputContainer'),
              placeholder: 'Write your answer here...',
              toolbar: 'all',
              onChange: (content) => {
                  const qId = currentExamQuestions[currentQuestionIndex].id;
                  localStorage.setItem(`exam_${examId}_q_${qId}`, content.html);
                  document.getElementById(`navBox_${currentQuestionIndex}`).style.background = '#dcfce7'; 
              }
          });

          renderCurrentQuestion();

      } catch (err) {
          contentList.innerHTML = '<p>Error loading exam.</p>';
          activeExamId = null;
      }
  };

  window.navExam = function(dir) {
      const newIdx = currentQuestionIndex + dir;
      if (newIdx >= 0 && newIdx < currentExamQuestions.length) jumpToQuestion(newIdx);
  };

  window.jumpToQuestion = function(idx) {
      currentQuestionIndex = idx;
      renderCurrentQuestion();
  };

  function renderCurrentQuestion() {
      const q = currentExamQuestions[currentQuestionIndex];
      const examId = activeExamId;
      
      document.getElementById('examQuestionContent').innerHTML = `
          <h4 style="margin-top:0;">Question ${currentQuestionIndex + 1} <span style="font-size:0.8rem; color:#666;">(${q.type.toUpperCase()})</span></h4>
          <p style="line-height: 1.6;">${q.question_text}</p>
      `;
      
      const savedAns = localStorage.getItem(`exam_${examId}_q_${q.id}`) || "";
      if (editiumInstance) {
          // Temporarily disable onChange to avoid triggering save while loading
          const tmpOnChange = editiumInstance.options.onChange;
          editiumInstance.options.onChange = null;
          editiumInstance.setContent(savedAns);
          editiumInstance.options.onChange = tmpOnChange;
      }
      
      currentExamQuestions.forEach((_, i) => {
          const box = document.getElementById(`navBox_${i}`);
          box.style.borderColor = (i === currentQuestionIndex) ? 'var(--primary)' : 'transparent';
          if (localStorage.getItem(`exam_${examId}_q_${currentExamQuestions[i].id}`)) {
              box.style.background = '#dcfce7';
          } else {
              box.style.background = '#e2e8f0';
          }
      });
      
      document.getElementById('btnPrevQ').disabled = (currentQuestionIndex === 0);
      document.getElementById('btnNextQ').disabled = (currentQuestionIndex === currentExamQuestions.length - 1);
  }
  
  window.submitExamFinal = async function(examId) {
      if (!examId) examId = activeExamId;
      const confirmSubmit = confirm('Are you sure you want to submit your exam? You cannot change your answers after this.');
      if (!confirmSubmit) return;
      
      clearInterval(examTimerInterval);
      
      const answers = currentExamQuestions.map(q => ({
          question_id: q.id,
          answer_text: localStorage.getItem(`exam_${examId}_q_${q.id}`) || ""
      }));
      
      try {
          await fetch(`${API_BASE}/exams/${examId}/submit`, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ answers })
          });
          
          activeExamId = null;
          if (editiumInstance) {
              editiumInstance.destroy();
              editiumInstance = null;
          }
          currentExamQuestions.forEach(q => localStorage.removeItem(`exam_${examId}_q_${q.id}`));
          localStorage.removeItem(`exam_${examId}_endTime`);
          
          alert('Your exam has been submitted successfully for manual grading.');
          document.getElementById('btnBackToMenu').click();
      } catch (err) {
          alert('Failed to submit exam: ' + err.message);
      }
  };

  window.openHomework = async function(hwId) {
      try {
          const student = JSON.parse(localStorage.getItem('student') || '{}');
          if (student.role === 'admin') {
              window.location.href = `homework/homework-${hwId}/index.html`;
              return;
          }

          const res = await fetch(`${API_BASE}/homework/homework-${hwId}`);
          if (!res.ok) throw new Error('Homework not found');
          const packages = await res.json();
          
          const username = (student.username || '').toLowerCase();
          const name = (student.name || '').toLowerCase();
          const normalize = str => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

          const myPackage = packages.find(p => {
              const normFile = normalize(p.file);
              const normStudentName = normalize(p.studentName);
              const normUser = normalize(username);
              const normName = normalize(name);
              return (
                  p.file.toLowerCase().startsWith(username + '-') ||
                  (normUser && (normFile.includes(normUser) || normStudentName.includes(normUser))) ||
                  (normName && (normFile.includes(normName) || normStudentName.includes(normName)))
              );
          });
          
          if (myPackage) {
              window.location.href = `homework/homework-${hwId}/${myPackage.file}`;
          } else {
              alert('Sorry, no homework package found for your account in Homework ' + hwId);
          }
      } catch (err) {
          alert('Error loading homework: ' + err.message);
      }
  };

});
