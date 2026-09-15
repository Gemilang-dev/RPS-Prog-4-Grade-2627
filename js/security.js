/**
 * Security & Anti-Cheat System (security.js)
 * Grade 4 Elementary Programming - Academic Year 2026/2027
 * Protects problem sets from selection, right-click copying, devtools sniffing, and AI scraping.
 */

(function () {
  let toastTimeout = null;

  function showSecurityToast(title, message) {
    let toast = document.getElementById('securityToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'securityToast';
      toast.className = 'security-toast';
      toast.innerHTML = `
        <div class="toast-icon">🛡️</div>
        <div>
          <div class="toast-title" id="toastTitle">Security Notice</div>
          <div id="toastMessage">This action is restricted for academic integrity.</div>
        </div>
      `;
      document.body.appendChild(toast);
    }

    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastMessage').textContent = message;

    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // 1. Block Context Menu (Right Click)
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    showSecurityToast(
      'Right-Click Disabled',
      'Right-clicking has been disabled so you can read and solve questions independently.'
    );
    return false;
  }, { capture: true });

  // 2. Block Copy, Cut, and Paste
  document.addEventListener('copy', function (e) {
    e.preventDefault();
    if (e.clipboardData) {
      e.clipboardData.setData(
        'text/plain',
        '⚠️ GRADE 4 PROGRAMMING HOMEWORK: Copying questions to prompt AI models is prohibited! Please solve this problem independently in your notebook.'
      );
    }
    showSecurityToast(
      'Copying Restricted',
      'Copy-paste is disabled to prevent querying AI assistants. Build your own coding skills!'
    );
    return false;
  }, { capture: true });

  document.addEventListener('cut', function (e) {
    e.preventDefault();
    return false;
  }, { capture: true });

  document.addEventListener('paste', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
      return true;
    }
    e.preventDefault();
    return false;
  }, { capture: true });

  // 3. Block Drag and Mouse Selection
  document.addEventListener('selectstart', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
      return true;
    }
    e.preventDefault();
    return false;
  }, { capture: true });

  document.addEventListener('dragstart', function (e) {
    e.preventDefault();
    return false;
  }, { capture: true });

  // 4. Block Keyboard Shortcuts
  document.addEventListener('keydown', function (e) {
    const key = e.key ? e.key.toLowerCase() : '';
    const isCtrlOrMeta = e.ctrlKey || e.metaKey;

    // F12 (DevTools)
    if (e.keyCode === 123 || e.key === 'F12') {
      e.preventDefault();
      e.stopPropagation();
      showSecurityToast('DevTools Blocked', 'Developer inspection tools are disabled.');
      return false;
    }

    // Ctrl/Cmd + Shift + I / J / C (DevTools)
    if (isCtrlOrMeta && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityToast('Inspector Blocked', 'Developer console access is disabled.');
      return false;
    }

    // Ctrl/Cmd + C (Copy)
    if (isCtrlOrMeta && key === 'c') {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return true;
      }
      e.preventDefault();
      showSecurityToast('Copy Shortcut Disabled', 'Solve questions with genuine logic thinking.');
      return false;
    }

    // Ctrl/Cmd + A (Select All)
    if (isCtrlOrMeta && key === 'a') {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return true;
      }
      e.preventDefault();
      showSecurityToast('Select All Disabled', 'Text on this homework page is protected.');
      return false;
    }

    // Ctrl/Cmd + U (View Source)
    if (isCtrlOrMeta && key === 'u') {
      e.preventDefault();
      showSecurityToast('View Source Restricted', 'Page source viewing is restricted.');
      return false;
    }

    // Ctrl/Cmd + S (Save Page)
    if (isCtrlOrMeta && key === 's') {
      e.preventDefault();
      showSecurityToast('Save Disabled', 'Please view assignments directly on the official portal.');
      return false;
    }

    // Ctrl/Cmd + P (Print Page)
    if (isCtrlOrMeta && key === 'p') {
      e.preventDefault();
      showSecurityToast('Printing Restricted', 'Use your physical notebook to record answers.');
      return false;
    }
  }, { capture: true });

  // 5. Console educational banner
  try {
    const bannerStyle = 'font-size: 15px; font-weight: bold; color: #dc2626; background: #fee2e2; padding: 8px 12px; border-radius: 6px;';
    const subStyle = 'font-size: 12px; color: #1e293b; line-height: 1.5;';
    console.log('%c🛡️ GRADE 4 COMPUTER SCIENCE - ACADEMIC INTEGRITY', bannerStyle);
    console.log(
      '%cWelcome young programmer!\nThis homework is designed to train your computational thinking.\nCopying questions into AI bots will not help you develop real problem-solving superpowers.\nTake on the challenge and solve the puzzle yourself! 🚀',
      subStyle
    );
  } catch (err) {}
})();
