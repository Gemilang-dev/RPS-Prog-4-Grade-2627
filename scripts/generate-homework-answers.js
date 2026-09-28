const fs = require('fs');
const path = require('path');

const answersDir = path.join(__dirname, '..', 'homework-answers', 'homework-3');
if (!fs.existsSync(answersDir)) {
  fs.mkdirSync(answersDir, { recursive: true });
}

const ANSWER_DATA = [
  {
    filename: 'amish-mohamed-answer.md',
    studentName: 'Amish Mohamed',
    caseTitle: 'Case File 03: Operation "Red Moon"',
    port: '1115',
    traceSteps: [
      'Line 1: MOV AX, 850  => AX = 850, BX = uninit, CX = uninit, DX = uninit',
      'Line 2: MOV BX, 325  => AX = 850, BX = 325,    CX = uninit, DX = uninit',
      'Line 3: SUB AX, BX   => AX = 525, BX = 325,    CX = uninit, DX = uninit  (850 - 325)',
      'Line 4: MOV CX, AX   => AX = 525, BX = 325,    CX = 525,    DX = uninit',
      'Line 5: ADD CX, 115  => AX = 525, BX = 325,    CX = 640,    DX = uninit  (525 + 115)',
      'Line 6: SUB AX, 50   => AX = 475, BX = 325,    CX = 640,    DX = uninit  (525 - 50)',
      'Line 7: MOV DX, CX   => AX = 475, BX = 325,    CX = 640,    DX = 640',
      'Line 8: ADD DX, AX   => AX = 475, BX = 325,    CX = 640,    DX = 1115  (640 + 475)'
    ],
    adminId: '999',
    pin: '777',
    attempts: 3,
    unlockBlock: 'Unlock_Vault',
    lockBlock: 'Lock_System',
    errorModule: 'SecurityCheck.obj'
  },
  {
    filename: 'hanan-saric-answer.md',
    studentName: 'Šarić Hanan',
    caseTitle: 'Case File 03: Operation "Neptune Abyss"',
    port: '1130',
    traceSteps: [
      'Line 1: MOV AX, 920  => AX = 920, BX = uninit, CX = uninit, DX = uninit',
      'Line 2: MOV BX, 410  => AX = 920, BX = 410,    CX = uninit, DX = uninit',
      'Line 3: SUB AX, BX   => AX = 510, BX = 410,    CX = uninit, DX = uninit  (920 - 410)',
      'Line 4: MOV CX, AX   => AX = 510, BX = 410,    CX = 510,    DX = uninit',
      'Line 5: ADD CX, 180  => AX = 510, BX = 410,    CX = 690,    DX = uninit  (510 + 180)',
      'Line 6: SUB AX, 70   => AX = 440, BX = 410,    CX = 690,    DX = uninit  (510 - 70)',
      'Line 7: MOV DX, CX   => AX = 440, BX = 410,    CX = 690,    DX = 690',
      'Line 8: ADD DX, AX   => AX = 440, BX = 410,    CX = 690,    DX = 1130  (690 + 440)'
    ],
    adminId: '888',
    pin: '555',
    attempts: 4,
    unlockBlock: 'Open_Hatch',
    lockBlock: 'Seal_Submarine',
    errorModule: 'SubmarineControl.obj'
  },
  {
    filename: 'hana-ibrulj-answer.md',
    studentName: 'Ibrulj Hana',
    caseTitle: 'Case File 03: Operation "Starlight Orbital"',
    port: '1150',
    traceSteps: [
      'Line 1: MOV AX, 780  => AX = 780, BX = uninit, CX = uninit, DX = uninit',
      'Line 2: MOV BX, 290  => AX = 780, BX = 290,    CX = uninit, DX = uninit',
      'Line 3: SUB AX, BX   => AX = 490, BX = 290,    CX = uninit, DX = uninit  (780 - 290)',
      'Line 4: MOV CX, AX   => AX = 490, BX = 290,    CX = 490,    DX = uninit',
      'Line 5: ADD CX, 210  => AX = 490, BX = 290,    CX = 700,    DX = uninit  (490 + 210)',
      'Line 6: SUB AX, 40   => AX = 450, BX = 290,    CX = 700,    DX = uninit  (490 - 40)',
      'Line 7: MOV DX, CX   => AX = 450, BX = 290,    CX = 700,    DX = 700',
      'Line 8: ADD DX, AX   => AX = 450, BX = 290,    CX = 700,    DX = 1150  (700 + 450)'
    ],
    adminId: '777',
    pin: '999',
    attempts: 3,
    unlockBlock: 'Grant_Docking',
    lockBlock: 'Emergency_Abort',
    errorModule: 'FlightGuidance.obj'
  },
  {
    filename: 'emina-mesic-answer.md',
    studentName: 'Mešić Emina',
    caseTitle: 'Case File 03: Operation "Quantum Shield"',
    port: '1220',
    traceSteps: [
      'Line 1: MOV AX, 950  => AX = 950, BX = uninit, CX = uninit, DX = uninit',
      'Line 2: MOV BX, 380  => AX = 950, BX = 380,    CX = uninit, DX = uninit',
      'Line 3: SUB AX, BX   => AX = 570, BX = 380,    CX = uninit, DX = uninit  (950 - 380)',
      'Line 4: MOV CX, AX   => AX = 570, BX = 380,    CX = 570,    DX = uninit',
      'Line 5: ADD CX, 140  => AX = 570, BX = 380,    CX = 710,    DX = uninit  (570 + 140)',
      'Line 6: SUB AX, 60   => AX = 510, BX = 380,    CX = 710,    DX = uninit  (570 - 60)',
      'Line 7: MOV DX, CX   => AX = 510, BX = 380,    CX = 710,    DX = 710',
      'Line 8: ADD DX, AX   => AX = 510, BX = 380,    CX = 710,    DX = 1220  (710 + 510)'
    ],
    adminId: '1337',
    pin: '404',
    attempts: 5,
    unlockBlock: 'Release_CryptoKey',
    lockBlock: 'Purge_EncryptionRAM',
    errorModule: 'CryptoVault.obj'
  },
  {
    filename: 'ahmed-delic-answer.md',
    studentName: 'Delić Ahmed',
    caseTitle: 'Case File 03: Operation "Hyperloop Sentinel"',
    port: '1020',
    traceSteps: [
      'Line 1: MOV AX, 640  => AX = 640, BX = uninit, CX = uninit, DX = uninit',
      'Line 2: MOV BX, 210  => AX = 640, BX = 210,    CX = uninit, DX = uninit',
      'Line 3: SUB AX, BX   => AX = 430, BX = 210,    CX = uninit, DX = uninit  (640 - 210)',
      'Line 4: MOV CX, AX   => AX = 430, BX = 210,    CX = 430,    DX = uninit',
      'Line 5: ADD CX, 190  => AX = 430, BX = 210,    CX = 620,    DX = uninit  (430 + 190)',
      'Line 6: SUB AX, 30   => AX = 400, BX = 210,    CX = 620,    DX = uninit  (430 - 30)',
      'Line 7: MOV DX, CX   => AX = 400, BX = 210,    CX = 620,    DX = 620',
      'Line 8: ADD DX, AX   => AX = 400, BX = 210,    CX = 620,    DX = 1020  (620 + 400)'
    ],
    adminId: '404',
    pin: '888',
    attempts: 3,
    unlockBlock: 'Switch_Track',
    lockBlock: 'Emergency_Brake',
    errorModule: 'RailDispatch.obj'
  },
  {
    filename: 'hamza-duderija-answer.md',
    studentName: 'Đuderija Hamza',
    caseTitle: 'Case File 03: Operation "BioGen Vault"',
    port: '1180',
    traceSteps: [
      'Line 1: MOV AX, 890  => AX = 890, BX = uninit, CX = uninit, DX = uninit',
      'Line 2: MOV BX, 340  => AX = 890, BX = 340,    CX = uninit, DX = uninit',
      'Line 3: SUB AX, BX   => AX = 550, BX = 340,    CX = uninit, DX = uninit  (890 - 340)',
      'Line 4: MOV CX, AX   => AX = 550, BX = 340,    CX = 550,    DX = uninit',
      'Line 5: ADD CX, 160  => AX = 550, BX = 340,    CX = 710,    DX = uninit  (550 + 160)',
      'Line 6: SUB AX, 80   => AX = 470, BX = 340,    CX = 710,    DX = uninit  (550 - 80)',
      'Line 7: MOV DX, CX   => AX = 470, BX = 340,    CX = 710,    DX = 710',
      'Line 8: ADD DX, AX   => AX = 470, BX = 340,    CX = 710,    DX = 1180  (710 + 470)'
    ],
    adminId: '2048',
    pin: '321',
    attempts: 3,
    unlockBlock: 'Seal_Containment',
    lockBlock: 'Decontaminate_Zone',
    errorModule: 'BioSafety.obj'
  }
];

ANSWER_DATA.forEach(item => {
  const mdContent = `# Answer Key: Homework 3 - ${item.studentName}
**Case Title:** ${item.caseTitle}

---

## Part 1: Tracing the Digital Footprint (ADD, SUB, MOV)

### Task 1.1: Register Classification
- **AX (Accumulator Register):** Primary general-purpose register used for core arithmetic operations (ADD, SUB) and data transfers.
- **BX (Base Register):** Used as a base register for memory offsets or temporary storage of variables.
- **CX (Count Register):** Used for loop iterations and storing intermediate calculation counts.
- **DX (Data Register):** General data storage register, specifically used here to store the final exfiltration port number.

### Task 1.2: Step-by-Step Memory Trace Table

\`\`\`text
${item.traceSteps.join('\n')}
\`\`\`

- **Final Value in DX:** \`${item.port}\` (Exfiltration Port ${item.port}).

---

## Part 2: The Logic Interrogation (CMP, JE, JNE, JMP)

### Task 2.1: Branching Anomaly Analysis
- **Logical Flaw Identified:** The perpetrator inverted the conditional jump logic after comparing \`User_Input\` (\`EAX\`) with the Master ID \`${item.adminId}\` (\`EBX\`).
  - \`JNE\` (Jump if Not Equal) jumps to the malicious bypass block when the user input is **INCORRECT** or **UNAUTHORIZED**.
  - \`JE\` (Jump if Equal) jumps to \`Access_Denied\` when the user input is **CORRECT**.
- **Impact:** Any unauthorized user entering a wrong ID bypasses security checks and disables alarms, while legitimate master ID users are denied access.

### Task 2.2: Infinite Loop Analysis
- **Concept:** An infinite loop occurs when a jump instruction continuously branches back to the same memory block (\`JMP Malicious_Bypass\`), preventing the program counter from advancing.
- **Perpetrator Rationale:** The perpetrator intentionally trapped the CPU in an endless execution loop to lock up the processor core, preventing watchdog timers, secondary security modules, or alarm notification routines from running.

---

## Part 3: Designing the New Security Protocol (Writing Assembly)

### Task 3: Solution Code & Inline Comments

\`\`\`assembly
MOV R1, ${item.pin}         ; Load the correct PIN (${item.pin}) into register R1
MOV R2, [User_PIN]  ; Load the user input PIN into register R2
MOV R3, ${item.attempts}           ; Initialize remaining attempts counter to ${item.attempts} in register R3
CMP R2, R1          ; Compare user input PIN (R2) against correct PIN (R1)
JE ${item.unlockBlock}     ; If PINs match (Equal), jump conditionally to ${item.unlockBlock}
SUB R3, 1           ; Deduct 1 from remaining attempts counter in R3
JMP ${item.lockBlock}     ; Jump unconditionally to ${item.lockBlock} block
\`\`\`

---

## Part 4: Recovery System Sabotage (Compilation Lifecycle)

### Task 4.1: Compilation Lifecycle Stage Identification
- **Stage:** **Linker Stage** (Linking Phase).
- **Justification:** The error message \`Fatal Error: Undefined reference to '${item.unlockBlock}' in module ${item.errorModule}\` occurs after individual source files have already been parsed and compiled into object files (\`.obj\`). The Linker is responsible for resolving cross-file symbol references across object modules.

### Task 4.2: Technical Explanation & Resolution Steps
- **Technical Explanation:** In a multi-file project, each file is compiled independently into an object file. When \`${item.errorModule}\` references symbol \`${item.unlockBlock}\`, the compiler leaves a placeholder reference. The Linker attempts to resolve this reference during the final build step. If the module defining \`${item.unlockBlock}\` is missing from the build configuration, not compiled, or the symbol is not exported (e.g., missing \`global\` or \`extern\` declaration), the Linker throws an "Undefined reference" fatal error.
- **Resolution Steps:**
  1. Verify that the source file containing \`${item.unlockBlock}\` label definition is included in the build Makefile or project build settings.
  2. Ensure symbol \`${item.unlockBlock}\` is exported as \`global\` or public in its defining file.
  3. Ensure the calling file declares \`extern ${item.unlockBlock}\` before referencing it.
  4. Re-run the build pipeline to allow the Linker to resolve the symbol and link object files into an executable.
`;

  fs.writeFileSync(path.join(answersDir, item.filename), mdContent, 'utf8');
  console.log(`✓ Generated Answer Key for ${item.studentName}: ${item.filename}`);
});

// Create Master Teacher Summary Key
const teacherSummary = `# Master Teacher Answer Key Summary - Homework 3 (Case File 03)

| Student Name | Case Title | Exfiltration Port (DX) | Admin ID | Correct PIN (R1) | Max Attempts (R3) | Unlock Label | Missing Reference Module |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **Amish Mohamed** | Operation "Red Moon" | **1115** | 999 | **777** | 3 | \`Unlock_Vault\` | \`SecurityCheck.obj\` |
| **Šarić Hanan** | Operation "Neptune Abyss" | **1130** | 888 | **555** | 4 | \`Open_Hatch\` | \`SubmarineControl.obj\` |
| **Ibrulj Hana** | Operation "Starlight Orbital" | **1150** | 777 | **999** | 3 | \`Grant_Docking\` | \`FlightGuidance.obj\` |
| **Mešić Emina** | Operation "Quantum Shield" | **1220** | 1337 | **404** | 5 | \`Release_CryptoKey\` | \`CryptoVault.obj\` |
| **Delić Ahmed** | Operation "Hyperloop Sentinel" | **1020** | 404 | **888** | 3 | \`Switch_Track\` | \`RailDispatch.obj\` |
| **Đuderija Hamza** | Operation "BioGen Vault" | **1180** | 2048 | **321** | 3 | \`Seal_Containment\` | \`BioSafety.obj\` |

> **Note:** All student answer keys are stored in \`homework-answers/homework-3/\` and are strictly excluded from public Git repositories via \`.gitignore\`.
`;

fs.writeFileSync(path.join(answersDir, 'README-TEACHER-KEY.md'), teacherSummary, 'utf8');
console.log('✓ Generated Master Teacher Summary Key: README-TEACHER-KEY.md');
