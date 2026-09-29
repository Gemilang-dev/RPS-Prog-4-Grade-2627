const API_BASE = '/api';
const token = localStorage.getItem('token');

// Auth check
if (!token) {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    loadTopics();
    // Load student name
    const student = JSON.parse(localStorage.getItem('student') || '{}');
    if (student.role !== 'admin') {
        alert('Akses ditolak. Anda bukan admin.');
        window.location.href = 'index.html';
    }
    document.getElementById('adminName').textContent = `Hi, ${student.name || 'Admin'}`;
});

function switchTab(tabId) {
    document.querySelectorAll('.section-view').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-menu li').forEach(l => l.classList.remove('active'));
    document.getElementById(`view-${tabId}`).classList.add('active');
    event.target.classList.add('active');
    
    if (tabId === 'leaderboard') loadLeaderboard();
    if (tabId === 'ujian') loadExams();
    if (tabId === 'edit-tasks') loadEditTasks();
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    window.location.href = 'index.html';
}

// TOPICS & MATERIALS
async function loadTopics() {
    try {
        const res = await fetch(`${API_BASE}/topics`, { headers: { 'Authorization': `Bearer ${token}` } });
        const topics = await res.json();
        
        // Populate tables and selects
        const tBody = document.querySelector('#topicsTable tbody');
        const selMaterial = document.getElementById('materialTopicId');
        const selSoal = document.getElementById('soalTopicId');
        const filterEditTask = document.getElementById('filterEditTaskTopicId');
        const editTaskTopic = document.getElementById('editTaskTopicId');
        
        if (tBody) tBody.innerHTML = '';
        if (selMaterial) selMaterial.innerHTML = ''; 
        if (selSoal) selSoal.innerHTML = '';
        if (filterEditTask) filterEditTask.innerHTML = '<option value="">All Topics</option>';
        if (editTaskTopic) editTaskTopic.innerHTML = '';
        
        topics.forEach(t => {
            // Table
            if (tBody) {
                tBody.innerHTML += `<tr>
                    <td>${t.id}</td>
                    <td>${t.name}</td>
                    <td>${t.is_locked ? '🔒 Terkunci' : '🔓 Terbuka'}</td>
                    <td>
                        <button onclick="toggleLock(${t.id}, ${!t.is_locked})">${t.is_locked ? 'Buka' : 'Kunci'}</button>
                    </td>
                </tr>`;
            }
            
            // Selects
            const opt = `<option value="${t.id}">${t.name}</option>`;
            if (selMaterial) selMaterial.innerHTML += opt;
            if (selSoal) selSoal.innerHTML += opt;
            if (filterEditTask) filterEditTask.innerHTML += opt;
            if (editTaskTopic) editTaskTopic.innerHTML += opt;
        });
    } catch (e) { console.error(e); }
}

async function addTopic(e) {
    e.preventDefault();
    const name = document.getElementById('topicName').value;
    await fetch(`${API_BASE}/topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name })
    });
    document.getElementById('topicName').value = '';
    loadTopics();
}

// Ensure toggleLock is exposed globally
window.toggleLock = async function(id, lockStatus) {
    await fetch(`${API_BASE}/topics/${id}/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ is_locked: lockStatus })
    });
    loadTopics();
};

async function addMaterial(e) {
    e.preventDefault();
    const payload = {
        topic_id: document.getElementById('materialTopicId').value,
        title: document.getElementById('materialTitle').value,
        type: document.getElementById('materialType').value,
        content: document.getElementById('materialContent').value
    };
    await fetch(`${API_BASE}/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
    });
    alert('Materi berhasil ditambahkan');
    e.target.reset();
}

// UPLOAD SOAL
async function uploadSoal(e) {
    e.preventDefault();
    const topicId = document.getElementById('soalTopicId').value;
    const file = document.getElementById('soalFile').files[0];
    
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function(evt) {
        try {
            const questions = JSON.parse(evt.target.result);
            questions.forEach(q => q.topic_id = topicId);
            
            const res = await fetch(`${API_BASE}/question_bank/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ questions })
            });
            if (res.ok) alert('Berhasil mengunggah soal!');
            else alert('Gagal mengunggah soal.');
        } catch (err) {
            alert('File JSON tidak valid!');
        }
    };
    reader.readAsText(file);
}

// EXAMS
async function createExam(e) {
    e.preventDefault();
    await fetch(`${API_BASE}/exams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
            title: document.getElementById('examTitle').value,
            duration_minutes: document.getElementById('examDuration').value
        })
    });
    e.target.reset();
    loadExams();
}

async function loadExams() {
    const res = await fetch(`${API_BASE}/exams`, { headers: { 'Authorization': `Bearer ${token}` } });
    const exams = await res.json();
    const tBody = document.querySelector('#examsTable tbody');
    const selExam = document.getElementById('examSelectId');
    if (!tBody) return;
    tBody.innerHTML = '';
    if (selExam) selExam.innerHTML = '';
    
    exams.forEach(ex => {
        tBody.innerHTML += `<tr>
            <td>${ex.id}</td>
            <td>${ex.title}</td>
            <td>${ex.duration_minutes} mnt</td>
            <td>${ex.is_active ? 'Aktif' : 'Draft'}</td>
            <td>
                <button onclick="toggleExam(${ex.id}, ${!ex.is_active})">${ex.is_active ? 'Nonaktifkan' : 'Aktifkan'}</button>
            </td>
        </tr>`;
        
        if (selExam) {
            selExam.innerHTML += `<option value="${ex.id}">${ex.title}</option>`;
        }
    });
}

window.toggleExam = async function(id, status) {
    await fetch(`${API_BASE}/exams/${id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ is_active: status })
    });
    loadExams();
};

window.uploadExamQuestions = async function(e) {
    e.preventDefault();
    const examId = document.getElementById('examSelectId').value;
    const file = document.getElementById('examSoalFile').files[0];
    
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function(evt) {
        try {
            const questions = JSON.parse(evt.target.result);
            const res = await fetch(`${API_BASE}/exams/${examId}/questions/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ questions })
            });
            if (res.ok) alert('Berhasil mengunggah soal ujian!');
            else alert('Gagal mengunggah soal ujian.');
        } catch (err) {
            alert('File JSON tidak valid!');
        }
    };
    reader.readAsText(file);
};

// LEADERBOARD
async function loadLeaderboard() {
    const res = await fetch(`${API_BASE}/leaderboard`, { headers: { 'Authorization': `Bearer ${token}` } });
    const data = await res.json();
    const tBody = document.querySelector('#leaderboardTable tbody');
    if (!tBody) return;
    tBody.innerHTML = '';
    data.forEach((r, i) => {
        tBody.innerHTML += `<tr>
            <td>#${i + 1}</td>
            <td>${r.name}</td>
            <td>${Number(r.accuracy).toFixed(1)}%</td>
            <td>${r.total_questions}</td>
        </tr>`;
    });
}

// EDIT DAILY TASKS
let allTasks = [];

window.loadEditTasks = async function() {
    const topicId = document.getElementById('filterEditTaskTopicId').value;
    let url = `${API_BASE}/question_bank`;
    if (topicId) {
        url += `?topic_id=${topicId}`;
    }
    
    try {
        const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        allTasks = await res.json();
        
        const tBody = document.querySelector('#editTasksTable tbody');
        if (!tBody) return;
        tBody.innerHTML = '';
        
        allTasks.forEach(task => {
            tBody.innerHTML += `<tr>
                <td>${task.id}</td>
                <td>${task.topic_id}</td>
                <td>${task.question_text}</td>
                <td>${task.expected_answer}</td>
                <td>
                    <button class="btn" style="padding: 0.4rem 0.8rem; font-size: 0.9rem; margin-bottom: 0.2rem;" onclick="openEditTaskModal(${task.id})">Edit</button>
                    <button class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;" onclick="deleteTask(${task.id})">Delete</button>
                </td>
            </tr>`;
        });
    } catch (err) {
        console.error('Failed to load tasks', err);
    }
};

window.openEditTaskModal = function(taskId) {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;
    
    document.getElementById('editTaskId').value = task.id;
    document.getElementById('editTaskTopicId').value = task.topic_id;
    document.getElementById('editTaskText').value = task.question_text;
    document.getElementById('editTaskAnswer').value = task.expected_answer;
    
    document.getElementById('editTaskModal').style.display = 'flex';
};

window.saveTaskEdit = async function(e) {
    e.preventDefault();
    const taskId = document.getElementById('editTaskId').value;
    const topicId = document.getElementById('editTaskTopicId').value;
    const questionText = document.getElementById('editTaskText').value;
    const expectedAnswer = document.getElementById('editTaskAnswer').value;
    
    try {
        const res = await fetch(`${API_BASE}/question_bank/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                topic_id: topicId,
                type: 'short_answer',
                question_text: questionText,
                expected_answer: expectedAnswer
            })
        });
        
        if (res.ok) {
            document.getElementById('editTaskModal').style.display = 'none';
            loadEditTasks();
            alert('Task updated successfully!');
        } else {
            alert('Failed to update task.');
        }
    } catch (err) {
        console.error('Failed to update task', err);
        alert('An error occurred while updating the task.');
    }
};

window.deleteTask = async function(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        const res = await fetch(`${API_BASE}/question_bank/${taskId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
            loadEditTasks();
            alert('Task deleted successfully!');
        } else {
            alert('Failed to delete task.');
        }
    } catch (err) {
        console.error('Failed to delete task', err);
        alert('An error occurred while deleting the task.');
    }
};
