-- Init script for PostgreSQL database

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'student' -- 'student' or 'admin'
);

-- (Legacy compatibility for existing 'students' table usage)
CREATE OR REPLACE VIEW students AS SELECT * FROM users WHERE role = 'student';

CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_locked BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(20) DEFAULT 'html', -- 'pdf', 'md', 'html'
    content TEXT,
    file_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS question_bank (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
    type VARCHAR(20) DEFAULT 'short_answer', -- 'short_answer', 'code'
    question_text TEXT NOT NULL,
    image_url VARCHAR(255),
    expected_answer TEXT
);

CREATE TABLE IF NOT EXISTS homeworks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    folder_name VARCHAR(50) -- e.g., 'homework-1'
);

CREATE TABLE IF NOT EXISTS daily_task_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES question_bank(id) ON DELETE CASCADE,
    user_answer TEXT,
    is_correct BOOLEAN,
    attempt_number INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exams (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS exam_questions (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    type VARCHAR(20) DEFAULT 'theory', -- 'theory', 'coding'
    question_text TEXT NOT NULL,
    image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS exam_submissions (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'terminated_cheating'
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_answers (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER REFERENCES exam_submissions(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES exam_questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    score INTEGER DEFAULT 0 -- For manual grading
);

-- Insert dummy admin if not exists
-- (Admin logic will be handled by backend index.js seeding)
