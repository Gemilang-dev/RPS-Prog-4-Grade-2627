/**
 * Security & Anti-Cheat System (security.js)
 * Enforces session authentication, student package isolation,
 * and Anti-Inspect / Anti-Copy / Right-Click protection.
 */
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const rawStudent = localStorage.getItem('student');
    const token = localStorage.getItem('token');
    let student = null;

    try {
      if (rawStudent) student = JSON.parse(rawStudent);
    } catch (e) {}

    // Admin accounts are exempt from anti-cheat restrictions to allow grading & inspection
    const isAdmin = student && student.role === 'admin';

    // ================= 1. AUTHORIZATION & PAGE ACCESS GUARD =================
    const isHomeworkPage = window.location.pathname.includes('/homework/');
    
    if (isHomeworkPage) {
      if (!token || !rawStudent || !student) {
        alert('Please log in first to access homework.');
        window.location.href = '../../index.html';
        return;
      }

      if (!isAdmin) {
        const currentFileName = window.location.pathname.split('/').pop().toLowerCase();
        
        if (currentFileName === 'index.html' || !currentFileName) {
          window.location.href = '../../index.html';
          return;
        }

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
            return;
          }
        }
      }
    }

    // ================= 2. ANTI-CHEAT & ANTI-INSPECT PROTECTION (STUDENTS) =================
    if (!isAdmin && (isHomeworkPage || window.location.pathname.endsWith('.html'))) {
      
      // Toast notification trigger
      function showToast(message) {
        let toast = document.getElementById('securityToast');
        if (!toast) {
          toast = document.createElement('div');
          toast.id = 'securityToast';
          toast.className = 'security-toast';
          toast.innerHTML = `
            <div class="toast-icon">🛡️</div>
            <div>
              <div class="toast-title">Perlindungan Anti-Kecurangan Aktif</div>
              <div class="toast-msg">${message}</div>
            </div>
          `;
          document.body.appendChild(toast);
        } else {
          toast.querySelector('.toast-msg').textContent = message;
        }

        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
      }

      // Modal notification trigger
      function showSecurityModal(title, msg) {
        let modal = document.getElementById('securityModalOverlay');
        if (!modal) {
          modal = document.createElement('div');
          modal.id = 'securityModalOverlay';
          modal.className = 'security-modal-overlay active';
          modal.innerHTML = `
            <div class="security-modal-content">
              <div class="icon-wrapper">⚠️</div>
              <h3>${title}</h3>
              <p>${msg}</p>
              <button class="security-modal-btn" onclick="document.getElementById('securityModalOverlay').classList.remove('active')">Saya Mengerti</button>
            </div>
          `;
          document.body.appendChild(modal);
        } else {
          modal.querySelector('h3').textContent = title;
          modal.querySelector('p').textContent = msg;
          modal.classList.add('active');
        }
      }

      // A. Block Right-Click Context Menu
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showToast('Klik kanan (Context Menu) dilarang pada halaman soal!');
        return false;
      });

      // B. Block Copy, Cut, Paste, SelectStart, DragStart
      document.addEventListener('copy', (e) => {
        e.preventDefault();
        showToast('Fungsi salin (Copy) dilarang pada halaman soal!');
      });

      document.addEventListener('cut', (e) => {
        e.preventDefault();
        showToast('Fungsi potong (Cut) dilarang pada halaman soal!');
      });

      document.addEventListener('paste', (e) => {
        e.preventDefault();
        showToast('Fungsi tempel (Paste) dilarang pada halaman soal!');
      });

      document.addEventListener('selectstart', (e) => {
        const target = e.target;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      });

      document.addEventListener('dragstart', (e) => {
        e.preventDefault();
      });

      // C. Block Key Combinations (F12, Inspect Element, View Source, Save, Print)
      document.addEventListener('keydown', (e) => {
        const key = e.key || e.keyCode;
        const ctrlOrCmd = e.ctrlKey || e.metaKey;

        // F12
        if (key === 'F12' || e.keyCode === 123) {
          e.preventDefault();
          showSecurityModal('Akses Inspect Element Dilarang', 'Membuka Developer Tools / Inspect Element (F12) tidak diperbolehkan pada halaman homework.');
          return false;
        }

        // Ctrl+Shift+I / Cmd+Opt+I (Inspect)
        if (ctrlOrCmd && e.shiftKey && (key === 'I' || key === 'i' || e.keyCode === 73)) {
          e.preventDefault();
          showSecurityModal('Akses Inspect Element Dilarang', 'Shortcut Inspect Element (Ctrl+Shift+I) telah diblokir.');
          return false;
        }

        // Ctrl+Shift+J / Cmd+Opt+J (Console)
        if (ctrlOrCmd && e.shiftKey && (key === 'J' || key === 'j' || e.keyCode === 74)) {
          e.preventDefault();
          showSecurityModal('Akses Console Dilarang', 'Shortcut Developer Console (Ctrl+Shift+J) telah diblokir.');
          return false;
        }

        // Ctrl+Shift+C / Cmd+Opt+C (Element Picker)
        if (ctrlOrCmd && e.shiftKey && (key === 'C' || key === 'c' || e.keyCode === 67)) {
          e.preventDefault();
          showSecurityModal('Akses Inspect Element Dilarang', 'Shortcut Element Inspector (Ctrl+Shift+C) telah diblokir.');
          return false;
        }

        // Ctrl+U (View Source)
        if (ctrlOrCmd && (key === 'U' || key === 'u' || e.keyCode === 85)) {
          e.preventDefault();
          showToast('View Source (Ctrl+U) dilarang!');
          return false;
        }

        // Ctrl+S (Save Page)
        if (ctrlOrCmd && (key === 'S' || key === 's' || e.keyCode === 83)) {
          e.preventDefault();
          showToast('Menyimpan halaman (Ctrl+S) dilarang!');
          return false;
        }

        // Ctrl+P (Print Page)
        if (ctrlOrCmd && (key === 'P' || key === 'p' || e.keyCode === 80)) {
          e.preventDefault();
          showToast('Mencetak halaman (Ctrl+P) dilarang! Kerjakan di buku tulis sekolah.');
          return false;
        }

        // Ctrl+C (Copy)
        if (ctrlOrCmd && (key === 'C' || key === 'c' || e.keyCode === 67)) {
          const target = e.target;
          if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            showToast('Menyalin teks (Ctrl+C) dilarang pada soal!');
            return false;
          }
        }

        // Ctrl+A (Select All)
        if (ctrlOrCmd && (key === 'A' || key === 'a' || e.keyCode === 65)) {
          const target = e.target;
          if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            showToast('Select All (Ctrl+A) dilarang pada soal!');
            return false;
          }
        }
      });

      // D. DevTools Outer Dimensions Detection
      let devtoolsOpen = false;
      const threshold = 160;
      setInterval(() => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if ((widthThreshold || heightThreshold) && !devtoolsOpen) {
          devtoolsOpen = true;
          showSecurityModal('Peringatan Inspect Element Terdeteksi', 'Developer Tools / Inspect Window terdeteksi terbuka. Harap tutup inspect element dan kerjakan soal secara mandiri.');
        } else if (!widthThreshold && !heightThreshold) {
          devtoolsOpen = false;
        }
      }, 1000);
    }
  });
})();
