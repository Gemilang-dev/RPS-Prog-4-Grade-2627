const pool = require('./db');

async function seedExam() {
    try {
        // Create Exam
        const eRes = await pool.query(
            "INSERT INTO exams (title, duration_minutes, is_active) VALUES ($1, $2, true) RETURNING id",
            ['Midterm Exam: Assembly & C++', 60]
        );
        const examId = eRes.rows[0].id;

        const questions = [
            { type: 'essay', q: 'Explain the difference between a conditional and an unconditional jump in Assembly.' },
            { type: 'essay', q: 'Describe what a "Pipeline Flush" is and why an unconditional jump might cause it.' },
            { type: 'code', q: 'Write a simple C++ program that prints "Hello, World!" to the standard output.' },
            { type: 'code', q: 'Write the assembly code to load the value 10 into register AX, and then jump unconditionally to a label named "end_loop".' },
            { type: 'essay', q: 'What is the role of the Program Counter (PC) during the fetch-execute cycle?' }
        ];

        for (const q of questions) {
            await pool.query(
                "INSERT INTO exam_questions (exam_id, type, question_text) VALUES ($1, $2, $3)",
                [examId, q.type, q.q]
            );
        }

        console.log(`Successfully created dummy exam (ID: ${examId}) with 5 questions.`);
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
seedExam();
