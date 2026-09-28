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
        
        if (tBody) tBody.innerHTML = '';
        if (selMaterial) selMaterial.innerHTML = ''; 
        if (selSoal) selSoal.innerHTML = '';
        
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
