/**
 * Security & Anti-Cheat System (security.js)
 * Enforces session authentication & student package isolation.
 */
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const rawStudent = localStorage.getItem('student');
    const token = localStorage.getItem('token');
    
    // Determine path depth relative to root index.html
    const isHomeworkPage = window.location.pathname.includes('/homework/');
    
    if (isHomeworkPage) {
      if (!token || !rawStudent) {
        alert('Please log in first to access homework.');
        window.location.href = '../../index.html';
        return;
      }
      
      let student = null;
      try {
        student = JSON.parse(rawStudent);
      } catch (e) {
        window.location.href = '../../index.html';
        return;
      }

      if (!student) {
        window.location.href = '../../index.html';
        return;
      }

      // If user is Admin, allow full access to all pages
      if (student.role === 'admin') {
        return;
      }

      // If user is a Student, enforce ownership check on individual student package files
      const currentFileName = window.location.pathname.split('/').pop().toLowerCase();
      
      // If student is trying to access index.html (package picker), redirect them back to student dashboard or their package
      if (currentFileName === 'index.html' || !currentFileName) {
        // If student clicks back/navigates to index.html, return them to Student Dashboard
        window.location.href = '../../index.html';
        return;
      }

      // For specific student package HTML files (e.g. amish-mohamed.html)
      if (currentFileName.endsWith('.html')) {
        const studentUsername = (student.username || '').toLowerCase();
        const studentName = (student.name || '').toLowerCase();
        
        const pageStudentElem = document.querySelector('.student-name-val') || 
                                 document.querySelector('.student-name') ||
                                 document.querySelector('title');
        const pageStudentText = pageStudentElem ? pageStudentElem.textContent.toLowerCase() : '';

        const normalize = str => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const normUser = normalize(studentUsername);
        const normName = normalize(studentName);
        const normFile = normalize(currentFileName);
        const normPageText = normalize(pageStudentText);

        const isOwner = (
          (normUser && (normFile.includes(normUser) || normPageText.includes(normUser))) ||
          (normName && (normFile.includes(normName) || normPageText.includes(normName))) ||
          (normName && normName.split(' ')[0] && normFile.includes(normName.split(' ')[0]))
        );

        if (!isOwner) {
          alert(`Akses Ditolak: Anda (${student.name}) hanya dapat mengakses homework milik Anda sendiri!`);
          window.location.href = '../../index.html';
        }
      }
    }
  });
})();
