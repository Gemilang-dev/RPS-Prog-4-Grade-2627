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
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_for_jwt_auth_123';

app.use(cors());
app.use(express.json());

// Database Initialization and Seeding
const initDB = async () => {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'init.sql')).toString();
        await pool.query(sql);
        console.log('Database tables initialized.');

        // Check if any student exists, if not, create a default one
        const res = await pool.query('SELECT COUNT(*) FROM students');
        if (parseInt(res.rows[0].count) === 0) {
            const hashedPassword = await bcrypt.hash('student123', 10);
            await pool.query(
                'INSERT INTO students (username, password, name) VALUES ($1, $2, $3)',
                ['student1', hashedPassword, 'Student One']
            );
            console.log('Created default student: username: student1, password: student123');
        }
        
        // Seed some dummy content
        const matRes = await pool.query('SELECT COUNT(*) FROM materials');
        if (parseInt(matRes.rows[0].count) === 0) {
            await pool.query('INSERT INTO materials (title, content) VALUES ($1, $2)', ['Introduction to Programming', 'This is the first material content.']);
            await pool.query('INSERT INTO daily_tasks (title, description) VALUES ($1, $2)', ['Basic Syntax Quiz', 'Answer 5 questions about syntax.']);
            await pool.query('INSERT INTO homeworks (title, description) VALUES ($1, $2)', ['Homework 1', 'Complete the basic calculator project.']);
            console.log('Seeded initial materials, tasks, and homeworks.');
        }

    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

initDB();

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // contains { id, username }
        next();
    });
};

// Routes

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM students WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const student = result.rows[0];
        const match = await bcrypt.compare(password, student.password);
        
        if (match) {
            const token = jwt.sign({ id: student.id, username: student.username }, JWT_SECRET, { expiresIn: '24h' });
            res.json({ token, student: { id: student.id, username: student.username, name: student.name } });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current student
app.get('/api/me', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, name FROM students WHERE id = $1', [req.user.id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Materials
app.get('/api/materials', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM materials ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Daily Tasks (Soal Latihan)
app.get('/api/daily-tasks', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM daily_tasks ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Homeworks (PR)
app.get('/api/homeworks', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM homeworks ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Submit Daily Task Log
app.post('/api/daily-tasks/:taskId/log', authenticateToken, async (req, res) => {
    const taskId = req.params.taskId;
    const studentId = req.user.id;
    const { score, log_data } = req.body;
    
    try {
        const result = await pool.query(
            'INSERT INTO daily_task_logs (student_id, task_id, score, log_data) VALUES ($1, $2, $3, $4) RETURNING *',
            [studentId, taskId, score, JSON.stringify(log_data)]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Daily Task Logs for the logged-in student
app.get('/api/daily-tasks/logs', authenticateToken, async (req, res) => {
    const studentId = req.user.id;
    try {
        const result = await pool.query(`
            SELECT l.*, t.title 
            FROM daily_task_logs l
            JOIN daily_tasks t ON l.task_id = t.id
            WHERE l.student_id = $1
            ORDER BY l.created_at DESC
        `, [studentId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Helper: Read HTML header to extract student name (from old server.js)
function extractHeaderDataFromHtml(htmlContent, fallbackFileName) {
  let studentName = null;
  const tableMatch = htmlContent.match(/Student\s*Name:?\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
  if (tableMatch) {
    const extracted = tableMatch[1].replace(/<[^>]+>/g, '').trim();
    if (extracted && !extracted.includes('___')) studentName = extracted;
  }
  if (!studentName) {
    const headerMatch = htmlContent.match(/<header[^>]*>([\s\S]*?)<\/header>/i);
    const headerText = headerMatch ? headerMatch[1] : htmlContent;
    const nameMatch = headerText.match(/<h1[^>]*class=["'][^"']*student-name[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i);
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

// Legacy API Route: /api/homework/:id -> Scan homework folder
app.get('/api/homework/:id', (req, res) => {
    let hwFolder = req.params.id;
    hwFolder = hwFolder.replace(/homework\s+(\d+)/gi, 'homework-$1');
    const safeHwFolder = hwFolder.replace(/[^a-zA-Z0-9-_]/g, '');
    const dirPath = path.join(__dirname, '..', 'homework', safeHwFolder);

    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      return res.status(404).json({ error: 'Homework folder not found' });
    }
    try {
      const files = fs.readdirSync(dirPath);
      const packageFiles = files
        .filter(f => f.endsWith('.html') && f.toLowerCase() !== 'index.html')
        .sort((a, b) => {
          const numA = parseInt(a.replace(/\D/g, '') || '0', 10);
          const numB = parseInt(b.replace(/\D/g, '') || '0', 10);
          return numA - numB;
        });

      const packageData = packageFiles.map(file => {
        const fullFilePath = path.join(dirPath, file);
        const content = fs.readFileSync(fullFilePath, 'utf8');
        return extractHeaderDataFromHtml(content, file);
      });
      res.json(packageData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..')));

// (SPA Fallback removed to fix Express 5 PathError)

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
