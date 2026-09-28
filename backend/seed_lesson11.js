const pool = require('./db');

const questions = [
    { q: "What register does the JMP instruction directly modify?", a: "Program Counter" },
    { q: "Does an unconditional jump evaluate the CPU status flags? (Yes/No)", a: "No" },
    { q: "What is the primary assembly mnemonic for an unconditional jump?", a: "JMP" },
    { q: "What happens to the instruction pipeline when a JMP is executed?", a: "Flush" },
    { q: "Can a JMP instruction be used to create an infinite loop? (Yes/No)", a: "Yes" },
    { q: "Write the assembly instruction to unconditionally jump to a label named 'start'.", type: "code", a: "JMP start" },
    { q: "What CPU component orchestrates the overwriting of the PC during a jump?", a: "Control Unit" },
    { q: "Unlike JE or JNE, JMP is an ____________ jump.", a: "Unconditional" },
    { q: "In a high-level IF-ELSE block, what assembly jump is typically used at the end of the IF block to skip the ELSE block?", a: "JMP" },
    { q: "What modern CPU feature attempts to mitigate the performance cost of jumps?", a: "Branch Predictor" }
];

async function insertQuestions() {
    try {
        // Delete old procedural questions for topic 11
        await pool.query('DELETE FROM question_bank WHERE topic_id = 11');
        
        for (const q of questions) {
            await pool.query(
                'INSERT INTO question_bank (topic_id, type, question_text, expected_answer) VALUES ($1, $2, $3, $4)',
                [11, q.type || 'short_answer', q.q, q.a]
            );
        }
        console.log("Successfully inserted 10 A-Level questions for Lesson 11.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
insertQuestions();
