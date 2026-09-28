const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function resetDB() {
    try {
        await pool.query('DROP TABLE IF EXISTS exam_answers CASCADE;');
        await pool.query('DROP TABLE IF EXISTS exam_submissions CASCADE;');
        await pool.query('DROP TABLE IF EXISTS exam_questions CASCADE;');
        await pool.query('DROP TABLE IF EXISTS exams CASCADE;');
        await pool.query('DROP TABLE IF EXISTS daily_task_attempts CASCADE;');
        await pool.query('DROP TABLE IF EXISTS daily_task_logs CASCADE;');
        await pool.query('DROP TABLE IF EXISTS homeworks CASCADE;');
        await pool.query('DROP TABLE IF EXISTS question_bank CASCADE;');
        await pool.query('DROP TABLE IF EXISTS daily_tasks CASCADE;');
        await pool.query('DROP TABLE IF EXISTS materials CASCADE;');
        await pool.query('DROP TABLE IF EXISTS topics CASCADE;');
        await pool.query('DROP VIEW IF EXISTS students CASCADE;');
        await pool.query('DROP TABLE IF EXISTS students CASCADE;');
        await pool.query('DROP TABLE IF EXISTS users CASCADE;');
        
        console.log('Tables dropped successfully.');
        const sql = fs.readFileSync(path.join(__dirname, 'init.sql')).toString();
        await pool.query(sql);
        console.log('init.sql applied successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error resetting db:', err);
        process.exit(1);
    }
}
resetDB();
