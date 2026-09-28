const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const pool = require('./db');

const csvFilePath = path.join(__dirname, '..', 'Lesson Plan Programming 4C - Lesson Plan.csv');

async function seedData() {
    console.log('Starting seed process (Per Lesson) from CSV...');
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
                  
                  // 1. Insert Topic (Lesson)
                  const topicRes = await pool.query('INSERT INTO topics (name, is_locked) VALUES ($1, false) RETURNING id', [topicName]);
                  const topicId = topicRes.rows[0].id;
                  
                  // 2. Insert Material
                  const content = `
                    <h2>Objective</h2>
                    <p>${row['LEARNING OUTCOME']}</p>
                    <br>
                    <h3>Indicator</h3>
                    <p>${row['INDICATOR']}</p>
                    <br>
                    <p><strong>Date:</strong> ${row['DATE']}</p>
                    <p><strong>Thematic Area:</strong> ${row['THEMATIC AREA']}</p>
                    <p><strong>In-Class Task:</strong> ${row['IN-CLASS DAILY TASK (6 Students / 1 Hour)']}</p>
                  `;
                  await pool.query(
                      'INSERT INTO materials (topic_id, title, type, content) VALUES ($1, $2, $3, $4)',
                      [topicId, topicName, 'html', content]
                  );
                  
                  // 3. Insert 10 Daily Tasks for this Lesson
                  // We procedurally generate 10 questions using the row's metadata to ensure there are 10 unique questions.
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

                  // Insert the 10 questions
                  for (const q of qPool) {
                      await pool.query(
                          'INSERT INTO question_bank (topic_id, type, question_text, expected_answer) VALUES ($1, $2, $3, $4)',
                          [topicId, 'short_answer', q.q, q.a]
                      );
                  }
                  console.log(`Seeded Lesson ${lessonNo}`);
              }
              
              console.log('CSV Seeding (Per Lesson) Completed Successfully!');
              process.exit(0);
          } catch (err) {
              console.error('Error seeding data:', err);
              process.exit(1);
          }
      });
}

seedData();
