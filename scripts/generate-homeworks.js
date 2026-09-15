/**
 * Generator Script: Builds homework folders 1 to 16 with package HTML files
 * Each package file contains an explicit <header> with the student's name.
 */

const fs = require('fs');
const path = require('path');

const STUDENTS = [
  // Grade 4A
  { id: "4A-01", pkg: 1, name: "Aditya Pratama", class: "4A", rollNo: 1, nis: "26274001" },
  { id: "4A-02", pkg: 2, name: "Alisha Putri Khairunnisa", class: "4A", rollNo: 2, nis: "26274002" },
  { id: "4A-03", pkg: 3, name: "Bagas Arya Sena", class: "4A", rollNo: 3, nis: "26274003" },
  { id: "4A-04", pkg: 4, name: "Chelsea Olivia Wijaya", class: "4A", rollNo: 4, nis: "26274004" },
  { id: "4A-05", pkg: 5, name: "Darrell Evan Kurniawan", class: "4A", rollNo: 5, nis: "26274005" },
  { id: "4A-06", pkg: 6, name: "Fakhri Ahmadinejad", class: "4A", rollNo: 6, nis: "26274006" },
  { id: "4A-07", pkg: 7, name: "Gracia Aurelia Tan", class: "4A", rollNo: 7, nis: "26274007" },
  { id: "4A-08", pkg: 8, name: "Hafizh Rayhan Al-Fatih", class: "4A", rollNo: 8, nis: "26274008" },
  { id: "4A-09", pkg: 9, name: "Keisha Naura Shaqueena", class: "4A", rollNo: 9, nis: "26274009" },
  { id: "4A-10", pkg: 10, name: "Marvel Jonathan Lee", class: "4A", rollNo: 10, nis: "26274010" },
  { id: "4A-11", pkg: 11, name: "Nadine Kirana Larasati", class: "4A", rollNo: 11, nis: "26274011" },
  { id: "4A-12", pkg: 12, name: "Rafi Danendra Putra", class: "4A", rollNo: 12, nis: "26274012" },
  { id: "4A-13", pkg: 13, name: "Samuel Alexander Situmorang", class: "4A", rollNo: 13, nis: "26274013" },
  { id: "4A-14", pkg: 14, name: "Zahra Salsabila Ramadhani", class: "4A", rollNo: 14, nis: "26274014" },

  // Grade 4B
  { id: "4B-01", pkg: 15, name: "Aldo Christian Nugroho", class: "4B", rollNo: 1, nis: "26274015" },
  { id: "4B-02", pkg: 16, name: "Anindya Nareswari", class: "4B", rollNo: 2, nis: "26274016" },
  { id: "4B-03", pkg: 17, name: "Bima Satria Wicaksono", class: "4B", rollNo: 3, nis: "26274017" },
  { id: "4B-04", pkg: 18, name: "Clarissa Natalie Putri", class: "4B", rollNo: 4, nis: "26274018" },
  { id: "4B-05", pkg: 19, name: "Daffa Ibnu Hafidz", class: "4B", rollNo: 5, nis: "26274019" },
  { id: "4B-06", pkg: 20, name: "Fiona Michelle Ang", class: "4B", rollNo: 6, nis: "26274020" },
  { id: "4B-07", pkg: 21, name: "Galang Surya Pratama", class: "4B", rollNo: 7, nis: "26274021" },
  { id: "4B-08", pkg: 22, name: "Hana Az-Zahra", class: "4B", rollNo: 8, nis: "26274022" },
  { id: "4B-09", pkg: 23, name: "Jonathan William Hartono", class: "4B", rollNo: 9, nis: "26274023" },
  { id: "4B-10", pkg: 24, name: "Kayla Nadira Pramudita", class: "4B", rollNo: 10, nis: "26274024" },
  { id: "4B-11", pkg: 25, name: "Michael Bryan Chandra", class: "4B", rollNo: 11, nis: "26274025" },
  { id: "4B-12", pkg: 26, name: "Nayla Syarifah", class: "4B", rollNo: 12, nis: "26274026" },
  { id: "4B-13", pkg: 27, name: "Revan Aditya Kurniawan", class: "4B", rollNo: 13, nis: "26274027" },
  { id: "4B-14", pkg: 28, name: "Syifa Aulia Rahma", class: "4B", rollNo: 14, nis: "26274028" }
];

const HOMEWORKS = [
  { num: 1, title: "Algorithm Sequences & Robot Navigation", topic: "Sequential Execution & Grid Paths", icon: "🤖" },
  { num: 2, title: "Directional Commands & Coordinate Systems", topic: "X-Y Coordinates & Spatial Reasoning", icon: "🧭" },
  { num: 3, title: "Pattern Recognition & Problem Decomposition", topic: "Computational Thinking Fundamentals", icon: "🧩" },
  { num: 4, title: "Conditional Logic: If - Then Statements", topic: "Single-Path Decision Making", icon: "🚦" },
  { num: 5, title: "Branching Logic: If - Then - Else Actions", topic: "Two-Way Branching Decisions", icon: "🔀" },
  { num: 6, title: "Sensor Input Decisions & Safety Checks", topic: "Multi-Sensor Trigger Systems", icon: "📡" },
  { num: 7, title: "Introduction to Counted Repeat Loops", topic: "Iteration & Code Compression", icon: "🔁" },
  { num: 8, title: "Drawing Geometric Shapes with Loops", topic: "Turtle Geometry & Polygon Angles", icon: "📐" },
  { num: 9, title: "Nested Loops & Matrix Grid Patterns", topic: "Loops Inside Loops (2D Patterns)", icon: "🧱" },
  { num: 10, title: "Mid-Term Quest: Maze Algorithm Challenge", topic: "Comprehensive Logic Synthesis", icon: "🏆" },
  { num: 11, title: "Introduction to Variables: Storing Data", topic: "Score, Coins, & Health Variables", icon: "⭐" },
  { num: 12, title: "Variable Arithmetic: Bonus Multipliers", topic: "Math Operations on Variables", icon: "➕" },
  { num: 13, title: "Event-Driven Programming & User Controls", topic: "Key Presses & Mouse Clicks", icon: "🎮" },
  { num: 14, title: "Broadcast Messaging Between Sprites", topic: "Signal Sending & Message Receivers", icon: "📢" },
  { num: 15, title: "Algorithmic Debugging & Bug Hunting", topic: "Tracing & Fixing Logic Errors", icon: "🐞" },
  { num: 16, title: "Final Capstone Project: Mini-Game Engine", topic: "Game Loop & Scoring Architecture", icon: "🚀" }
];

// Generate student-specific problem parameters
function getProblemDetails(hwNum, student) {
  const seed = (student.rollNo * 43 + student.name.charCodeAt(0) * 17 + hwNum * 79) % 1000;
  const token = `HW${hwNum.toString().padStart(2, '0')}-${student.class}-${student.rollNo.toString().padStart(2, '0')}-${seed.toString(16).toUpperCase()}`;

  const robotNames = ["Astro-Bot", "Cyber-Fox", "Robo-Falcon", "Neo-Lion", "Titan-Bear", "Echo-Ranger"];
  const robotName = robotNames[seed % robotNames.length];

  const startX = (seed % 4) + 1;
  const startY = ((seed * 3) % 4) + 1;
  const targetX = startX + ((seed % 3) + 2);
  const targetY = startY + (((seed * 7) % 3) + 2);
  const obstacleX = startX + 1;
  const obstacleY = startY;

  const threshold = 25 + (seed % 35);
  const sensorValue1 = threshold - ((seed % 8) + 3);
  const sensorValue2 = threshold + ((seed % 9) + 4);

  const repeatTimes = (seed % 4) + 3;
  const stepPixels = 30 + (seed % 6) * 10;

  const initialScore = 20 + (seed % 40);
  const coinBonus = ((seed % 4) + 2) * 5;
  const trapPenalty = ((seed % 3) + 1) * 5;
  const collectedCoins = (seed % 5) + 3;
  const hitTraps = (seed % 3) + 1;

  return {
    token,
    robotName,
    startX, startY,
    targetX, targetY,
    obstacleX, obstacleY,
    threshold, sensorValue1, sensorValue2,
    repeatTimes, stepPixels,
    initialScore, coinBonus, trapPenalty, collectedCoins, hitTraps
  };
}

// Generate HTML content for a student question package
function generatePackageHtml(hw, student) {
  const p = getProblemDetails(hw.num, student);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${student.name} - Homework ${hw.num}: ${hw.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../css/style.css">
  <link rel="stylesheet" href="../../css/security.css">
</head>
<body>

  <!-- Navigation Bar -->
  <header class="navbar">
    <div class="nav-container">
      <a href="../../index.html" class="brand">
        <div class="brand-icon">💻</div>
        <div class="brand-info">
          <span class="brand-title">Elementary Programming Portal</span>
          <span class="brand-subtitle">Grade 4 • A.Y. 2026/2027</span>
        </div>
      </a>
      <div class="nav-badges">
        <span class="badge-tag">HW-${hw.num.toString().padStart(2, '0')}</span>
        <span class="badge-tag shield">🔒 Anti-AI Protected</span>
      </div>
    </div>
  </header>

  <!-- Main Content Wrapper -->
  <main class="main-wrapper">
    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumbs">
      <a href="../../index.html">🏠 Home</a>
      <span class="breadcrumb-separator">/</span>
      <a href="index.html">Homework ${hw.num} Packages</a>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">${student.name}</span>
    </nav>

    <!-- Security Warning Alert -->
    <div class="security-alert-box">
      <div class="alert-icon">🛡️</div>
      <div class="alert-text">
        <strong>Academic Honesty Shield Active:</strong> Text selection, right-click, keyboard copy shortcuts, and print-to-PDF have been disabled. This personalized problem set is tailored for <strong>${student.name}</strong>. Please solve it independently in your programming notebook!
      </div>
    </div>

    <!-- Layout: Question Container & Sidebar -->
    <div class="soal-layout">
      <!-- Main Column: Student's Specific Question Package -->
      <article class="canvas-card" style="align-items: stretch;">

        <!-- ================================================================= -->
        <!-- STUDENT IDENTIFICATION HEADER                                     -->
        <!-- The package name and student name are defined here in the header  -->
        <!-- ================================================================= -->
        <header class="package-header" style="background: linear-gradient(135deg, #1e3a8a, #2563eb); color: white; padding: 1.75rem; border-radius: 12px; margin-bottom: 1.5rem; position: relative; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
            <span class="package-id-badge" style="background: rgba(255,255,255,0.2); padding: 0.3rem 0.8rem; border-radius: 999px; font-size: 0.8rem; font-weight: 800; letter-spacing: 0.5px; border: 1px solid rgba(255,255,255,0.3);">
              QUESTION PACKAGE #${student.pkg.toString().padStart(2, '0')}
            </span>
            <span style="font-family: monospace; font-size: 0.85rem; background: rgba(0,0,0,0.25); padding: 0.25rem 0.65rem; border-radius: 6px;">
              TOKEN: ${p.token}
            </span>
          </div>
          <h1 class="student-name" style="font-size: 1.75rem; font-weight: 800; margin-bottom: 0.4rem; color: #ffffff;">
            ${student.name}
          </h1>
          <div class="student-meta" style="color: #bfdbfe; font-size: 0.9rem; font-weight: 600;">
            Grade 4 • Class ${student.class} • Roll No. ${student.rollNo} • Student ID: ${student.nis}
          </div>
        </header>

        <!-- Homework Topic & Objectives -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; margin-bottom: 1.5rem;">
          <div style="font-size: 0.8rem; text-transform: uppercase; font-weight: 800; color: #2563eb; margin-bottom: 0.25rem;">
            Assignment Title
          </div>
          <h2 style="font-size: 1.3rem; color: #0f172a; margin-bottom: 0.5rem;">
            ${hw.icon} Homework ${hw.num}: ${hw.title}
          </h2>
          <p style="color: #64748b; font-size: 0.95rem;">
            Topic: <strong>${hw.topic}</strong>
          </p>
        </div>

        <!-- Student's Unique Scenario Card -->
        <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 10px; padding: 1.25rem; margin-bottom: 1.5rem;">
          <h3 style="color: #1e40af; font-size: 1.05rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>📖</span>
            <span>Your Personalized Scenario</span>
          </h3>
          <p style="color: #1e293b; font-size: 0.95rem; line-height: 1.6; margin-bottom: 0.75rem;">
            Your assigned robotic explorer is named <strong>${p.robotName}</strong>. In your simulation grid, ${p.robotName} starts at coordinates <strong>(${p.startX}, ${p.startY})</strong> facing North. The primary objective is located at <strong>(${p.targetX}, ${p.targetY})</strong>. Watch out for the hazard barrier positioned at <strong>(${p.obstacleX}, ${p.obstacleY})</strong>!
          </p>
          <div style="background: white; border: 1px dashed #93c5fd; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.88rem; color: #1e40af;">
            ⚡ <strong>Mission Parameters:</strong> Sensor Threshold = <strong>${p.threshold} units</strong> | Step Stride = <strong>${p.stepPixels} px</strong> | Repetition Cycle = <strong>${p.repeatTimes}x</strong> | Starting Wallet = <strong>${p.initialScore} coins</strong>.
          </div>
        </div>

        <!-- Question 1 -->
        <div style="border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; margin-bottom: 1.25rem; background: white;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-weight: 800; color: #2563eb; font-size: 0.95rem;">Question 1: Algorithm Analysis</span>
            <span style="font-size: 0.8rem; background: #eff6ff; color: #1d4ed8; padding: 0.2rem 0.6rem; border-radius: 999px; font-weight: 700;">25 Points</span>
          </div>
          <p style="color: #334155; font-size: 0.95rem; line-height: 1.55;">
            Calculate the shortest possible path (minimum step count) for <strong>${p.robotName}</strong> to navigate from starting point <strong>(${p.startX}, ${p.startY})</strong> to the destination point <strong>(${p.targetX}, ${p.targetY})</strong> without passing through coordinate <strong>(${p.obstacleX}, ${p.obstacleY})</strong>. Explain each move clearly in your notebook.
          </p>
        </div>

        <!-- Question 2 -->
        <div style="border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; margin-bottom: 1.25rem; background: white;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-weight: 800; color: #2563eb; font-size: 0.95rem;">Question 2: Conditional Decision Tree</span>
            <span style="font-size: 0.8rem; background: #eff6ff; color: #1d4ed8; padding: 0.2rem 0.6rem; border-radius: 999px; font-weight: 700;">35 Points</span>
          </div>
          <p style="color: #334155; font-size: 0.95rem; line-height: 1.55; margin-bottom: 0.5rem;">
            Suppose your robot reads a sensor input of <strong>${p.sensorValue1} units</strong> at 09:00 AM, and later reads <strong>${p.sensorValue2} units</strong> at 02:00 PM. Based on your target threshold of <strong>${p.threshold} units</strong>:
          </p>
          <ul style="padding-left: 1.5rem; color: #475569; font-size: 0.9rem; line-height: 1.6;">
            <li>If sensor value &lt; ${p.threshold}: Execute safe traversal and record green status.</li>
            <li>If sensor value &gt;= ${p.threshold}: Halt motors, emit warning chime, and turn 90° right.</li>
          </ul>
          <p style="color: #334155; font-size: 0.95rem; margin-top: 0.5rem;">
            Write down the exact sequence of actions taken by the robot for both sensor readings.
          </p>
        </div>

        <!-- Question 3 -->
        <div style="border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; margin-bottom: 1.5rem; background: white;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-weight: 800; color: #2563eb; font-size: 0.95rem;">Question 3: Code Loop & Variable Computation</span>
            <span style="font-size: 0.8rem; background: #eff6ff; color: #1d4ed8; padding: 0.2rem 0.6rem; border-radius: 999px; font-weight: 700;">40 Points</span>
          </div>
          <p style="color: #334155; font-size: 0.95rem; line-height: 1.55;">
            In the game bonus phase, <strong>${student.name}</strong> begins with <strong>${p.initialScore} coins</strong>. For each star collected, <strong>+${p.coinBonus} coins</strong> are earned. For each trap collision, <strong>-${p.trapPenalty} coins</strong> are deducted. If your sprite collected <strong>${p.collectedCoins} stars</strong> and hit <strong>${p.hitTraps} traps</strong>, calculate the final score and construct a repeat loop block in pseudocode or Scratch format!
          </p>
        </div>

        <!-- Academic Honesty Notice -->
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 1rem 1.25rem;">
          <div style="font-weight: 800; color: #b91c1c; font-size: 0.9rem; margin-bottom: 0.25rem;">
            💡 Submission Instructions:
          </div>
          <p style="color: #7f1d1d; font-size: 0.88rem; line-height: 1.5;">
            Write your answers legibly in your school programming notebook. Please write your <strong>Full Name (${student.name})</strong>, <strong>Class (${student.class})</strong>, and <strong>Verification Token (${p.token})</strong> at the top of your answer sheet.
          </p>
        </div>
      </article>

      <!-- Sidebar Column -->
      <aside class="soal-sidebar">
        <!-- Student Badge Card -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">
            <span>👤</span>
            <span>Student Verification</span>
          </h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Student Name</span>
              <span class="info-value">${student.name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Class & Roll</span>
              <span class="info-value">Class ${student.class} • No. ${student.rollNo}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Student ID</span>
              <span class="info-value">${student.nis}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Assigned Package</span>
              <span class="info-value" style="color: #2563eb;">Package #${student.pkg.toString().padStart(2, '0')}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Security Token</span>
              <span class="info-value" style="font-family: monospace; color: #dc2626;">${p.token}</span>
            </div>
          </div>
        </div>

        <!-- Submission Rules -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">
            <span>📝</span>
            <span>Submission Checklist</span>
          </h3>
          <ul class="instructions-steps">
            <li>Write your answers independently in your physical notebook.</li>
            <li>Include your Verification Token on the top-right corner.</li>
            <li>Diagram the robot path and show all mathematical steps.</li>
            <li>Submit your notebook during the next classroom session.</li>
          </ul>
        </div>

        <!-- Navigation Buttons -->
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <a href="index.html" class="btn-back-nav" style="justify-content: center;">
            <span>👥 Back to Packages (HW ${hw.num})</span>
          </a>
          <a href="../../index.html" class="btn-back-nav" style="justify-content: center;">
            <span>🏠 Main Portal Home</span>
          </a>
        </div>
      </aside>
    </div>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-content">
      <p><strong>Grade 4 Programming Homework Portal</strong> • Academic Year 2026/2027</p>
      <div class="footer-shield">
        <span>🛡️</span>
        <span>Empowering genuine logical thinking without AI shortcuts</span>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="../../js/security.js"></script>
</body>
</html>
`;
}

// Generate index.html for a homework folder (the package picker)
function generateHomeworkIndexHtml(hw) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Homework ${hw.num}: ${hw.title} - Question Packages</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../css/style.css">
  <link rel="stylesheet" href="../../css/security.css">
</head>
<body>

  <!-- Navigation Bar -->
  <header class="navbar">
    <div class="nav-container">
      <a href="../../index.html" class="brand">
        <div class="brand-icon">💻</div>
        <div class="brand-info">
          <span class="brand-title">Elementary Programming Portal</span>
          <span class="brand-subtitle">Grade 4 • A.Y. 2026/2027</span>
        </div>
      </a>
      <div class="nav-badges">
        <span class="badge-tag">HW-${hw.num.toString().padStart(2, '0')}</span>
        <span class="badge-tag shield">🛡️ Anti-AI Protected</span>
      </div>
    </div>
  </header>

  <!-- Main Content Wrapper -->
  <main class="main-wrapper">
    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumbs">
      <a href="../../index.html">🏠 Home</a>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">Homework ${hw.num} Packages</span>
    </nav>

    <!-- Header Section -->
    <div class="section-header">
      <div>
        <h1 class="section-title">${hw.icon} Homework ${hw.num}: ${hw.title}</h1>
        <p class="section-subtitle">Select your personalized Question Package below. Each student has a unique problem set derived from their HTML code header.</p>
      </div>
      <a href="../../index.html" class="btn-back-nav">
        <span>⬅️ Change Homework</span>
      </a>
    </div>

    <!-- Filter & Search Bar -->
    <div class="student-filter-bar">
      <div class="search-box-wrapper">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          id="packageSearchInput" 
          class="search-input" 
          placeholder="Search by student name, roll number, or package..."
          autocomplete="off"
        >
      </div>

      <div class="class-filter-tabs">
        <button class="tab-btn active" data-class="all">All Packages</button>
        <button class="tab-btn" data-class="4A">Class 4A</button>
        <button class="tab-btn" data-class="4B">Class 4B</button>
      </div>
    </div>

    <!-- Live Dynamic Package Grid -->
    <!-- Names and packages are extracted directly from the HTML headers of the question files -->
    <div class="student-grid" id="packageGrid">
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748b;">
        <div style="font-size: 2rem; margin-bottom: 8px;">⏳</div>
        <p>Loading question packages from HTML headers...</p>
      </div>
    </div>

    <!-- Empty State Message -->
    <div id="noPackageMessage" style="display: none; text-align: center; padding: 50px 20px; color: #64748b;">
      <div style="font-size: 3rem; margin-bottom: 10px;">🧐</div>
      <h3 style="color: #0f172a; margin-bottom: 6px;">No Matching Package Found</h3>
      <p>Check the spelling of your name or package number and try again.</p>
    </div>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-content">
      <p><strong>Grade 4 Programming Homework Portal</strong> • Academic Year 2026/2027</p>
      <div class="footer-shield">
        <span>🛡️</span>
        <span>Every question package contains randomized variables to foster authentic learning</span>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="../../js/security.js"></script>
  <script src="../../js/homework-loader.js"></script>
</body>
</html>
`;
}

// Build all directories and files
async function build() {
  const rootDir = path.resolve(__dirname, '..');
  const homeworkDir = path.join(rootDir, 'homework');

  if (!fs.existsSync(homeworkDir)) {
    fs.mkdirSync(homeworkDir, { recursive: true });
  }

  console.log(`Building 16 homework directories inside: ${homeworkDir}`);

  for (const hw of HOMEWORKS) {
    const folderName = `homework-${hw.num}`;
    const targetHwDir = path.join(homeworkDir, folderName);

    if (!fs.existsSync(targetHwDir)) {
      fs.mkdirSync(targetHwDir, { recursive: true });
    }

    // 1. Write index.html for this homework folder
    const indexHtml = generateHomeworkIndexHtml(hw);
    fs.writeFileSync(path.join(targetHwDir, 'index.html'), indexHtml, 'utf8');

    // 2. Generate student question package files (package-1.html to package-28.html)
    const packageManifest = [];

    for (const student of STUDENTS) {
      const fileName = `package-${student.pkg}.html`;
      const filePath = path.join(targetHwDir, fileName);
      const packageHtml = generatePackageHtml(hw, student);

      fs.writeFileSync(filePath, packageHtml, 'utf8');

      packageManifest.push({
        file: fileName,
        pkg: student.pkg,
        studentName: student.name,
        studentClass: student.class,
        rollNo: student.rollNo,
        nis: student.nis
      });
    }

    // 3. Write fallback packages.json manifest for static hosts
    fs.writeFileSync(
      path.join(targetHwDir, 'packages.json'),
      JSON.stringify(packageManifest, null, 2),
      'utf8'
    );

    console.log(`✓ Built ${folderName} with index.html and ${STUDENTS.length} student package files.`);
  }

  console.log(`\n🎉 Successfully generated all 16 homework folders!`);
}

build().catch(err => {
  console.error('Error generating homeworks:', err);
  process.exit(1);
});
