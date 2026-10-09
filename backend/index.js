const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'bebas_rahasia_jwt';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// ================= AUTH MIDDLEWARE =================
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    next();
};

// ================= DB INIT & SEED =================
const initDB = async () => {
    try {
        // 1. Ensure tables exist by running init.sql
        const sqlPath = path.join(__dirname, 'init.sql');
        if (fs.existsSync(sqlPath)) {
            const sql = fs.readFileSync(sqlPath, 'utf8');
            await pool.query(sql);
            console.log('✔ Database tables initialized successfully from init.sql');
        }

        // 2. Seed Admin if not exists
        const adminRes = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
        if (parseInt(adminRes.rows[0].count) === 0) {
            const hashedAdmin = await bcrypt.hash('admin123', 10);
            await pool.query("INSERT INTO users (username, password, name, role) VALUES ($1, $2, $3, 'admin')", ['admin', hashedAdmin, 'Administrator']);
            console.log('✔ Seeded default admin (admin / admin123)');
        }

        // 3. Seed Students if none exist
        const studentRes = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'");
        if (parseInt(studentRes.rows[0].count) === 0) {
            const hashedStudent = await bcrypt.hash('student123', 10);
            const defaultStudents = [
                { username: 'amish', name: 'Amish Mohamed' },
                { username: 'hanan', name: 'Šarić Hanan' },
                { username: 'hana', name: 'Ibrulj Hana' },
                { username: 'emina', name: 'Mešić Emina' },
                { username: 'ahmed', name: 'Delić Ahmed' },
                { username: 'hamza', name: 'Đuderija Hamza' }
            ];
            for (const s of defaultStudents) {
                await pool.query(
                    "INSERT INTO users (username, password, name, role) VALUES ($1, $2, $3, 'student') ON CONFLICT (username) DO NOTHING",
                    [s.username, hashedStudent, s.name]
                );
            }
            console.log('✔ Seeded default student accounts (password: student123)');
        }

        // 4. Seed Topics & Question Bank from CSV if topics table is empty
        const topicRes = await pool.query("SELECT COUNT(*) FROM topics");
        if (parseInt(topicRes.rows[0].count) === 0) {
            console.log('Seeding topics & question bank from CSV...');
            const csvFilePath = path.join(__dirname, '..', 'Lesson Plan Programming 4C - Lesson Plan.csv');
            if (fs.existsSync(csvFilePath)) {
                const csv = require('csv-parser');
                const results = [];
                fs.createReadStream(csvFilePath)
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', async () => {
                        try {
                            for (const row of results) {
                                const lessonNo = row['LESSON NO.'];
                                if (!lessonNo || lessonNo.trim() === '') continue;
                                const topicName = `Lesson ${lessonNo}: ${row['KEY CONTENT / LESSON UNIT']}`;
                                const topicRes = await pool.query('INSERT INTO topics (name, is_locked) VALUES ($1, false) RETURNING id', [topicName]);
                                const topicId = topicRes.rows[0].id;
                                const content = `<h2>Objective</h2><p>${row['LEARNING OUTCOME']}</p><br><h3>Indicator</h3><p>${row['INDICATOR']}</p><br><p><strong>Date:</strong> ${row['DATE']}</p><p><strong>Thematic Area:</strong> ${row['THEMATIC AREA']}</p><p><strong>In-Class Task:</strong> ${row['IN-CLASS DAILY TASK (6 Students / 1 Hour)']}</p>`;
                                await pool.query('INSERT INTO materials (topic_id, title, type, content) VALUES ($1, $2, $3, $4)', [topicId, topicName, 'html', content]);
                                const qPool = [
                                    { q: `What is the key content of this lesson?`, a: row['KEY CONTENT / LESSON UNIT'] },
                                    { q: `What is the thematic area of this lesson?`, a: row['THEMATIC AREA'] },
                                    { q: `What date is this lesson scheduled for?`, a: row['DATE'] },
                                    { q: `Is the learning outcome to "${row['LEARNING OUTCOME']}"? (Yes/No)`, a: "Yes" },
                                    { q: `Is the indicator to "${row['INDICATOR']}"? (Yes/No)`, a: "Yes" },
                                    { q: `What unit number does this lesson belong to?`, a: row['UNIT NO.'] },
                                    { q: `What is the assigned homework for this lesson? (Type '-' if none)`, a: row['HOMEWORK / PR'] || "-" },
                                    { q: `Write the lesson number as a digit.`, a: row['LESSON NO.'] },
                                    { q: `Does this lesson involve coding or theory? (Answer based on your understanding of ${row['THEMATIC AREA']})`, a: "Both" },
                                    { q: `Review: Write 'Ready' to confirm you have read the learning outcome.`, a: "Ready" }
                                ];
                                for (const q of qPool) {
                                    await pool.query('INSERT INTO question_bank (topic_id, type, question_text, expected_answer) VALUES ($1, $2, $3, $4)', [topicId, 'short_answer', q.q, q.a]);
                                }
                            }
                            console.log('✔ CSV topics & questions seeding complete.');
                        } catch (seedErr) {
                            console.error('Error seeding CSV data:', seedErr.message);
                        }
                    });
            }
        }
    } catch (err) {
        console.error('Error initializing database:', err.message);
    }
};
initDB();

// ================= AUTH ROUTES =================
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
        
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
            res.json({ token, student: { id: user.id, username: user.username, name: user.name, role: user.role } });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/me', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, name, role FROM users WHERE id = $1', [req.user.id]);
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ================= ADMIN ROUTES =================
// Topics
app.post('/api/topics', authenticateToken, requireAdmin, async (req, res) => {
    const { name } = req.body;
    const r = await pool.query('INSERT INTO topics (name) VALUES ($1) RETURNING *', [name]);
    res.json(r.rows[0]);
});
app.post('/api/topics/:id/lock', authenticateToken, requireAdmin, async (req, res) => {
    const r = await pool.query('UPDATE topics SET is_locked = $1 WHERE id = $2 RETURNING *', [req.body.is_locked, req.params.id]);
    res.json(r.rows[0]);
});

// Materials (Upload)
app.post('/api/materials', authenticateToken, requireAdmin, async (req, res) => {
    const { topic_id, title, type, content } = req.body;
    const r = await pool.query('INSERT INTO materials (topic_id, title, type, content) VALUES ($1, $2, $3, $4) RETURNING *', [topic_id, title, type, content]);
    res.json(r.rows[0]);
});

// Daily Tasks (Bulk Upload from JSON)
app.post('/api/question_bank/bulk', authenticateToken, requireAdmin, async (req, res) => {
    const { questions } = req.body; 
    try {
        for (let q of questions) {
            await pool.query(
                'INSERT INTO question_bank (topic_id, type, question_text, image_url, options, expected_answer) VALUES ($1, $2, $3, $4, $5, $6)',
                [q.topic_id, q.type || 'short_answer', q.question_text, q.image_url || null, q.options ? JSON.stringify(q.options) : null, q.expected_answer]
            );
        }
        res.json({ message: 'Questions uploaded successfully' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: Get all daily tasks (optionally filter by topic_id)
app.get('/api/question_bank', authenticateToken, requireAdmin, async (req, res) => {
    try {
        let query = 'SELECT * FROM question_bank ORDER BY id DESC';
        let params = [];
        if (req.query.topic_id) {
            query = 'SELECT * FROM question_bank WHERE topic_id = $1 ORDER BY id DESC';
            params = [req.query.topic_id];
        }
        const r = await pool.query(query, params);
        res.json(r.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: Create single daily task
app.post('/api/question_bank', authenticateToken, requireAdmin, async (req, res) => {
    const { topic_id, type, question_text, image_url, options, expected_answer } = req.body;
    try {
        const r = await pool.query(
            'INSERT INTO question_bank (topic_id, type, question_text, image_url, options, expected_answer) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [topic_id, type || 'short_answer', question_text, image_url || null, options ? JSON.stringify(options) : null, expected_answer]
        );
        res.json(r.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: Update daily task
app.put('/api/question_bank/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { topic_id, type, question_text, image_url, options, expected_answer } = req.body;
    try {
        const r = await pool.query(
            'UPDATE question_bank SET topic_id = $1, type = $2, question_text = $3, image_url = $4, options = $5, expected_answer = $6 WHERE id = $7 RETURNING *',
            [topic_id, type || 'short_answer', question_text, image_url || null, options ? JSON.stringify(options) : null, expected_answer, req.params.id]
        );
        res.json(r.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: Delete daily task
app.delete('/api/question_bank/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM question_bank WHERE id = $1', [req.params.id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Exams Management
app.post('/api/exams', authenticateToken, requireAdmin, async (req, res) => {
    const { title, duration_minutes } = req.body;
    const r = await pool.query('INSERT INTO exams (title, duration_minutes) VALUES ($1, $2) RETURNING *', [title, duration_minutes]);
    res.json(r.rows[0]);
});
app.post('/api/exams/:id/toggle', authenticateToken, requireAdmin, async (req, res) => {
    const r = await pool.query('UPDATE exams SET is_active = $1 WHERE id = $2 RETURNING *', [req.body.is_active, req.params.id]);
    res.json(r.rows[0]);
});

// Leaderboard
app.get('/api/leaderboard', authenticateToken, async (req, res) => {
    const query = `
        WITH FirstAttempts AS (
            SELECT DISTINCT ON (user_id, question_id) user_id, is_correct
            FROM daily_task_attempts
            ORDER BY user_id, question_id, created_at ASC
        ),
        Accuracy AS (
            SELECT user_id, 
                   COUNT(CASE WHEN is_correct THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0) as acc
            FROM FirstAttempts GROUP BY user_id
        ),
        TotalActivity AS (
            SELECT user_id, COUNT(*) as total FROM daily_task_attempts GROUP BY user_id
        )
        SELECT u.id, u.name, COALESCE(a.acc, 0) as accuracy, COALESCE(t.total, 0) as total_questions
        FROM users u
        LEFT JOIN Accuracy a ON u.id = a.user_id
        LEFT JOIN TotalActivity t ON u.id = t.user_id
        WHERE u.role = 'student'
        ORDER BY accuracy DESC, total_questions DESC
    `;
    const r = await pool.query(query);
    res.json(r.rows);
});

// ================= STUDENT & SHARED ROUTES =================

// Topics
app.get('/api/topics', authenticateToken, async (req, res) => {
    let query = 'SELECT * FROM topics ORDER BY id ASC';
    if (req.user.role === 'student') query = 'SELECT * FROM topics WHERE is_locked = false ORDER BY id ASC';
    const r = await pool.query(query);
    res.json(r.rows);
});

// Materials for topic (DB + Physical Files)
app.get('/api/topics/:id/materials', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const r = await pool.query('SELECT * FROM materials WHERE topic_id = $1 ORDER BY id ASC', [id]);
        let materials = r.rows;
        
        // Scan physical folders
        const semFolder = id <= 53 ? 'sem-1' : 'sem-2';
        const physicalPath = path.join(__dirname, '..', 'materials', semFolder, `lesson-${id}`);
        
        if (fs.existsSync(physicalPath)) {
            const files = fs.readdirSync(physicalPath);
            files.forEach(file => {
                const ext = path.extname(file).toLowerCase();
                let type = 'unknown';
                if (ext === '.pdf') type = 'pdf';
                else if (ext === '.md') type = 'md';
                else if (ext === '.html') type = 'html';
                
                if (type !== 'unknown') {
                    const contentPath = `/materials/${semFolder}/lesson-${id}/${file}`;
                    
                    let content = contentPath;
                    if (type === 'md' || type === 'html') {
                        content = fs.readFileSync(path.join(physicalPath, file), 'utf8');
                    }
                    
                    materials.push({
                        id: `file-${file}`,
                        topic_id: id,
                        title: `Physical File: ${file}`,
                        type: type,
                        content: content
                    });
                }
            });
        }
        res.json(materials);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Daily Tasks for Student
app.get('/api/topics/:id/daily_tasks', authenticateToken, async (req, res) => {
    const r = await pool.query('SELECT id, type, question_text, image_url FROM question_bank WHERE topic_id = $1 ORDER BY RANDOM() LIMIT 10', [req.params.id]);
    res.json(r.rows);
});

// Submit Daily Task Answer
app.post('/api/daily_tasks/submit', authenticateToken, async (req, res) => {
    const { topic_id, question_id, user_answer } = req.body;
    try {
        const qRes = await pool.query('SELECT expected_answer FROM question_bank WHERE id = $1', [question_id]);
        if (qRes.rows.length === 0) return res.status(404).json({ error: 'Question not found' });
        
        const expectedStr = (qRes.rows[0].expected_answer || '').toLowerCase();
        const expectedAnswers = expectedStr.split('|').map(a => a.trim());
        const actual = (user_answer || '').trim().toLowerCase();
        const is_correct = expectedAnswers.includes(actual);

        const aRes = await pool.query('SELECT COUNT(*) FROM daily_task_attempts WHERE user_id = $1 AND question_id = $2', [req.user.id, question_id]);
        const attemptNum = parseInt(aRes.rows[0].count) + 1;

        await pool.query(
            'INSERT INTO daily_task_attempts (user_id, topic_id, question_id, user_answer, is_correct, attempt_number) VALUES ($1, $2, $3, $4, $5, $6)',
            [req.user.id, topic_id, question_id, user_answer, is_correct, attemptNum]
        );

        res.json({ is_correct, expected_answer: qRes.rows[0].expected_answer });
    } catch(err) { res.status(500).json({ error: err.message }); }
});

// Exams List
app.get('/api/exams', authenticateToken, async (req, res) => {
    let query = 'SELECT * FROM exams ORDER BY id ASC';
    if (req.user.role === 'student') query = 'SELECT * FROM exams WHERE is_active = true ORDER BY id ASC';
    const r = await pool.query(query);
    res.json(r.rows);
});

// Get Exam Questions
app.get('/api/exams/:id/questions', authenticateToken, async (req, res) => {
    try {
        const r = await pool.query('SELECT * FROM exam_questions WHERE exam_id = $1 ORDER BY id ASC', [req.params.id]);
        res.json(r.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Bulk Upload Exam Questions
app.post('/api/exams/:id/questions/bulk', authenticateToken, requireAdmin, async (req, res) => {
    const { questions } = req.body;
    try {
        for (let q of questions) {
            await pool.query(
                "INSERT INTO exam_questions (exam_id, type, question_text) VALUES ($1, $2, $3)",
                [req.params.id, q.type || 'essay', q.question_text]
            );
        }
        res.json({ message: 'Exam questions uploaded successfully' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Submit full exam answers
app.post('/api/exams/:id/submit', authenticateToken, async (req, res) => {
    const { answers } = req.body; // array of { question_id, answer_text }
    try {
        // 1. Create submission record
        const subRes = await pool.query(
            "INSERT INTO exam_submissions (exam_id, user_id, status) VALUES ($1, $2, 'submitted') RETURNING id",
            [req.params.id, req.user.id]
        );
        const subId = subRes.rows[0].id;
        
        // 2. Insert answers
        for (let a of answers) {
            await pool.query(
                "INSERT INTO exam_answers (submission_id, question_id, answer_text) VALUES ($1, $2, $3)",
                [subId, a.question_id, a.answer_text]
            );
        }
        res.json({ message: 'Exam submitted successfully' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Exam termination (Anti-cheat)
app.post('/api/exams/:id/terminate', authenticateToken, async (req, res) => {
    await pool.query(
        "INSERT INTO exam_submissions (exam_id, user_id, status) VALUES ($1, $2, 'terminated_cheating')",
        [req.params.id, req.user.id]
    );
    res.json({ message: 'Exam terminated' });
});

// ================= LEGACY HOMEWORK API =================
function extractHeaderDataFromHtml(htmlContent, fallbackFileName) {
  let studentName = null;
  const tableMatch = htmlContent.match(/Student\s*Name:?\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
  if (tableMatch) {
    const extracted = tableMatch[1].replace(/<[^>]+>/g, '').trim();
    if (extracted && !extracted.includes('___')) studentName = extracted;
  }
  const headerMatch = htmlContent.match(/<header[^>]*>([\s\S]*?)<\/header>/i);
  const headerText = headerMatch ? headerMatch[1] : htmlContent;
  if (!studentName) {
    const nameMatch = headerText.match(/<h1[^>]*class=["'][^"']*student-name[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i) ||
                      headerText.match(/class=["'][^"']*student-name[^"']*["'][^>]*>([\s\S]*?)<\/[a-z0-9]+>/i);
    if (nameMatch) studentName = nameMatch[1].replace(/<[^>]+>/g, '').trim();
  }
  if (!studentName) {
    const titleMatch = htmlContent.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleMatch) studentName = titleMatch[1].split('-')[0].trim();
  }
  return {
    file: fallbackFileName,
    studentName: studentName || fallbackFileName.replace('.html', ''),
    packageBadge: 'PACKAGE',
    studentMeta: ''
  };
}

app.get('/api/version', (req, res) => {
    res.json({ version: 'v2.0-hw4-fix', timestamp: new Date().toISOString() });
});

app.get('/api/homework/:id', (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Expires', '-1');
    res.set('Pragma', 'no-cache');
    
    const hwFolder = req.params.id.replace(/homework\s+(\d+)/gi, 'homework-$1');
    const safeHwFolder = hwFolder.replace(/[^a-zA-Z0-9-_]/g, '');
    const dirPath = path.join(__dirname, '..', 'homework', safeHwFolder);
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
        return res.status(404).json({ error: 'Homework folder not found' });
    }
    try {
        const files = fs.readdirSync(dirPath);
        const packageFiles = files.filter(f => f.endsWith('.html') && f.toLowerCase() !== 'index.html')
            .sort((a, b) => (parseInt(a.replace(/\D/g, '') || '0') - parseInt(b.replace(/\D/g, '') || '0')));
        const packageData = packageFiles.map(file => {
            const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
            return extractHeaderDataFromHtml(content, file);
        });
        res.json(packageData);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Restart Backend on edit
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
