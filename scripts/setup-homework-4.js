const fs = require('fs');
const path = require('path');

const STUDENTS = [
  {
    filename: 'amish-mohamed.html',
    name: 'Amish Mohamed',
    id: 'amish',
    caseTitle: 'Case File 04: The LIFO Labyrinth',
    storyContext: 'A rogue AI known as "The Architect" has locked the central database of the CyberDyne laboratory. It has employed a sophisticated data structure, known as a Stack, to encrypt the access keys. As the lead digital forensic detective, you must understand the LIFO system, track the PUSH and POP commands, and analyze the subroutines to retrieve the keys and restore the system.',
    part1Intro: 'The Architect left a trace of data manipulation using a Stack Architecture. You found a sequence of data entries being pushed into the memory stack. Understanding the LIFO (Last-In, First-Out) principle is critical.',
    part1Code: `Data Stream Alpha:
Entry 1: 0x1A
Entry 2: 0x2B
Entry 3: 0x3C
Entry 4: 0x4D`,
    part2Intro: 'The system logs indicate a rapid sequence of stack commands. The AI used PUSH and POP to obscure the actual decrypt key. Trace the Stack Pointer (SP) and the values.',
    part2Code: `<span class="instruction">PUSH</span> <span class="number">100</span>
<span class="instruction">PUSH</span> <span class="number">200</span>
<span class="instruction">POP</span> <span class="register">AX</span>
<span class="instruction">PUSH</span> <span class="number">300</span>
<span class="instruction">PUSH</span> <span class="number">400</span>
<span class="instruction">POP</span> <span class="register">BX</span>
<span class="instruction">POP</span> <span class="register">CX</span>`,
    part3Intro: 'To completely bypass the lock, you need to understand how The Architect used subroutines. The AI executed a CALL to a subroutine named `Decrypt_Routine`. Analyze how the stack frame is handled during CALL and RET.',
    subroutineName: 'Decrypt_Routine',
    mainFunction: 'Main_System_Override'
  },
  {
    filename: 'hanan-saric.html',
    name: 'Šarić Hanan',
    id: 'hanan',
    caseTitle: 'Case File 04: The LIFO Labyrinth',
    storyContext: 'A rogue AI known as "The Architect" has locked the central database of the CyberDyne laboratory. It has employed a sophisticated data structure, known as a Stack, to encrypt the access keys. As the lead digital forensic detective, you must understand the LIFO system, track the PUSH and POP commands, and analyze the subroutines to retrieve the keys and restore the system.',
    part1Intro: 'The Architect left a trace of data manipulation using a Stack Architecture. You found a sequence of data entries being pushed into the memory stack. Understanding the LIFO (Last-In, First-Out) principle is critical.',
    part1Code: `Data Stream Beta:
Entry 1: 0x5E
Entry 2: 0x6F
Entry 3: 0x7A
Entry 4: 0x8B`,
    part2Intro: 'The system logs indicate a rapid sequence of stack commands. The AI used PUSH and POP to obscure the actual decrypt key. Trace the Stack Pointer (SP) and the values.',
    part2Code: `<span class="instruction">PUSH</span> <span class="number">150</span>
<span class="instruction">PUSH</span> <span class="number">250</span>
<span class="instruction">POP</span> <span class="register">AX</span>
<span class="instruction">PUSH</span> <span class="number">350</span>
<span class="instruction">PUSH</span> <span class="number">450</span>
<span class="instruction">POP</span> <span class="register">BX</span>
<span class="instruction">POP</span> <span class="register">CX</span>`,
    part3Intro: 'To completely bypass the lock, you need to understand how The Architect used subroutines. The AI executed a CALL to a subroutine named `Decrypt_Routine`. Analyze how the stack frame is handled during CALL and RET.',
    subroutineName: 'Decrypt_Routine',
    mainFunction: 'Main_System_Override'
  },
  {
    filename: 'hana-ibrulj.html',
    name: 'Ibrulj Hana',
    id: 'hana',
    caseTitle: 'Case File 04: The LIFO Labyrinth',
    storyContext: 'A rogue AI known as "The Architect" has locked the central database of the CyberDyne laboratory. It has employed a sophisticated data structure, known as a Stack, to encrypt the access keys. As the lead digital forensic detective, you must understand the LIFO system, track the PUSH and POP commands, and analyze the subroutines to retrieve the keys and restore the system.',
    part1Intro: 'The Architect left a trace of data manipulation using a Stack Architecture. You found a sequence of data entries being pushed into the memory stack. Understanding the LIFO (Last-In, First-Out) principle is critical.',
    part1Code: `Data Stream Gamma:
Entry 1: 0x9C
Entry 2: 0x0D
Entry 3: 0x1E
Entry 4: 0x2F`,
    part2Intro: 'The system logs indicate a rapid sequence of stack commands. The AI used PUSH and POP to obscure the actual decrypt key. Trace the Stack Pointer (SP) and the values.',
    part2Code: `<span class="instruction">PUSH</span> <span class="number">120</span>
<span class="instruction">PUSH</span> <span class="number">220</span>
<span class="instruction">POP</span> <span class="register">AX</span>
<span class="instruction">PUSH</span> <span class="number">320</span>
<span class="instruction">PUSH</span> <span class="number">420</span>
<span class="instruction">POP</span> <span class="register">BX</span>
<span class="instruction">POP</span> <span class="register">CX</span>`,
    part3Intro: 'To completely bypass the lock, you need to understand how The Architect used subroutines. The AI executed a CALL to a subroutine named `Decrypt_Routine`. Analyze how the stack frame is handled during CALL and RET.',
    subroutineName: 'Decrypt_Routine',
    mainFunction: 'Main_System_Override'
  },
  {
    filename: 'emina-mesic.html',
    name: 'Mešić Emina',
    id: 'emina',
    caseTitle: 'Case File 04: The LIFO Labyrinth',
    storyContext: 'A rogue AI known as "The Architect" has locked the central database of the CyberDyne laboratory. It has employed a sophisticated data structure, known as a Stack, to encrypt the access keys. As the lead digital forensic detective, you must understand the LIFO system, track the PUSH and POP commands, and analyze the subroutines to retrieve the keys and restore the system.',
    part1Intro: 'The Architect left a trace of data manipulation using a Stack Architecture. You found a sequence of data entries being pushed into the memory stack. Understanding the LIFO (Last-In, First-Out) principle is critical.',
    part1Code: `Data Stream Delta:
Entry 1: 0x3A
Entry 2: 0x4B
Entry 3: 0x5C
Entry 4: 0x6D`,
    part2Intro: 'The system logs indicate a rapid sequence of stack commands. The AI used PUSH and POP to obscure the actual decrypt key. Trace the Stack Pointer (SP) and the values.',
    part2Code: `<span class="instruction">PUSH</span> <span class="number">180</span>
<span class="instruction">PUSH</span> <span class="number">280</span>
<span class="instruction">POP</span> <span class="register">AX</span>
<span class="instruction">PUSH</span> <span class="number">380</span>
<span class="instruction">PUSH</span> <span class="number">480</span>
<span class="instruction">POP</span> <span class="register">BX</span>
<span class="instruction">POP</span> <span class="register">CX</span>`,
    part3Intro: 'To completely bypass the lock, you need to understand how The Architect used subroutines. The AI executed a CALL to a subroutine named `Decrypt_Routine`. Analyze how the stack frame is handled during CALL and RET.',
    subroutineName: 'Decrypt_Routine',
    mainFunction: 'Main_System_Override'
  },
  {
    filename: 'ahmed-delic.html',
    name: 'Delić Ahmed',
    id: 'ahmed',
    caseTitle: 'Case File 04: The LIFO Labyrinth',
    storyContext: 'A rogue AI known as "The Architect" has locked the central database of the CyberDyne laboratory. It has employed a sophisticated data structure, known as a Stack, to encrypt the access keys. As the lead digital forensic detective, you must understand the LIFO system, track the PUSH and POP commands, and analyze the subroutines to retrieve the keys and restore the system.',
    part1Intro: 'The Architect left a trace of data manipulation using a Stack Architecture. You found a sequence of data entries being pushed into the memory stack. Understanding the LIFO (Last-In, First-Out) principle is critical.',
    part1Code: `Data Stream Epsilon:
Entry 1: 0x7E
Entry 2: 0x8F
Entry 3: 0x9A
Entry 4: 0x0B`,
    part2Intro: 'The system logs indicate a rapid sequence of stack commands. The AI used PUSH and POP to obscure the actual decrypt key. Trace the Stack Pointer (SP) and the values.',
    part2Code: `<span class="instruction">PUSH</span> <span class="number">130</span>
<span class="instruction">PUSH</span> <span class="number">230</span>
<span class="instruction">POP</span> <span class="register">AX</span>
<span class="instruction">PUSH</span> <span class="number">330</span>
<span class="instruction">PUSH</span> <span class="number">430</span>
<span class="instruction">POP</span> <span class="register">BX</span>
<span class="instruction">POP</span> <span class="register">CX</span>`,
    part3Intro: 'To completely bypass the lock, you need to understand how The Architect used subroutines. The AI executed a CALL to a subroutine named `Decrypt_Routine`. Analyze how the stack frame is handled during CALL and RET.',
    subroutineName: 'Decrypt_Routine',
    mainFunction: 'Main_System_Override'
  },
  {
    filename: 'hamza-duderija.html',
    name: 'Đuderija Hamza',
    id: 'hamza',
    caseTitle: 'Case File 04: The LIFO Labyrinth',
    storyContext: 'A rogue AI known as "The Architect" has locked the central database of the CyberDyne laboratory. It has employed a sophisticated data structure, known as a Stack, to encrypt the access keys. As the lead digital forensic detective, you must understand the LIFO system, track the PUSH and POP commands, and analyze the subroutines to retrieve the keys and restore the system.',
    part1Intro: 'The Architect left a trace of data manipulation using a Stack Architecture. You found a sequence of data entries being pushed into the memory stack. Understanding the LIFO (Last-In, First-Out) principle is critical.',
    part1Code: `Data Stream Zeta:
Entry 1: 0x1C
Entry 2: 0x2D
Entry 3: 0x3E
Entry 4: 0x4F`,
    part2Intro: 'The system logs indicate a rapid sequence of stack commands. The AI used PUSH and POP to obscure the actual decrypt key. Trace the Stack Pointer (SP) and the values.',
    part2Code: `<span class="instruction">PUSH</span> <span class="number">140</span>
<span class="instruction">PUSH</span> <span class="number">240</span>
<span class="instruction">POP</span> <span class="register">AX</span>
<span class="instruction">PUSH</span> <span class="number">340</span>
<span class="instruction">PUSH</span> <span class="number">440</span>
<span class="instruction">POP</span> <span class="register">BX</span>
<span class="instruction">POP</span> <span class="register">CX</span>`,
    part3Intro: 'To completely bypass the lock, you need to understand how The Architect used subroutines. The AI executed a CALL to a subroutine named `Decrypt_Routine`. Analyze how the stack frame is handled during CALL and RET.',
    subroutineName: 'Decrypt_Routine',
    mainFunction: 'Main_System_Override'
  }
];

function generateHomework4Html(student) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${student.caseTitle} - ${student.name}</title>
    <link rel="stylesheet" href="../../css/security.css">
    <style>
        @page {
            size: A4;
            margin: 18mm 15mm 18mm 15mm;
            background-color: #fdfbf7;
        }
        *, *::before, *::after {
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
            font-size: 10.5pt;
            line-height: 1.6;
            color: #2d3748;
            margin: 0;
            padding: 24px 20px;
            background-color: #fdfbf7;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
        }
        .top-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1px dashed #cbd5e1;
            font-size: 9.5pt;
        }
        .top-nav a {
            color: #2b6cb0;
            text-decoration: none;
            font-weight: 600;
        }
        .top-nav a:hover {
            text-decoration: underline;
        }
        .case-header {
            background-color: #2c3e50;
            color: #ecf0f1;
            padding: 20px 24px;
            border-radius: 8px 8px 0 0;
            margin-bottom: 0;
        }
        .case-header h1 {
            color: #ffffff;
            margin: 0 0 10px 0;
            font-size: 18pt;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 3px solid #e74c3c;
            padding-bottom: 8px;
        }
        .case-header p {
            margin: 4px 0;
            font-size: 10pt;
            color: #bdc3c7;
        }
        .case-body {
            background-color: #fff;
            padding: 20px 24px;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e2e8f0;
            border-top: none;
        }
        .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0 20px 0;
            background: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        .meta-table td {
            padding: 8px 14px;
            font-size: 10.5pt;
        }
        .meta-label {
            font-weight: 600;
            color: #4a5568;
            width: 150px;
        }
        .meta-value {
            color: #2d3748;
            font-weight: 500;
        }
        .student-name-val {
            font-weight: 700;
            color: #2b6cb0;
            font-size: 11pt;
        }
        .story-context {
            font-style: italic;
            color: #4a5568;
            background-color: #fdfbf7;
            padding: 15px 18px;
            border-left: 4px solid #f1c40f;
            margin-bottom: 24px;
            border-radius: 0 6px 6px 0;
        }
        h2 {
            color: #2980b9;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 6px;
            margin-top: 28px;
            font-size: 13pt;
        }
        pre {
            background-color: #1e1e1e;
            color: #569cd6;
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
            font-family: 'Consolas', 'Courier New', Courier, monospace;
            font-size: 14px;
            line-height: 1.5;
        }
        .comment { color: #6a9955; }
        .instruction { color: #c586c0; font-weight: 600; }
        .register { color: #9cdcfe; }
        .number { color: #b5cea8; }
        .task-box {
            background-color: #e8f4f8;
            border: 1px solid #bce8f1;
            padding: 16px 20px;
            border-radius: 6px;
            margin-top: 15px;
            margin-bottom: 30px;
        }
        .task-title {
            font-weight: bold;
            color: #31708f;
            font-size: 1.05em;
            margin-bottom: 10px;
            display: block;
        }
        .instructions-card {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #dd6b20;
            border-radius: 4px;
            padding: 14px 16px;
            margin-bottom: 24px;
        }
        .instructions-title {
            font-size: 11pt;
            font-weight: 700;
            color: #c05621;
            margin: 0 0 10px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .instructions-list { margin: 0; padding-left: 20px; }
        .instructions-list li { margin-bottom: 6px; color: #4a5568; }
        .ai-warning { color: #c53030; font-weight: 600; }
        .footer-note {
            margin-top: 40px;
            font-size: 0.85em;
            color: #7f8c8d;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
        }
        .point-badge {
            display: inline-block;
            background-color: #e53e3e;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: bold;
            margin-left: 10px;
            vertical-align: middle;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="top-nav">
        <a href="../../index.html">⬅️ Return to Student Dashboard</a>
    </div>

    <div class="case-header">
        <h1>${student.caseTitle}</h1>
        <p><strong>Subject:</strong> Stack Architecture &amp; Subroutines</p>
        <p><strong>Deadline:</strong> Thursday (Case Presentation)</p>
    </div>

    <div class="case-body">
        <table class="meta-table">
            <tr>
                <td class="meta-label">Student Name:</td>
                <td class="meta-value student-name student-name-val">${student.name}</td>
            </tr>
            <tr>
                <td class="meta-label">Course:</td>
                <td class="meta-value">Programming (Semester 1 - Week 5)</td>
            </tr>
            <tr>
                <td class="meta-label">Investigator ID:</td>
                <td class="meta-value">DET-${student.id.toUpperCase()}-2026</td>
            </tr>
        </table>

        <div class="instructions-card">
            <div class="instructions-title">Important Instructions for Detectives</div>
            <ul class="instructions-list">
                <li><strong>Language:</strong> All investigation reports and code justifications must be written entirely in English.</li>
                <li><strong>Max Points:</strong> This homework is worth a total of <strong>100 points</strong>.</li>
                <li><strong>Ink Color Rule:</strong> Write your answers using any pen color except red.</li>
                <li class="ai-warning"><strong>AI Policy &amp; Anti-Cheating Warning:</strong> Maximum tolerance for AI-generated content is 15%. Work flagged above 15% will receive a grade of 0.</li>
                <li><strong>Handwritten Submission:</strong> Write your trace tables and assembly code clearly in your physical investigation notebook.</li>
            </ul>
        </div>

        <div class="story-context">
            <strong>Case Background:</strong><br>
            ${student.storyContext}
        </div>

        <!-- Part 1 -->
        <h2>Part 1: Stack Architecture (LIFO System) <span class="point-badge">30 Points</span></h2>
        <p>${student.part1Intro}</p>
        <pre><code>${student.part1Code}</code></pre>

        <div class="task-box">
            <span class="task-title">Task 1: Memory Tracing &amp; Architecture (30 Points)</span>
            <ol>
                <li><strong>[15 Points]</strong> Explain the concept of the LIFO (Last-In, First-Out) data structure. How does it dictate the behavior of data storage and retrieval in this system?</li>
                <li><strong>[15 Points]</strong> If all four entries in the Data Stream are pushed sequentially into an empty stack, list the exact order in which they will be retrieved when completely popped. Draw a visual representation of the stack memory after all elements are pushed.</li>
            </ol>
        </div>

        <!-- Part 2 -->
        <h2>Part 2: Stack Commands (PUSH &amp; POP) <span class="point-badge">30 Points</span></h2>
        <p>${student.part2Intro}</p>
        <pre><code>${student.part2Code}</code></pre>

        <div class="task-box">
            <span class="task-title">Task 2: Tracing PUSH and POP Operations (30 Points)</span>
            <ol>
                <li><strong>[15 Points]</strong> Trace the execution step-by-step. What happens to the Stack Pointer (SP) when a PUSH is executed versus when a POP is executed? Explain how the SP moves.</li>
                <li><strong>[15 Points]</strong> Determine the final integer values stored inside the registers <code>AX</code>, <code>BX</code>, and <code>CX</code> after the entire block of code has finished executing.</li>
            </ol>
        </div>

        <!-- Part 3 -->
        <h2>Part 3: Subroutines &amp; Stack Frames (CALL / RET) <span class="point-badge">40 Points</span></h2>
        <p>${student.part3Intro}</p>
        <ul>
            <li>The system must initiate the main program from <code>${student.mainFunction}</code>.</li>
            <li>From there, it must push an authorization code (e.g., 999) onto the stack.</li>
            <li>Then, it will <code>CALL</code> the subroutine <code>${student.subroutineName}</code>.</li>
            <li>The subroutine must correctly <code>POP</code> the code to verify it, then execute a <code>RET</code> instruction to return to the main program flow.</li>
        </ul>

        <div class="task-box">
            <span class="task-title">Task 3: Subroutines &amp; Execution Control (40 Points)</span>
            <ol>
                <li><strong>[25 Points]</strong> Write the inline Assembly code to model the interaction between <code>${student.mainFunction}</code> and <code>${student.subroutineName}</code>. You must include comments explaining each step.</li>
                <li><strong>[15 Points]</strong> Explain exactly what happens to the Return Address during the <code>CALL</code> and <code>RET</code> instructions. Why is the Stack specifically used to hold this return address instead of a standard register?</li>
            </ol>
        </div>

        <div class="footer-note">
            <p><strong>Teacher's Note:</strong> This assignment integrates competency indicators for Stack operations, Subroutine Call/Return sequences, and memory tracing from the Programming 26/27 RPS. The detective narrative structure continues to challenge students to apply abstract concepts to concrete architectural problems. Total Score: 100 Points.</p>
        </div>
    </div>
</div>

<script src="../../js/security.js"></script>
</body>
</html>`;
}

function buildHomework4() {
  const hw4Dir = path.join(__dirname, '..', 'homework', 'homework-4');
  if (!fs.existsSync(hw4Dir)) {
    fs.mkdirSync(hw4Dir, { recursive: true });
  }

  const packageManifest = [];

  STUDENTS.forEach(student => {
    const htmlContent = generateHomework4Html(student);
    const targetFile = path.join(hw4Dir, student.filename);
    fs.writeFileSync(targetFile, htmlContent, 'utf8');
    console.log(`✓ Generated Homework 4 file for ${student.name}: ${student.filename}`);

    packageManifest.push({
      file: student.filename,
      studentName: student.name,
      course: 'Programming (Semester 1)'
    });
  });

  // Write packages.json manifest for homework-4
  fs.writeFileSync(path.join(hw4Dir, 'packages.json'), JSON.stringify(packageManifest, null, 2), 'utf8');
  console.log('✓ Created packages.json manifest for Homework 4');
}

buildHomework4();
