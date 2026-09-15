# 🚀 Grade 4 Programming Homework Portal (Academic Year 2026/2027)

A comprehensive, multi-page web application (MPA) designed for Grade 4 elementary school students learning Computer Science and Computational Thinking.

---

## 🌟 Key Architecture & Features

### 1. Dedicated Homework Folders (`homework-1` to `homework-16`)
The project is organized into a dedicated `homework/` folder containing individual folders for **Homework 1 through 16**:
- **`homework/homework-1/`** to **`homework/homework-16/`**
- Each homework folder contains an **`index.html`** file that displays all question packages available for that assignment.
- Each homework folder houses the actual student question package files: **`package-1.html`**, **`package-2.html`**, etc.

### 2. Automatic HTML Header Extraction
As requested, the package selection page dynamically extracts student names and package labels directly from the `<header>` element inside each question's HTML file:
```html
<header class="package-header">
  <span class="package-id-badge">QUESTION PACKAGE #01</span>
  <h1 class="student-name">Aditya Pratama</h1>
  <div class="student-meta">Grade 4 • Class 4A • Roll No. 01 • Student ID: 26274001</div>
</header>
```
- The loader engine parses the HTML file's header using `DOMParser`.
- The student's name, class, and package number are displayed cleanly on interactive cards with instant search and class filtering.
- **Adding a new student or question:** Simply drop a new `.html` file into any `homework-X/` folder with the `<header>` block, and it will be recognized and listed automatically!

### 3. Personalized Question Sets (Anti-Cheating by Design)
- Every student package has distinct mission parameters, coordinates, sensor thresholds, math values, and verification tokens.
- No two students receive the same numbers, meaning students cannot copy answers from their peers.

### 4. Comprehensive Anti-Copy & Anti-AI Protection
To discourage students from simply copying and pasting questions into AI assistants (such as ChatGPT, Claude, etc.):
- **No Text Selection (`user-select: none`)**: Selection cursors and highlighting are disabled globally.
- **Right-Click Interception**: Context menus are blocked with an educational reminder toast.
- **Copy, Cut, & Paste Blocking**: Intercepts clipboard events and injects educational notices.
- **Drag & Drop Disabled**: Prevents dragging text or images into external apps.
- **Shortcuts Disabled**: Intercepts `Ctrl+C`, `Ctrl+A`, `Ctrl+X`, `Ctrl+U` (view source), `Ctrl+S` (save page), `Ctrl+P` (print), `F12`, and `Ctrl+Shift+I/J/C` (DevTools).
- **Anti-Print Protection**: Attempting to "Print to PDF" replaces the page with a restricted-access notice.

---

## 📂 Project Directory Structure

```
RPS-Prog-4-Grade-2627/
│
├── index.html                           # Main Portal Home (Lists Homework 1 to 16)
│
├── homework/                            # The homework directory
│   ├── homework-1/                      # Homework 1 folder
│   │   ├── index.html                   # Package selector (names extracted from HTML headers)
│   │   ├── package-1.html               # Student 1 question package HTML file
│   │   ├── package-2.html               # Student 2 question package HTML file
│   │   ├── ...                          # Packages for all students
│   │   └── packages.json                # Fallback manifest for static hosting
│   ├── homework-2/                      # Homework 2 folder
│   ├── homework-3/                      # Homework 3 folder
│   │   ...
│   └── homework-16/                     # Homework 16 folder
│
├── css/
│   ├── style.css                        # Modern, responsive, child-friendly styling
│   └── security.css                     # Anti-copy, anti-select, anti-print rules
│
├── js/
│   ├── security.js                      # Event interception & educational warnings
│   ├── homework-loader.js               # Reads HTML headers and extracts student names
│   └── main.js                          # Renders the 16 homework directory cards
│
├── scripts/
│   └── generate-homeworks.js            # Generator script to scaffold homeworks & packages
│
├── server.js                            # Zero-dependency Node.js HTTP server + header scan API
├── package.json                         # Project metadata & npm run dev scripts
└── README.md                            # Documentation
```

---

## 💻 How to Run the Website

### Option 1: Start the Local Node.js Server (Recommended)
In your terminal / PowerShell:
```bash
npm run dev
```
*(or `npm start`)*

Then open your browser and go to:
👉 **`http://localhost:3000`**

### Option 2: Open Directly Without Any Server
You can open **[`index.html`](file:///C:/Users/Ray/RPS-Prog-4-Grade-2627/index.html)** by double-clicking it directly in Windows File Explorer. All navigation links and individual packages work out of the box.

### Option 3: Deploy to GitHub Pages / Vercel
Because all files are standard web files (HTML, CSS, and vanilla JS), you can push this repository directly to **GitHub Pages** for free, instant cloud hosting so your students can access it from home or school tablets.

---

## 👩‍🏫 Teacher's Guide: Customizing & Adding Question Packages

### Adding a New Question File to Any Homework
1. Open the desired homework folder, e.g., `homework/homework-1/`.
2. Create or copy a file, e.g., `package-29.html`.
3. Include the standard header at the top of the body:
   ```html
   <header class="package-header">
     <span class="package-id-badge">QUESTION PACKAGE #29</span>
     <h1 class="student-name">Your Student Name</h1>
     <div class="student-meta">Grade 4 • Class 4A • Roll No. 29</div>
   </header>
   ```
4. Save the file! When opening `homework/homework-1/index.html`, the system will automatically parse the header and display the new student's card!