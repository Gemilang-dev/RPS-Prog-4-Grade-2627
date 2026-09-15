/**
 * Dynamic Homework Package Loader (homework-loader.js)
 * Reads question package HTML files in the current homework folder,
 * parses each file's header (including table meta-table or header elements),
 * extracts the student's name, and dynamically renders the package cards.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const packageGrid = document.getElementById('packageGrid');
  const searchInput = document.getElementById('packageSearchInput');
  const noPackageMessage = document.getElementById('noPackageMessage');

  let loadedPackages = [];
  let currentSearchQuery = '';

  // Detect current homework number from URL or folder name
  const currentPath = window.location.pathname;
  const match = currentPath.match(/homework[-_\s](\d+)/i);
  const hwNum = match ? match[1] : '2';

  // Update page headers
  const pageTitle = document.getElementById('hwTitleDisplay');
  const pageBreadcrumb = document.getElementById('breadcrumbHwTitle');
  if (pageTitle) pageTitle.textContent = `Homework ${hwNum}`;
  if (pageBreadcrumb) pageBreadcrumb.textContent = `Homework ${hwNum}`;

  /**
   * 1. Get the list of HTML files in this homework folder
   */
  async function getPackageFileList() {
    // Attempt 1: Fetch via server API
    try {
      const apiRes = await fetch(`/api/homework/homework-${hwNum}`, { cache: 'no-cache' });
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (e) {
      // API not available
    }

    // Attempt 2: Load local packages.json manifest if present
    try {
      const manifestRes = await fetch('packages.json', { cache: 'no-cache' });
      if (manifestRes.ok) {
        const manifestData = await manifestRes.json();
        if (Array.isArray(manifestData) && manifestData.length > 0) {
          return manifestData.map(item => item.file || item);
        }
      }
    } catch (e) {
      // Manifest not available
    }

    return [];
  }

  /**
   * 2. Inspect each package HTML file and extract student name from header
   */
  async function inspectAndExtractPackages(fileList) {
    const parser = new DOMParser();

    const fetchPromises = fileList.map(async (item, index) => {
      const fileName = typeof item === 'string' ? item : item.file;
      
      // If already has studentName from server API
      if (typeof item === 'object' && item.studentName && item.studentName !== fileName) {
        return {
          file: fileName,
          studentName: item.studentName,
          course: item.course || 'Programming',
          pkgNum: index + 1
        };
      }

      try {
        const response = await fetch(fileName, { cache: 'no-cache' });
        if (!response.ok) return null;

        const htmlText = await response.text();
        const doc = parser.parseFromString(htmlText, 'text/html');

        let studentName = '';
        let course = '';

        // Check meta-table format (as provided in user's template)
        const tds = doc.querySelectorAll('td');
        for (let i = 0; i < tds.length; i++) {
          const text = tds[i].textContent.trim();
          if (text.includes('Student Name')) {
            const val = tds[i].nextElementSibling?.textContent?.trim();
            if (val && !val.includes('___')) {
              studentName = val;
            }
          }
          if (text.includes('Course')) {
            const cVal = tds[i].nextElementSibling?.textContent?.trim();
            if (cVal) course = cVal;
          }
        }

        // Fallback: check .student-name class
        if (!studentName) {
          studentName = doc.querySelector('.student-name')?.textContent?.trim() ||
                        doc.querySelector('h1.student-name')?.textContent?.trim();
        }

        // Fallback: check <title>
        if (!studentName) {
          const title = doc.querySelector('title')?.textContent?.trim() || '';
          if (title.includes('-')) {
            studentName = title.split('-')[0].trim();
          } else {
            studentName = title;
          }
        }

        if (!studentName) {
          studentName = fileName.replace(/\.html$/i, '').replace(/[-_]/g, ' ');
        }

        return {
          file: fileName,
          studentName: studentName,
          course: course || 'Programming',
          pkgNum: index + 1
        };
      } catch (err) {
        console.warn(`Could not load ${fileName}:`, err);
        return null;
      }
    });

    const parsed = await Promise.all(fetchPromises);
    return parsed.filter(item => item !== null);
  }

  /**
   * 3. Render package cards to DOM
   */
  function renderPackageGrid() {
    if (!packageGrid) return;
    packageGrid.innerHTML = '';

    const filtered = loadedPackages.filter(pkg => {
      const q = currentSearchQuery.toLowerCase().trim();
      return !q || pkg.studentName.toLowerCase().includes(q) || pkg.file.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      if (noPackageMessage) {
        noPackageMessage.style.display = 'block';
        if (loadedPackages.length === 0) {
          noPackageMessage.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 10px;">📂</div>
            <h3 style="color: #0f172a; margin-bottom: 6px;">No Question Files Uploaded Yet</h3>
            <p>Question packages for Homework ${hwNum} will appear here once HTML files are added to this folder.</p>
          `;
        }
      }
      return;
    }

    if (noPackageMessage) noPackageMessage.style.display = 'none';

    filtered.forEach(pkg => {
      const card = document.createElement('a');
      card.className = 'student-card';
      card.href = pkg.file;

      // Extract initials
      const initials = pkg.studentName
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('');

      card.innerHTML = `
        <div class="student-avatar">${initials}</div>
        <div class="student-details">
          <div style="font-size: 0.75rem; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">
            Homework ${hwNum}
          </div>
          <div class="student-name" title="${pkg.studentName}">
            ${pkg.studentName}
          </div>
          <div class="student-meta">
            <span class="student-class-badge">${pkg.course || 'Student'}</span>
            <span style="font-size: 0.8rem; color: #64748b;">${pkg.file}</span>
          </div>
        </div>
        <div class="student-arrow">➔</div>
      `;

      packageGrid.appendChild(card);
    });
  }

  // Hook search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderPackageGrid();
    });
  }

  // Initialize
  try {
    const fileList = await getPackageFileList();
    loadedPackages = await inspectAndExtractPackages(fileList);
    renderPackageGrid();
  } catch (err) {
    console.error('Failed to load packages:', err);
  }
});
