/**
 * Portal PR Pemrograman Kelas 4 SD - Tahun Ajaran 2026/2027
 * Database Homework, Siswa, dan Generator Soal Unik
 */

const ACADEMIC_INFO = {
  subject: "Pemrograman & Computational Thinking",
  grade: "Kelas 4 SD",
  academicYear: "2026 / 2027",
  teacher: "Tim Guru Pemrograman",
  portalTitle: "Portal PR Pemrograman Siswa - Kelas 4"
};

// Daftar Homework (PR)
const HOMEWORKS = [
  {
    id: "pr-1",
    code: "PR-01",
    title: "Algoritma & Urutan Langkah Robot (Sequence)",
    topic: "Algoritma Dasar & Langkah Berurutan",
    status: "Aktif",
    badgeColor: "badge-green",
    icon: "🤖",
    deadline: "22 September 2026, 23:59 WIB",
    description: "Belajar menyusun instruksi langkah demi langkah secara berurutan agar Robot Penjelajah bisa mencapai tujuan tanpa menabrak rintangan.",
    instructions: [
      "Perhatikan posisi awal robot dan posisi target pada peta grid koordinat kamu.",
      "Tuliskan urutan blok perintah: Maju(langkah), Belok Kiri, Belok Kanan, atau Ambil Bintang.",
      "Ingat: Setiap siswa memiliki posisi awal dan rintangan yang BERBEDA!",
      "Tulis jawaban rapi di buku PR atau lembar tugas yang dibagikan."
    ]
  },
  {
    id: "pr-2",
    code: "PR-02",
    title: "Logika Percabangan (If - Then - Else)",
    topic: "Pengambilan Keputusan & Kondisi",
    status: "Aktif",
    badgeColor: "badge-green",
    icon: "🔀",
    deadline: "29 September 2026, 23:59 WIB",
    description: "Menganalisis kondisi logika percabangan. Apa yang akan dilakukan karakter jika kondisi tertentu terpenuhi atau tidak terpenuhi?",
    instructions: [
      "Baca skenario kondisi sensor robot/karakter pada soal unikmu.",
      "Tentukan keluaran (output) aksi jika sensor mendeteksi nilai tertentu.",
      "Kerjakan sesuai angka dan warna sensor spesifik milik namamu.",
      "Dilarang menyalin jawaban teman karena parameter soalmu berbeda."
    ]
  },
  {
    id: "pr-3",
    code: "PR-03",
    title: "Perulangan & Pola Gerak (Loops / Repeat)",
    topic: "Efisiensi Kode dengan Loop",
    status: "Segera",
    badgeColor: "badge-amber",
    icon: "🔁",
    deadline: "06 Oktober 2026, 23:59 WIB",
    description: "Menyederhanakan serangkaian instruksi panjang menjadi blok perulangan (repeat) yang rapi dan efisien.",
    instructions: [
      "Hitung berapa kali suatu pola instruksi berulang.",
      "Tuliskan perintah dengan format: ULANGI [n] KALI { ... }.",
      "Setiap siswa memiliki pola lintasan geometri yang unik."
    ]
  },
  {
    id: "pr-4",
    code: "PR-04",
    title: "Variabel & Perhitungan Skor Game",
    topic: "Penyimpanan Data & Variabel Game",
    status: "Mendatang",
    badgeColor: "badge-slate",
    icon: "⭐",
    deadline: "13 Oktober 2026, 23:59 WIB",
    description: "Menghitung perubahan nilai variabel skor, nyawa (lives), dan koin berdasarkan aksi yang terjadi dalam game.",
    instructions: [
      "Ikuti perubahan nilai variabel langkah demi langkah.",
      "Hitung nilai akhir variabel setelah seluruh event selesai dijalankan."
    ]
  }
];

// Daftar Siswa Kelas 4A dan 4B (Dapat ditambahkan/diubah dengan mudah)
const STUDENTS = [
  // KELAS 4A
  { id: "4A-01", rollNo: 1, name: "Aditya Pratama", class: "4A", nis: "26274001" },
  { id: "4A-02", rollNo: 2, name: "Alisha Putri Khairunnisa", class: "4A", nis: "26274002" },
  { id: "4A-03", rollNo: 3, name: "Bagas Arya Sena", class: "4A", nis: "26274003" },
  { id: "4A-04", rollNo: 4, name: "Chelsea Olivia Wijaya", class: "4A", nis: "26274004" },
  { id: "4A-05", rollNo: 5, name: "Darrell Evan Kurniawan", class: "4A", nis: "26274005" },
  { id: "4A-06", rollNo: 6, name: "Fakhri Ahmadinejad", class: "4A", nis: "26274006" },
  { id: "4A-07", rollNo: 7, name: "Gracia Aurelia Tan", class: "4A", nis: "26274007" },
  { id: "4A-08", rollNo: 8, name: "Hafizh Rayhan Al-Fatih", class: "4A", nis: "26274008" },
  { id: "4A-09", rollNo: 9, name: "Keisha Naura Shaqueena", class: "4A", nis: "26274009" },
  { id: "4A-10", rollNo: 10, name: "Marvel Jonathan Lee", class: "4A", nis: "26274010" },
  { id: "4A-11", rollNo: 11, name: "Nadine Kirana Larasati", class: "4A", nis: "26274011" },
  { id: "4A-12", rollNo: 12, name: "Rafi Danendra Putra", class: "4A", nis: "26274012" },
  { id: "4A-13", rollNo: 13, name: "Samuel Alexander Situmorang", class: "4A", nis: "26274013" },
  { id: "4A-14", rollNo: 14, name: "Zahra Salsabila Ramadhani", class: "4A", nis: "26274014" },

  // KELAS 4B
  { id: "4B-01", rollNo: 1, name: "Aldo Christian Nugroho", class: "4B", nis: "26274015" },
  { id: "4B-02", rollNo: 2, name: "Anindya Nareswari", class: "4B", nis: "26274016" },
  { id: "4B-03", rollNo: 3, name: "Bima Satria Wicaksono", class: "4B", nis: "26274017" },
  { id: "4B-04", rollNo: 4, name: "Clarissa Natalie Putri", class: "4B", nis: "26274018" },
  { id: "4B-05", rollNo: 5, name: "Daffa Ibnu Hafidz", class: "4B", nis: "26274019" },
  { id: "4B-06", rollNo: 6, name: "Fiona Michelle Ang", class: "4B", nis: "26274020" },
  { id: "4B-07", rollNo: 7, name: "Galang Surya Pratama", class: "4B", nis: "26274021" },
  { id: "4B-08", rollNo: 8, name: "Hana Az-Zahra", class: "4B", nis: "26274022" },
  { id: "4B-09", rollNo: 9, name: "Jonathan William Hartono", class: "4B", nis: "26274023" },
  { id: "4B-10", rollNo: 10, name: "Kayla Nadira Pramudita", class: "4B", nis: "26274024" },
  { id: "4B-11", rollNo: 11, name: "Michael Bryan Chandra", class: "4B", nis: "26274025" },
  { id: "4B-12", rollNo: 12, name: "Nayla Syarifah", class: "4B", nis: "26274026" },
  { id: "4B-13", rollNo: 13, name: "Revan Aditya Kurniawan", class: "4B", nis: "26274027" },
  { id: "4B-14", rollNo: 14, name: "Syifa Aulia Rahma", class: "4B", nis: "26274028" }
];

/**
 * Generator Soal Khusus:
 * Menghasilkan variasi soal yang BERBEDA untuk setiap siswa
 * Menggunakan hashing nomor absen & ID siswa agar konsisten tapi unik per anak.
 */
function getUniqueQuestion(homeworkId, student) {
  // Deterministic seed berdasarkan ID siswa dan nomor PR
  const seed = (student.rollNo * 37 + student.name.charCodeAt(0) * 13 + (homeworkId === "pr-1" ? 101 : homeworkId === "pr-2" ? 202 : homeworkId === "pr-3" ? 303 : 404)) % 1000;

  if (homeworkId === "pr-1") {
    // PR 1: Algoritma & Urutan Langkah Robot (Sequence)
    const robotNames = ["Robo-Kancil", "Bot-Garuda", "Astro-Kucing", "Cyber-Lumba", "Mecha-Elang"];
    const targetItems = ["Permata Emas", "Baterai Energi Surya", "Kristal Biru Langka", "Kunci Gerbang Cyber", "Bintang Nebula"];
    const directions = ["Utara", "Timur", "Selatan", "Barat"];
    
    const rName = robotNames[seed % robotNames.length];
    const target = targetItems[(seed + 2) % targetItems.length];
    const initialFacing = directions[seed % directions.length];
    
    // Grid 6x6 koordinat
    const startX = (seed % 3) + 1; // 1 - 3
    const startY = ((seed * 7) % 3) + 1; // 1 - 3
    const targetX = startX + ((seed % 3) + 2); // startX + 2..4
    const targetY = startY + (((seed * 3) % 3) + 2); // startY + 2..4
    
    // Rintangan (Obstacle)
    const obsX = startX + 1;
    const obsY = startY;

    const deltaX = targetX - startX;
    const deltaY = targetY - startY;

    return {
      title: "Misi Navigasi Robot Penjelajah",
      token: `PR1-${student.class}-${student.rollNo.toString().padStart(2, '0')}-${seed.toString(16).toUpperCase()}`,
      scenario: `Robot kamu bernama **${rName}**. Saat ini ${rName} berada di grid peta luar angkasa pada titik koordinat awal **(${startX}, ${startY})** menghadap ke arah **${initialFacing}**.`,
      mission: `Misi ${rName} adalah mengambil **${target}** yang berada di koordinat **(${targetX}, ${targetY})**. Namun hati-hati, terdapat **Rintangan Batu Meteor** di koordinat **(${obsX}, ${obsY})** yang TIDAK BOLEH ditabrak!`,
      gridData: {
        size: 7,
        robot: { x: startX, y: startY, name: rName, facing: initialFacing },
        target: { x: targetX, y: targetY, name: target },
        obstacle: { x: obsX, y: obsY, name: "Meteor" }
      },
      questions: [
        {
          num: 1,
          type: "Analisis Jarak",
          text: `Berapa langkah total paling sedikit (minimal) yang harus ditempuh oleh ${rName} dari titik (${startX}, ${startY}) menuju titik (${targetX}, ${targetY}) tanpa menabrak rintangan? Jelaskan jalur yang kamu pilih!`
        },
        {
          num: 2,
          type: "Susunan Algoritma Berurutan (Sequence)",
          text: `Tuliskan urutan instruksi lengkap langkah demi langkah untuk ${rName}! Gunakan hanya 4 perintah dasar berikut:\n- MAJU(langkah)\n- PUTAR_KIRI\n- PUTAR_KANAN\n- AMBIL_TARGET`
        },
        {
          num: 3,
          type: "Pencarian Kesalahan (Debugging)",
          text: `Seorang teknisi mencoba kode berikut untuk robotmu:\n"MAJU(${deltaX}) lalu PUTAR_KANAN lalu MAJU(${deltaY})".\nApakah kode tersebut berhasil mencapai target atau menabrak rintangan meteor (${obsX}, ${obsY})? Tunjukkan bagian mana yang salah dan perbaikilah!`
        }
      ]
    };
  } else if (homeworkId === "pr-2") {
    // PR 2: Logika Percabangan (If - Then - Else)
    const sensors = ["Sensor Jarak", "Sensor Suhu Ruangan", "Sensor Cahaya", "Sensor Warna Pintu"];
    const sensorType = sensors[seed % sensors.length];
    const threshold = 20 + (seed % 40); // 20 - 59
    const testValue1 = threshold - ((seed % 10) + 2);
    const testValue2 = threshold + ((seed % 10) + 3);

    return {
      title: "Logika Keputusan Sensor Cerdas (If-Else)",
      token: `PR2-${student.class}-${student.rollNo.toString().padStart(2, '0')}-${seed.toString(16).toUpperCase()}`,
      scenario: `Kamu sedang merancang sistem gerbang otomatis di pangkalan roket. Sistem ini menggunakan **${sensorType}** dengan batas acuan (threshold) sebesar **${threshold} unit**.`,
      mission: `Aturan algoritma yang kamu buat adalah:\n` +
               `• **JIKA** nilai ${sensorType} < ${threshold} :\n` +
               `    Bunyikan Alarm "SIAGA HIJAU" dan Buka Pintu Perlahan.\n` +
               `• **JIKA TIDAK** (nilai sensor >= ${threshold}) :\n` +
               `    Nyalakan Lampu Merah, Kunci Pintu Rapat, dan Kirim Pesan Bahaya ke Komandan.`,
      questions: [
        {
          num: 1,
          type: "Prediksi Output Kasus 1",
          text: `Jika pada pukul 08:00 pagi nilai ${sensorType} terbaca sebesar **${testValue1} unit**, tuliskan apa saja tindakan yang dilakukan oleh sistem gerbang tersebut!`
        },
        {
          num: 2,
          type: "Prediksi Output Kasus 2",
          text: `Jika pada pukul 14:00 siang nilai ${sensorType} melonjak menjadi **${testValue2} unit**, apakah pintu gerbang akan dibuka? Jelaskan alasan logisnya berdasarkan aturan IF-THEN-ELSE di atas!`
        },
        {
          num: 3,
          type: "Modifikasi Percabangan Bertingkat",
          text: `Tambahkan satu kondisi baru: Jika nilai tepat bernilai **0 unit**, maka sistem harus berteriak "SENSOR RUSAK!". Ubahlah susunan IF-THEN-ELSE di atas menjadi percabangan yang lengkap!`
        }
      ]
    };
  } else if (homeworkId === "pr-3") {
    // PR 3: Perulangan & Pola Gerak (Loops / Repeat)
    const shapes = ["Persegi", "Segitiga Sama Sisi", "Bintang 5 Sudut", "Tangga Spiral", "Segi Enam (Hexagon)"];
    const chosenShape = shapes[seed % shapes.length];
    const stepSize = 40 + (seed % 6) * 10;
    const repeatCount = (seed % 4) + 3;

    return {
      title: "Efisiensi Pola Gerak dengan Blok Perulangan (Loop)",
      token: `PR3-${student.class}-${student.rollNo.toString().padStart(2, '0')}-${seed.toString(16).toUpperCase()}`,
      scenario: `Karakter Sprite kamu ingin menggambar bentuk **${chosenShape}** di atas kanvas pemrograman dengan ukuran langkah sebesar **${stepSize} piksel**.`,
      mission: `Tugasmu adalah menggantikan kode berulang yang panjang menjadi blok perulangan **ULANGI [n] KALI** yang ringkas dan rapi.`,
      questions: [
        {
          num: 1,
          type: "Analisis Pengulangan",
          text: `Jika untuk menggambar satu sisi membutuhkan 2 blok: [MAJU ${stepSize}] dan [PUTAR], berapa total jumlah blok yang kamu hemat jika menggunakan blok perulangan dibanding menulis kode satu per satu?`
        },
        {
          num: 2,
          type: "Penulisan Blok Loop",
          text: `Tuliskan struktur blok perulangan lengkap untuk menggambar ${chosenShape} tersebut menggunakan format kode blok Scratch/Blockly!`
        },
        {
          num: 3,
          type: "Tantangan Loop Bertingkat (Nested Loop)",
          text: `Jika kamu ingin menggambar bentuk tersebut sebanyak **${repeatCount} kali** berputar mengelilingi satu titik tengah, bagaimana susunan kode perulangan di dalam perulangan (Nested Loop)?`
        }
      ]
    };
  } else {
    // PR 4: Variabel & Skor Game
    const initialCoins = (seed % 50) + 10;
    const bonusPerStar = ((seed % 5) + 2) * 5; // 10, 15, 20...
    const penaltyTrap = ((seed % 3) + 1) * 5; // 5, 10, 15
    const starCount = (seed % 4) + 2;
    const trapCount = (seed % 3) + 1;

    const finalScore = initialCoins + (starCount * bonusPerStar) - (trapCount * penaltyTrap);

    return {
      title: "Kalkulasi Variabel Skor Game & Logika Matematika",
      token: `PR4-${student.class}-${student.rollNo.toString().padStart(2, '0')}-${seed.toString(16).toUpperCase()}`,
      scenario: `Dalam permainan petualanganmu, terdapat variabel bernama **skor_pemain**. Di awal level, nilai awal **skor_pemain** diatur sebesar **${initialCoins} poin**.`,
      mission: `Aturan perolehan poin:\n` +
               `• Setiap kali menyentuh Bintang Emas: skor bertambah **+${bonusPerStar} poin**.\n` +
               `• Setiap kali terkena Rintangan Duri: skor berkurang **-${penaltyTrap} poin**.\n` +
               `• Pemain dinyatakan menang jika skor akhir minimal 100 poin.`,
      questions: [
        {
          num: 1,
          type: "Perhitungan Variabel Bertahap",
          text: `Selama permainan, karaktermu berhasil mengumpulkan **${starCount} Bintang Emas** dan terserempet **${trapCount} Rintangan Duri**. Hitunglah nilai akhir dari variabel **skor_pemain** secara bertahap!`
        },
        {
          num: 2,
          type: "Analisis Kondisi Kemenangan",
          text: `Berdasarkan skor akhir yang kamu peroleh di nomor 1 (apakah mencapai ${finalScore} poin?), apakah karaktermu dinyatakan MENANG atau BELUM MENANG? Berapa poin lagi yang dibutuhkan jika belum menang?`
        },
        {
          num: 3,
          type: "Rancangan Variabel Baru",
          text: `Jika kamu ingin menambahkan variabel baru bernama **nyawa_pemain** (bernilai awal 3), tuliskan blok perintah logika apa yang terjadi pada **nyawa_pemain** saat menyentuh Rintangan Duri!`
        }
      ]
    };
  }
}

// Support Node.js testing/scripting if executed in Node environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ACADEMIC_INFO,
    HOMEWORKS,
    STUDENTS,
    getUniqueQuestion
  };
}

