/**
 * Homework Directory Loader (main.js)
 * Generates 16 Homework buttons (Homework 1 to Homework 16)
 */

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('homeworkGrid');
  if (!grid) return;

  grid.innerHTML = '';

  for (let i = 1; i <= 16; i++) {
    const card = document.createElement('div');
    card.className = 'hw-card';

    card.innerHTML = `
      <div class="hw-card-top">
        <div class="hw-icon">📝</div>
        <span class="hw-badge badge-green">HW ${i}</span>
      </div>
      <h3 class="hw-card-title">Homework ${i}</h3>
      <p class="hw-card-desc" style="margin-bottom: 1.25rem;">
        Click to view question packages for Homework ${i}.
      </p>
      <a href="homework/homework-${i}/index.html" class="btn-choose-hw">
        <span>Open Homework ${i}</span>
        <span>➔</span>
      </a>
    `;

    grid.appendChild(card);
  }
});
