/**
 * Canvas Question Renderer (Anti-Scrape & Anti-Copy Engine)
 * Merender seluruh teks soal, visual diagram, dan watermark langsung ke Canvas.
 * Tidak ada teks DOM yang bisa di-copy, di-select, atau di-scrape oleh AI.
 */

// Polyfill roundRect untuk browser versi lama
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
    if (!radii) radii = 0;
    if (typeof radii === 'number') radii = [radii, radii, radii, radii];
    const [tl, tr, br, bl] = radii;
    this.beginPath();
    this.moveTo(x + tl, y);
    this.lineTo(x + w - tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + tr);
    this.lineTo(x + w, y + h - br);
    this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    this.lineTo(x + bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - bl);
    this.lineTo(x, y + tl);
    this.quadraticCurveTo(x, y, x + tl, y);
    this.closePath();
    return this;
  };
}

class QuestionCanvasRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;
    this.padding = 32;
  }

  // Bungkus teks otomatis dan kembalikan posisi Y akhir
  wrapText(text, x, y, maxWidth, lineHeight, font, color = '#1e293b') {
    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';

    const paragraphs = text.split('\n');
    let lineY = y;

    for (let p = 0; p < paragraphs.length; p++) {
      const paragraph = paragraphs[p];
      if (paragraph.trim() === '') {
        lineY += lineHeight * 0.6;
        continue;
      }

      const words = paragraph.split(' ');
      let currentLine = '';

      for (let n = 0; n < words.length; n++) {
        const testLine = currentLine + words[n] + ' ';
        const metrics = this.ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
          this.ctx.fillText(currentLine.trim(), x, lineY);
          currentLine = words[n] + ' ';
          lineY += lineHeight;
        } else {
          currentLine = testLine;
        }
      }
      this.ctx.fillText(currentLine.trim(), x, lineY);
      lineY += lineHeight;
    }

    return lineY;
  }

  // Watermark diagonal anti-plagiarisme
  drawWatermark(studentName, studentClass, token, height) {
    this.ctx.save();
    this.ctx.rotate((-22 * Math.PI) / 180);
    this.ctx.font = 'bold 18px "Segoe UI", sans-serif';
    this.ctx.fillStyle = 'rgba(148, 163, 184, 0.09)'; // Samar dan elegan
    this.ctx.textAlign = 'center';

    const text = `SOAL RESMI: ${studentName.toUpperCase()} (${studentClass}) • TOKEN: ${token} • DILARANG MENYALIN KE AI`;
    
    for (let x = -800; x < 1800; x += 420) {
      for (let y = -800; y < height + 800; y += 130) {
        this.ctx.fillText(text, x, y);
      }
    }
    this.ctx.restore();
  }

  // PR 1 Diagram: Grid Koordinat Robot
  drawRobotGrid(gridData, startX, startY, maxWidth) {
    const size = gridData.size || 7;
    const cellSize = Math.min(48, Math.floor((maxWidth - 60) / size));
    const gridPixelWidth = size * cellSize;
    const gridPixelHeight = size * cellSize;
    const offsetX = startX + Math.floor((maxWidth - gridPixelWidth) / 2);
    let offsetY = startY + 12;

    // Card background
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.strokeStyle = '#cbd5e1';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.roundRect(offsetX - 16, offsetY - 8, gridPixelWidth + 32, gridPixelHeight + 46, 12);
    this.ctx.fill();
    this.ctx.stroke();

    // Title
    this.ctx.font = 'bold 14px "Segoe UI", sans-serif';
    this.ctx.fillStyle = '#0f172a';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PETA KOORDINAT MISI NAVIGASI ROBOT (X, Y)', offsetX + gridPixelWidth / 2, offsetY + 6);
    offsetY += 28;

    // Grid lines
    this.ctx.strokeStyle = '#e2e8f0';
    this.ctx.lineWidth = 1;

    for (let i = 0; i <= size; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(offsetX + i * cellSize, offsetY);
      this.ctx.lineTo(offsetX + i * cellSize, offsetY + gridPixelHeight);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(offsetX, offsetY + i * cellSize);
      this.ctx.lineTo(offsetX + gridPixelWidth, offsetY + i * cellSize);
      this.ctx.stroke();
    }

    // Coordinate axis labels
    this.ctx.font = '12px "Segoe UI", sans-serif';
    this.ctx.fillStyle = '#64748b';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    for (let c = 1; c <= size; c++) {
      this.ctx.fillText(c.toString(), offsetX + (c - 0.5) * cellSize, offsetY + gridPixelHeight + 12);
      this.ctx.fillText(c.toString(), offsetX - 10, offsetY + (size - c + 0.5) * cellSize);
    }

    const toPx = (gx, gy) => ({
      x: offsetX + (gx - 1 + 0.5) * cellSize,
      y: offsetY + (size - gy + 0.5) * cellSize
    });

    // Obstacle
    const obsPos = toPx(gridData.obstacle.x, gridData.obstacle.y);
    this.ctx.fillStyle = '#fee2e2';
    this.ctx.strokeStyle = '#ef4444';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(obsPos.x, obsPos.y, cellSize * 0.38, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.font = '18px sans-serif';
    this.ctx.fillText('☄️', obsPos.x, obsPos.y);

    // Target
    const tgtPos = toPx(gridData.target.x, gridData.target.y);
    this.ctx.fillStyle = '#fef3c7';
    this.ctx.strokeStyle = '#f59e0b';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(tgtPos.x, tgtPos.y, cellSize * 0.38, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.font = '18px sans-serif';
    this.ctx.fillText('💎', tgtPos.x, tgtPos.y);

    // Robot
    const rPos = toPx(gridData.robot.x, gridData.robot.y);
    this.ctx.fillStyle = '#dbeafe';
    this.ctx.strokeStyle = '#2563eb';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(rPos.x, rPos.y, cellSize * 0.40, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.font = '20px sans-serif';
    this.ctx.fillText('🤖', rPos.x, rPos.y);

    return offsetY + gridPixelHeight + 35;
  }

  // PR 2 Diagram: Bagan Alur Percabangan If-Else
  drawFlowchart(startX, startY, maxWidth) {
    const cardHeight = 110;
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.strokeStyle = '#cbd5e1';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.roundRect(startX, startY, maxWidth, cardHeight, 12);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.font = 'bold 13px "Segoe UI", sans-serif';
    this.ctx.fillStyle = '#0f172a';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('BAGAN LOGIKA KEPUTUSAN SENSOR (IF - THEN - ELSE)', startX + maxWidth / 2, startY + 16);

    // Diagram Blocks
    const centerX = startX + maxWidth / 2;
    const blockY = startY + 42;

    // Decision diamond/box
    this.ctx.fillStyle = '#fef3c7';
    this.ctx.strokeStyle = '#d97706';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.roundRect(centerX - 120, blockY, 240, 32, 8);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.fillStyle = '#92400e';
    this.ctx.font = 'bold 12px "Segoe UI", sans-serif';
    this.ctx.fillText('Apakah Nilai Sensor < Batas Acuan?', centerX, blockY + 16);

    // Action boxes left and right
    // True: Green
    this.ctx.fillStyle = '#dcfce7';
    this.ctx.strokeStyle = '#16a34a';
    this.ctx.beginPath();
    this.ctx.roundRect(startX + 18, blockY + 18, 160, 36, 6);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.fillStyle = '#15803d';
    this.ctx.font = 'bold 11px "Segoe UI", sans-serif';
    this.ctx.fillText('✅ BENAR: Buka Pintu', startX + 98, blockY + 36);

    // False: Red
    this.ctx.fillStyle = '#fee2e2';
    this.ctx.strokeStyle = '#dc2626';
    this.ctx.beginPath();
    this.ctx.roundRect(startX + maxWidth - 178, blockY + 18, 160, 36, 6);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.fillStyle = '#b91c1c';
    this.ctx.font = 'bold 11px "Segoe UI", sans-serif';
    this.ctx.fillText('❌ SALAH: Kunci Pintu', startX + maxWidth - 98, blockY + 36);

    return startY + cardHeight + 20;
  }

  // PR 3 Diagram: Ilustrasi Loop
  drawLoopDiagram(startX, startY, maxWidth) {
    const cardHeight = 90;
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.strokeStyle = '#cbd5e1';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.roundRect(startX, startY, maxWidth, cardHeight, 12);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.font = 'bold 13px "Segoe UI", sans-serif';
    this.ctx.fillStyle = '#0f172a';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('🔁 STRUKTUR BLOK PERULANGAN (LOOP PSEUDOCODE)', startX + maxWidth / 2, startY + 18);

    // Code Block Look
    this.ctx.fillStyle = '#1e293b';
    this.ctx.beginPath();
    this.ctx.roundRect(startX + 30, startY + 35, maxWidth - 60, 42, 8);
    this.ctx.fill();

    this.ctx.fillStyle = '#38bdf8';
    this.ctx.font = 'bold 13px "Consolas", monospace';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('ULANGI ( jumlah_sisi ) KALI {  MAJU( langkah );  PUTAR( derajat );  }', startX + 45, startY + 56);

    return startY + cardHeight + 20;
  }

  // PR 4 Diagram: Game Score HUD
  drawGameHud(startX, startY, maxWidth) {
    const cardHeight = 85;
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.strokeStyle = '#cbd5e1';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.roundRect(startX, startY, maxWidth, cardHeight, 12);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.font = 'bold 13px "Segoe UI", sans-serif';
    this.ctx.fillStyle = '#0f172a';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('🎮 TAMPILAN VARIABEL GAME (HEADS-UP DISPLAY)', startX + maxWidth / 2, startY + 16);

    // Three badges
    const bW = Math.floor((maxWidth - 60) / 3);
    const badges = [
      { label: '⭐ Bintang Emas', val: '+Bonus Poin', bg: '#fef3c7', fg: '#b45309' },
      { label: '⚠️ Duri Rintangan', val: '-Penalti Poin', bg: '#fee2e2', fg: '#b91c1c' },
      { label: '🏆 Target Menang', val: '>= 100 Poin', bg: '#ecfdf5', fg: '#047857' }
    ];

    badges.forEach((b, idx) => {
      const bx = startX + 20 + idx * (bW + 10);
      this.ctx.fillStyle = b.bg;
      this.ctx.beginPath();
      this.ctx.roundRect(bx, startY + 36, bW, 36, 6);
      this.ctx.fill();

      this.ctx.font = 'bold 11px "Segoe UI", sans-serif';
      this.ctx.fillStyle = b.fg;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`${b.label}: ${b.val}`, bx + bW / 2, startY + 54);
    });

    return startY + cardHeight + 20;
  }

  // Render Keseluruhan Lembar Soal
  render(homework, student, questionData) {
    const baseWidth = 840;
    // Tinggi responsif berdasarkan jenis PR
    const totalHeight = (homework.id === 'pr-1' ? 1480 : 1260);

    this.canvas.width = baseWidth * this.dpr;
    this.canvas.height = totalHeight * this.dpr;
    this.canvas.style.width = '100%';
    this.canvas.style.maxWidth = `${baseWidth}px`;

    this.ctx.scale(this.dpr, this.dpr);

    const width = baseWidth;
    const contentWidth = width - this.padding * 2;
    let y = this.padding;

    // 1. Background Kanvas
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, width, totalHeight);

    // 2. Watermark Anti-AI & Anti-Plagiarisme
    this.drawWatermark(student.name, student.class, questionData.token, totalHeight);

    // 3. Header Kop Soal
    this.ctx.fillStyle = '#1e3a8a';
    this.ctx.beginPath();
    this.ctx.roundRect(this.padding, y, contentWidth, 88, 14);
    this.ctx.fill();

    this.ctx.fillStyle = '#93c5fd';
    this.ctx.font = 'bold 12px "Segoe UI", sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText('LEMBAR SOAL RESMI PEMROGRAMAN • KELAS 4 SD • T.A. 2026/2027', this.padding + 22, y + 16);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 22px "Segoe UI", sans-serif';
    this.ctx.fillText(`${homework.code}: ${homework.title}`, this.padding + 22, y + 42);

    y += 104;

    // 4. Kartu Identitas Siswa
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.strokeStyle = '#cbd5e1';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.roundRect(this.padding, y, contentWidth, 74, 10);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#0f172a';
    this.ctx.font = 'bold 15px "Segoe UI", sans-serif';
    this.ctx.fillText(`Nama Siswa : ${student.name}`, this.padding + 18, y + 16);
    this.ctx.fillText(`Kelas / Absen: ${student.class} / No. ${student.rollNo}`, this.padding + 18, y + 42);

    this.ctx.fillStyle = '#475569';
    this.ctx.font = '13px "Segoe UI", sans-serif';
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`NIS: ${student.nis}`, this.padding + contentWidth - 18, y + 16);

    this.ctx.fillStyle = '#dc2626';
    this.ctx.font = 'bold 12px monospace';
    this.ctx.fillText(`TOKEN SOAL: ${questionData.token}`, this.padding + contentWidth - 18, y + 42);

    this.ctx.textAlign = 'left';
    y += 92;

    // 5. Kotak Skenario Khusus Siswa
    this.ctx.fillStyle = '#eff6ff';
    this.ctx.strokeStyle = '#93c5fd';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.roundRect(this.padding, y, contentWidth, 105, 12);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#1e40af';
    this.ctx.font = 'bold 15px "Segoe UI", sans-serif';
    this.ctx.fillText(`📖 Skenario Unik Siswa: ${questionData.title}`, this.padding + 18, y + 14);

    y = this.wrapText(
      questionData.scenario.replace(/\*\*/g, ''),
      this.padding + 18,
      y + 40,
      contentWidth - 36,
      22,
      '14px "Segoe UI", sans-serif',
      '#1e293b'
    );

    y += 18;

    // Diagram Spesifik per Homework
    if (homework.id === 'pr-1' && questionData.gridData) {
      y = this.drawRobotGrid(questionData.gridData, this.padding, y, contentWidth);
    } else if (homework.id === 'pr-2') {
      y = this.drawFlowchart(this.padding, y, contentWidth);
    } else if (homework.id === 'pr-3') {
      y = this.drawLoopDiagram(this.padding, y, contentWidth);
    } else if (homework.id === 'pr-4') {
      y = this.drawGameHud(this.padding, y, contentWidth);
    }

    // 6. Target Misi
    if (questionData.mission) {
      this.ctx.fillStyle = '#f1f5f9';
      this.ctx.strokeStyle = '#cbd5e1';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.roundRect(this.padding, y, contentWidth, 85, 10);
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = '#334155';
      this.ctx.font = 'bold 13px "Segoe UI", sans-serif';
      this.ctx.fillText('🎯 Target Misi / Aturan Logika:', this.padding + 18, y + 12);

      y = this.wrapText(
        questionData.mission.replace(/\*\*/g, ''),
        this.padding + 18,
        y + 34,
        contentWidth - 36,
        20,
        '13px "Segoe UI", sans-serif',
        '#334155'
      );
      y += 24;
    }

    // 7. Daftar Pertanyaan Soal
    this.ctx.fillStyle = '#0f172a';
    this.ctx.font = 'bold 17px "Segoe UI", sans-serif';
    this.ctx.fillText('📝 Pertanyaan & Instruksi Tugas:', this.padding, y);
    y += 26;

    questionData.questions.forEach((q) => {
      const startCardY = y;
      const qTitle = `Soal No. ${q.num} [${q.type}]`;

      this.ctx.fillStyle = '#2563eb';
      this.ctx.font = 'bold 14px "Segoe UI", sans-serif';
      this.ctx.fillText(qTitle, this.padding + 16, y + 12);

      const textY = y + 36;
      const endTextY = this.wrapText(
        q.text.replace(/\*\*/g, ''),
        this.padding + 16,
        textY,
        contentWidth - 32,
        22,
        '14px "Segoe UI", sans-serif',
        '#1e293b'
      );

      const cardHeight = (endTextY - startCardY) + 16;

      this.ctx.save();
      this.ctx.globalCompositeOperation = 'destination-over';
      this.ctx.fillStyle = '#ffffff';
      this.ctx.strokeStyle = '#e2e8f0';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.roundRect(this.padding, startCardY, contentWidth, cardHeight, 10);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.restore();

      y = startCardY + cardHeight + 14;
    });

    // 8. Footer Catatan Guru
    this.ctx.fillStyle = '#fef2f2';
    this.ctx.strokeStyle = '#fca5a5';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.roundRect(this.padding, y, contentWidth, 68, 10);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#b91c1c';
    this.ctx.font = 'bold 12px "Segoe UI", sans-serif';
    this.ctx.fillText('💡 Petunjuk Kejujuran & Pengumpulan:', this.padding + 16, y + 12);

    this.ctx.fillStyle = '#7f1d1d';
    this.ctx.font = '12px "Segoe UI", sans-serif';
    this.ctx.fillText(
      'Tuliskan jawaban rapi di buku PR Pemrograman dengan mencantumkan Nama, Kelas, dan TOKEN SOAL di pojok kanan atas.',
      this.padding + 16,
      y + 34
    );
  }
}
