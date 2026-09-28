const pool = require('./db');
const bcrypt = require('bcrypt');

const students = [
    { username: 'amish', name: 'Amish Mohamed' },
    { username: 'hanan', name: 'Šarić Hanan' },
    { username: 'hana', name: 'Ibrulj Hana' },
    { username: 'emina', name: 'Mešić Emina' },
    { username: 'ahmed', name: 'Delić Ahmed' },
    { username: 'hamza', name: 'Đuderija Hamza' }
];

async function addStudents() {
    try {
        const hashed = await bcrypt.hash('student123', 10);
        for (const s of students) {
            // Check if exists
            const res = await pool.query('SELECT id FROM users WHERE username = $1', [s.username]);
            if (res.rows.length === 0) {
                await pool.query(
                    "INSERT INTO users (username, password, name, role) VALUES ($1, $2, $3, 'student')",
                    [s.username, hashed, s.name]
                );
                console.log(`Added student: ${s.name} (${s.username})`);
            } else {
                console.log(`Student already exists: ${s.name}`);
            }
        }
        console.log("All students added successfully.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

addStudents();
