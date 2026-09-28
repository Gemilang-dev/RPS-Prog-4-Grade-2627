const fs = require('fs');
const path = require('path');

const STUDENTS = [
  {
    filename: 'amish-mohamed.html',
    name: 'Amish Mohamed',
    id: 'amish',
    caseTitle: 'Case File 03: Operation "Red Moon"',
    storyContext: 'Last night, the digital vault at the CyberDyne research laboratory was breached. The perpetrator bypassed the physical destruction of the vault by injecting Assembly code directly into the security processor to manipulate memory values and disable the alarm system. You are the digital forensic detective assigned to analyze the machine code left behind and rewrite the security protocols.',
    part1Intro: 'At the crime scene, you recovered a fragment of machine code that has been disassembled into the instructions below. The perpetrator used register <code>AX</code> to hold the decryption key, and register <code>BX</code> as a temporary manipulation variable. Before tracing, you must classify these registers based on their function.',
    part1Code: `<span class="instruction">MOV</span> <span class="register">AX</span>, <span class="number">850</span>
<span class="instruction">MOV</span> <span class="register">BX</span>, <span class="number">325</span>
<span class="instruction">SUB</span> <span class="register">AX</span>, <span class="register">BX</span>
<span class="instruction">MOV</span> <span class="register">CX</span>, <span class="register">AX</span>
<span class="instruction">ADD</span> <span class="register">CX</span>, <span class="number">115</span>
<span class="instruction">SUB</span> <span class="register">AX</span>, <span class="number">50</span>
<span class="instruction">MOV</span> <span class="register">DX</span>, <span class="register">CX</span>
<span class="instruction">ADD</span> <span class="register">DX</span>, <span class="register">AX</span>`,
    part2Intro: 'Server logs indicate the perpetrator encountered a secondary security gate. The gate compares a given input ID with the Administrator ID (ID = 999). The perpetrator successfully bypassed the system by injecting a logical flaw into the branching routine:',
    part2Code: `<span class="instruction">MOV</span> <span class="register">EAX</span>, [User_Input]
<span class="instruction">MOV</span> <span class="register">EBX</span>, <span class="number">999</span>
<span class="instruction">CMP</span> <span class="register">EAX</span>, <span class="register">EBX</span>
<span class="instruction">JNE</span> Malicious_Bypass
<span class="instruction">JE</span> Access_Denied

Malicious_Bypass:
    <span class="instruction">MOV</span> <span class="register">ECX</span>, <span class="number">1</span>
    <span class="instruction">JMP</span> Malicious_Bypass  <span class="comment">; System hangs in a loop to disable the alarm</span>

Access_Denied:
    <span class="instruction">MOV</span> <span class="register">ECX</span>, <span class="number">0</span>

End_Program:
    <span class="comment">; Halt</span>`,
    part3Intro: 'CyberDyne management has appointed you to design a new vault locking system from scratch to model low-level computational thinking. The new system must adhere to the following logic:',
    pin: '777',
    maxAttempts: 3,
    unlockBlock: 'Unlock_Vault',
    lockBlock: 'Lock_System',
    part4Intro: "After rewriting the Assembly logic, you attempt to recompile the entire security system into machine code. CyberDyne's security software is a multi-file project. However, when you initiate the build process, the system fails to generate the executable and outputs the following error message:",
    errorMsg: "Fatal Error: Undefined reference to 'Unlock_Vault' in module SecurityCheck.obj"
  },

  {
    filename: 'hanan-saric.html',
    name: 'Šarić Hanan',
    id: 'hanan',
    caseTitle: 'Case File 03: Operation "Neptune Abyss"',
    storyContext: 'At midnight, the sub-oceanic propulsion core at the Triton Trench Underwater Station was compromised. An unidentified intruder injected rogue Assembly instructions into the ballast computer to override pressure valves and flood the laboratory. As Chief Cyber Investigator, your task is to trace the execution path and engineer a tamper-proof valve lockdown routine.',
    part1Intro: 'Forensic memory dumps revealed an eight-instruction payload left in the station buffer. Register <code>AX</code> was loaded with the emergency override frequency, while <code>BX</code> acted as a ballast scaling coefficient. Classify these registers and perform a complete trace to identify the exfiltration port.',
    part1Code: `<span class="instruction">MOV</span> <span class="register">AX</span>, <span class="number">920</span>
<span class="instruction">MOV</span> <span class="register">BX</span>, <span class="number">410</span>
<span class="instruction">SUB</span> <span class="register">AX</span>, <span class="register">BX</span>
<span class="instruction">MOV</span> <span class="register">CX</span>, <span class="register">AX</span>
<span class="instruction">ADD</span> <span class="register">CX</span>, <span class="number">180</span>
<span class="instruction">SUB</span> <span class="register">AX</span>, <span class="number">70</span>
<span class="instruction">MOV</span> <span class="register">DX</span>, <span class="register">CX</span>
<span class="instruction">ADD</span> <span class="register">DX</span>, <span class="register">AX</span>`,
    part2Intro: 'Submarine logs show the intruder confronted the main pressure gate. The door validator evaluates user badge clearance against the Captain ID (ID = 888). The intruder manipulated conditional jump instructions to trap the system in an unrecoverable state:',
    part2Code: `<span class="instruction">MOV</span> <span class="register">EAX</span>, [User_Input]
<span class="instruction">MOV</span> <span class="register">EBX</span>, <span class="number">888</span>
<span class="instruction">CMP</span> <span class="register">EAX</span>, <span class="register">EBX</span>
<span class="instruction">JNE</span> Ocean_Override
<span class="instruction">JE</span> Valve_Locked

Ocean_Override:
    <span class="instruction">MOV</span> <span class="register">ECX</span>, <span class="number">1</span>
    <span class="instruction">JMP</span> Ocean_Override  <span class="comment">; Traps processor to force pressure valve leak</span>

Valve_Locked:
    <span class="instruction">MOV</span> <span class="register">ECX</span>, <span class="number">0</span>

End_Program:
    <span class="comment">; Halt</span>`,
    part3Intro: 'Triton Station Command has commissioned you to build a replacement electronic hatch controller. The replacement mechanism must execute the following low-level logic:',
    pin: '555',
    maxAttempts: 4,
    unlockBlock: 'Open_Hatch',
    lockBlock: 'Seal_Submarine',
    part4Intro: 'Upon compiling the multi-file underwater control suite using the modular toolchain, the build pipeline fails with the following diagnostic message:',
    errorMsg: "Fatal Error: Undefined reference to 'Open_Hatch' in module SubmarineControl.obj"
  },

  {
    filename: 'hana-ibrulj.html',
    name: 'Ibrulj Hana',
    id: 'hana',
    caseTitle: 'Case File 03: Operation "Starlight Orbital"',
    storyContext: 'During an orbital maneuver, the flight control array aboard the Aether-9 International Space Station suffered an inline code injection attack. The attacker modified assembly instructions in the thruster microcontroller, causing navigation drift. You are the senior orbital forensics engineer assigned to analyze the memory trail and rewrite the navigation safety module.',
    part1Intro: 'Telemetry capture tools retrieved an assembly fragment stored in the navigation cache. Register <code>AX</code> held the target trajectory vector, and register <code>BX</code> stored orbital drag resistance. Classify the registers and calculate the step-by-step register trace to reveal the unauthorized transmission channel.',
    part1Code: `<span class="instruction">MOV</span> <span class="register">AX</span>, <span class="number">780</span>
<span class="instruction">MOV</span> <span class="register">BX</span>, <span class="number">290</span>
<span class="instruction">SUB</span> <span class="register">AX</span>, <span class="register">BX</span>
<span class="instruction">MOV</span> <span class="register">CX</span>, <span class="register">AX</span>
<span class="instruction">ADD</span> <span class="register">CX</span>, <span class="number">210</span>
<span class="instruction">SUB</span> <span class="register">AX</span>, <span class="number">40</span>
<span class="instruction">MOV</span> <span class="register">DX</span>, <span class="register">CX</span>
<span class="instruction">ADD</span> <span class="register">DX</span>, <span class="register">AX</span>`,
    part2Intro: 'Flight logs indicate the attacker reached the Station Docking Gate. The gate verifies shuttle authorization codes against Mission Control Master Clearance (ID = 777). The attacker exploited a flaw in conditional jumps to lock the airlock open:',
    part2Code: `<span class="instruction">MOV</span> <span class="register">EAX</span>, [User_Input]
<span class="instruction">MOV</span> <span class="register">EBX</span>, <span class="number">777</span>
<span class="instruction">CMP</span> <span class="register">EAX</span>, <span class="register">EBX</span>
<span class="instruction">JNE</span> Orbital_Bypass
<span class="instruction">JE</span> Docking_Denied

Orbital_Bypass:
    <span class="instruction">MOV</span> <span class="register">ECX</span>, <span class="number">1</span>
    <span class="instruction">JMP</span> Orbital_Bypass  <span class="comment">; Thruster control loop frozen indefinitely</span>

Docking_Denied:
    <span class="instruction">MOV</span> <span class="register">ECX</span>, <span class="number">0</span>

End_Program:
    <span class="comment">; Halt</span>`,
    part3Intro: 'Space Agency Operations directed you to code a brand-new flight authorization module in assembly according to the following specifications:',
    pin: '999',
    maxAttempts: 3,
    unlockBlock: 'Grant_Docking',
    lockBlock: 'Emergency_Abort',
    part4Intro: 'When linking the space station firmware across multiple source modules, the build system terminates prematurely with the following linker error:',
    errorMsg: "Fatal Error: Undefined reference to 'Grant_Docking' in module FlightGuidance.obj"
  },

  {
    filename: 'emina-mesic.html',
    name: 'Mešić Emina',
    id: 'emina',
    caseTitle: 'Case File 03: Operation "Quantum Shield"',
    storyContext: 'Early this morning, the Quantum Encryption Vault at Apex Financial Datacenter was compromised. The cyber intruder bypassed hardware encryption by injecting raw assembly bytecode into the key distribution unit, freezing security logs. As Lead Crypto-Forensic Analyst, you must reconstruct the machine execution path and deploy a resilient vault safeguard.',
    part1Intro: 'Memory extraction tools captured an 8-line machine code sequence from the hardware crypto-accelerator. Register <code>AX</code> contained the primary prime factor, while <code>BX</code> held the exponent modifier. Classify the registers and complete the step-by-step trace to determine the exfiltration port.',
    part1Code: `<span class="instruction">MOV</span> <span class="register">AX</span>, <span class="number">950</span>
<span class="instruction">MOV</span> <span class="register">BX</span>, <span class="number">380</span>
<span class="instruction">SUB</span> <span class="register">AX</span>, <span class="register">BX</span>
<span class="instruction">MOV</span> <span class="register">CX</span>, <span class="register">AX</span>
<span class="instruction">ADD</span> <span class="register">CX</span>, <span class="number">140</span>
<span class="instruction">SUB</span> <span class="register">AX</span>, <span class="number">60</span>
<span class="instruction">MOV</span> <span class="register">DX</span>, <span class="register">CX</span>
<span class="instruction">ADD</span> <span class="register">DX</span>, <span class="register">AX</span>`,
    part2Intro: 'Datacenter audit trails show the intruder approached the Quantum Cryptographic Core. The validator compares user authentication tokens against the Master Key (ID = 1337). The intruder introduced a branch logic error to stall security verification:',
    part2Code: `<span class="instruction">MOV</span> <span class="register">EAX</span>, [User_Input]
<span class="instruction">MOV</span> <span class="register">EBX</span>, <span class="number">1337</span>
<span class="instruction">CMP</span> <span class="register">EAX</span>, <span class="register">EBX</span>
<span class="instruction">JNE</span> Crypto_Bypass
<span class="instruction">JE</span> Access_Forbidden

Crypto_Bypass:
    <span class="instruction">MOV</span> <span class="register">ECX</span>, <span class="number">1</span>
    <span class="instruction">JMP</span> Crypto_Bypass  <span class="comment">; Processor spinlock disables key revocation</span>

Access_Forbidden:
    <span class="instruction">MOV</span> <span class="register">ECX</span>, <span class="number">0</span>

End_Program:
    <span class="comment">; Halt</span>`,
    part3Intro: 'Apex Chief Security Officer requested you to implement a custom authentication protocol in low-level assembly following these requirements:',
    pin: '404',
    maxAttempts: 5,
    unlockBlock: 'Release_CryptoKey',
    lockBlock: 'Purge_EncryptionRAM',
    part4Intro: 'During compilation of the multi-file security suite, the toolchain halts during the final build step with the following error:',
    errorMsg: "Fatal Error: Undefined reference to 'Release_CryptoKey' in module CryptoVault.obj"
  },

  {
    filename: 'ahmed-delic.html',
    name: 'Delić Ahmed',
    id: 'ahmed',
    caseTitle: 'Case File 03: Operation "Hyperloop Sentinel"',
    storyContext: 'A high-speed autonomous maglev train travelling at 500 km/h suffered a critical dispatch computer attack. An unknown hacker injected assembly instructions into the track signaling processor, disrupting speed sensors and track switching. You are the High-Speed Railway Forensics Specialist tasked with tracing the malicious code and rebuilding the train control safety logic.',
    part1Intro: 'The train crash-prevention recorder captured an assembly payload in the signaling buffer. Register <code>AX</code> held the speed limit value, while <code>BX</code> represented braking deceleration distance. Classify the registers and perform a line-by-line trace to discover the rogue communication port.',
    part1Code: `<span class="instruction">MOV</span> <span class="register">AX</span>, <span class="number">640</span>
<span class="instruction">MOV</span> <span class="register">BX</span>, <span class="number">210</span>
<span class="instruction">SUB</span> <span class="register">AX</span>, <span class="register">BX</span>
<span class="instruction">MOV</span> <span class="register">CX</span>, <span class="register">AX</span>
<span class="instruction">ADD</span> <span class="register">CX</span>, <span class="number">190</span>
<span class="instruction">SUB</span> <span class="register">AX</span>, <span class="number">30</span>
<span class="instruction">MOV</span> <span class="register">DX</span>, <span class="register">CX</span>
<span class="instruction">ADD</span> <span class="register">DX</span>, <span class="register">AX</span>`,
    part2Intro: 'Signal box logs revealed the intruder targeted the Track Junction Controller. The controller verifies dispatcher passcodes against Central Control ID (ID = 404). The hacker injected a faulty jump sequence to force a junction deadlock:',
    part2Code: `<span class="instruction">MOV</span> <span class="register">EAX</span>, [User_Input]
<span class="instruction">MOV</span> <span class="register">EBX</span>, <span class="number">404</span>
<span class="instruction">CMP</span> <span class="register">EAX</span>, <span class="register">EBX</span>
<span class="instruction">JNE</span> Junction_Override
<span class="instruction">JE</span> Track_Locked

Junction_Override:
    <span class="instruction">MOV</span> <span class="register">ECX</span>, <span class="number">1</span>
    <span class="instruction">JMP</span> Junction_Override  <span class="comment">; Loops CPU to block automatic emergency braking</span>

Track_Locked:
    <span class="instruction">MOV</span> <span class="register">ECX</span>, <span class="number">0</span>

End_Program:
    <span class="comment">; Halt</span>`,
    part3Intro: 'Railway Safety Authorities instructed you to write a clean assembly routine to validate train dispatcher access codes based on the following rules:',
    pin: '888',
    maxAttempts: 3,
    unlockBlock: 'Switch_Track',
    lockBlock: 'Emergency_Brake',
    part4Intro: 'When assembling and linking the multi-file rail control software, the build toolchain reports the following fatal error:',
    errorMsg: "Fatal Error: Undefined reference to 'Switch_Track' in module RailDispatch.obj"
  },

  {
    filename: 'hamza-duderija.html',
    name: 'Đuderija Hamza',
    id: 'hamza',
    caseTitle: 'Case File 03: Operation "BioGen Vault"',
    storyContext: 'Last night, the containment atmosphere computer at BioGen Medical Labs was breached. A malicious actor injected assembly instructions into the HVAC micro-controller to manipulate oxygen and temperature levels in the hazardous virus storage unit. You are the Bio-Tech Security Forensic Investigator assigned to trace the breach and engineer a secure containment lock.',
    part1Intro: 'Forensic RAM dumps retrieved an assembly sequence executed right before environmental alarms failed. Register <code>AX</code> stored the temperature sensor reading, and <code>BX</code> stored the pressure offset. Classify the registers and trace the execution step-by-step to reveal the hacker exfiltration channel.',
    part1Code: `<span class="instruction">MOV</span> <span class="register">AX</span>, <span class="number">890</span>
<span class="instruction">MOV</span> <span class="register">BX</span>, <span class="number">340</span>
<span class="instruction">SUB</span> <span class="register">AX</span>, <span class="register">BX</span>
<span class="instruction">MOV</span> <span class="register">CX</span>, <span class="register">AX</span>
<span class="instruction">ADD</span> <span class="register">CX</span>, <span class="number">160</span>
<span class="instruction">SUB</span> <span class="register">AX</span>, <span class="number">80</span>
<span class="instruction">MOV</span> <span class="register">DX</span>, <span class="register">CX</span>
<span class="instruction">ADD</span> <span class="register">DX</span>, <span class="register">AX</span>`,
    part2Intro: 'Containment logs indicate the intruder reached the Bio-Hazard Gate. The gate checks authorization card numbers against Chief Scientist ID (ID = 2048). The intruder manipulated conditional branches to cause a system hang:',
    part2Code: `<span class="instruction">MOV</span> <span class="register">EAX</span>, [User_Input]
<span class="instruction">MOV</span> <span class="register">EBX</span>, <span class="number">2048</span>
<span class="instruction">CMP</span> <span class="register">EAX</span>, <span class="register">EBX</span>
<span class="instruction">JNE</span> Bio_Bypass
<span class="instruction">JE</span> Containment_Secured

Bio_Bypass:
    <span class="instruction">MOV</span> <span class="register">ECX</span>, <span class="number">1</span>
    <span class="instruction">JMP</span> Bio_Bypass  <span class="comment">; Endless loop traps processor to prevent vent closure</span>

Containment_Secured:
    <span class="instruction">MOV</span> <span class="register">ECX</span>, <span class="number">0</span>

End_Program:
    <span class="comment">; Halt</span>`,
    part3Intro: 'BioGen Administration commissioned you to author a brand-new electronic containment lock in assembly according to these requirements:',
    pin: '321',
    maxAttempts: 3,
    unlockBlock: 'Seal_Containment',
    lockBlock: 'Decontaminate_Zone',
    part4Intro: 'When building the multi-module bio-safety control system, the build environment fails at the final linking phase with this message:',
    errorMsg: "Fatal Error: Undefined reference to 'Seal_Containment' in module BioSafety.obj"
  }
];

function generateHomework3Html(student) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${student.caseTitle} - ${student.name}</title>
    <link rel="stylesheet" href="../../css/security.css">
    <style>
        @page {
            size: A4;
            margin: 18mm 15mm 18mm 15mm;
            background-color: #fdfbf7;
        }
        *, *::before, *::after {
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
            font-size: 10.5pt;
            line-height: 1.6;
            color: #2d3748;
            margin: 0;
            padding: 24px 20px;
            background-color: #fdfbf7;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
        }
        .top-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1px dashed #cbd5e1;
            font-size: 9.5pt;
        }
        .top-nav a {
            color: #2b6cb0;
            text-decoration: none;
            font-weight: 600;
        }
        .top-nav a:hover {
            text-decoration: underline;
        }
        .case-header {
            background-color: #2c3e50;
            color: #ecf0f1;
            padding: 20px 24px;
            border-radius: 8px 8px 0 0;
            margin-bottom: 0;
        }
        .case-header h1 {
            color: #ffffff;
            margin: 0 0 10px 0;
            font-size: 18pt;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 3px solid #e74c3c;
            padding-bottom: 8px;
        }
        .case-header p {
            margin: 4px 0;
            font-size: 10pt;
            color: #bdc3c7;
        }
        .case-body {
            background-color: #fff;
            padding: 20px 24px;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e2e8f0;
            border-top: none;
        }
        .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0 20px 0;
            background: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        .meta-table td {
            padding: 8px 14px;
            font-size: 10.5pt;
        }
        .meta-label {
            font-weight: 600;
            color: #4a5568;
            width: 150px;
        }
        .meta-value {
            color: #2d3748;
            font-weight: 500;
        }
        .student-name-val {
            font-weight: 700;
            color: #2b6cb0;
            font-size: 11pt;
        }
        .story-context {
            font-style: italic;
            color: #4a5568;
            background-color: #fdfbf7;
            padding: 15px 18px;
            border-left: 4px solid #f1c40f;
            margin-bottom: 24px;
            border-radius: 0 6px 6px 0;
        }
        h2 {
            color: #2980b9;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 6px;
            margin-top: 28px;
            font-size: 13pt;
        }
        pre {
            background-color: #1e1e1e;
            color: #569cd6;
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
            font-family: 'Consolas', 'Courier New', Courier, monospace;
            font-size: 14px;
            line-height: 1.5;
        }
        .comment { color: #6a9955; }
        .instruction { color: #c586c0; font-weight: 600; }
        .register { color: #9cdcfe; }
        .number { color: #b5cea8; }
        .task-box {
            background-color: #e8f4f8;
            border: 1px solid #bce8f1;
            padding: 16px 20px;
            border-radius: 6px;
            margin-top: 15px;
            margin-bottom: 30px;
        }
        .task-title {
            font-weight: bold;
            color: #31708f;
            font-size: 1.05em;
            margin-bottom: 10px;
            display: block;
        }
        .instructions-card {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #dd6b20;
            border-radius: 4px;
            padding: 14px 16px;
            margin-bottom: 24px;
        }
        .instructions-title {
            font-size: 11pt;
            font-weight: 700;
            color: #c05621;
            margin: 0 0 10px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .instructions-list { margin: 0; padding-left: 20px; }
        .instructions-list li { margin-bottom: 6px; color: #4a5568; }
        .ai-warning { color: #c53030; font-weight: 600; }
        .footer-note {
            margin-top: 40px;
            font-size: 0.85em;
            color: #7f8c8d;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="top-nav">
        <a href="../../index.html">⬅️ Return to Student Dashboard</a>
    </div>

    <div class="case-header">
        <h1>${student.caseTitle}</h1>
        <p><strong>Subject:</strong> Digital Forensics &amp; Low-Level Architecture Investigation</p>
        <p><strong>Deadline:</strong> Thursday (Case Presentation)</p>
    </div>

    <div class="case-body">
        <table class="meta-table">
            <tr>
                <td class="meta-label">Student Name:</td>
                <td class="meta-value student-name student-name-val">${student.name}</td>
            </tr>
            <tr>
                <td class="meta-label">Course:</td>
                <td class="meta-value">Programming (Semester 1 - Week 4)</td>
            </tr>
            <tr>
                <td class="meta-label">Investigator ID:</td>
                <td class="meta-value">DET-${student.id.toUpperCase()}-2026</td>
            </tr>
        </table>

        <div class="instructions-card">
            <div class="instructions-title">Important Instructions for Detectives</div>
            <ul class="instructions-list">
                <li><strong>Language:</strong> All investigation reports and code justifications must be written entirely in English.</li>
                <li><strong>Ink Color Rule:</strong> Write your answers using any pen color except red.</li>
                <li class="ai-warning"><strong>AI Policy &amp; Anti-Cheating Warning:</strong> Maximum tolerance for AI-generated content is 15%. Work flagged above 15% will receive a grade of 0.</li>
                <li><strong>Handwritten Submission:</strong> Write your trace tables and assembly code clearly in your physical investigation notebook.</li>
            </ul>
        </div>

        <div class="story-context">
            <strong>Case Background:</strong><br>
            ${student.storyContext}
        </div>

        <!-- Part 1 -->
        <h2>Part 1: Tracing the Digital Footprint (ADD, SUB, MOV)</h2>
        <p>${student.part1Intro}</p>
        <pre><code>${student.part1Code}</code></pre>

        <div class="task-box">
            <span class="task-title">Task 1: Memory Tracing &amp; Architecture</span>
            <ol>
                <li>According to processor organization, classify the registers (AX, BX, CX, DX) used by the perpetrator based on their intended functions.</li>
                <li>Conduct a step-by-step memory trace. Write down the values of <code>AX</code>, <code>BX</code>, <code>CX</code>, and <code>DX</code> after <em>each</em> line of instruction executes. What is the final value stored in <code>DX</code>? (This value is the port number the perpetrator used to exfiltrate the data).</li>
            </ol>
        </div>

        <!-- Part 2 -->
        <h2>Part 2: The Logic Interrogation (CMP, JE, JNE, JMP)</h2>
        <p>${student.part2Intro}</p>
        <pre><code>${student.part2Code}</code></pre>

        <div class="task-box">
            <span class="task-title">Task 2: Branching Anomaly Analysis</span>
            <ol>
                <li>Identify and explain the severe logical flaw created by the perpetrator using the <code>JE</code>, <code>JNE</code>, and <code>JMP</code> instructions. How does this allow an unauthorized user to bypass the system and disable the alarm?</li>
                <li>Explain the concept of an "infinite loop" as seen in the <code>Malicious_Bypass</code> block. Why did the perpetrator intentionally trap the processor in this state instead of jumping to <code>End_Program</code>?</li>
            </ol>
        </div>

        <!-- Part 3 -->
        <h2>Part 3: Designing the New Security Protocol (Writing Assembly)</h2>
        <p>${student.part3Intro}</p>
        <ul>
            <li>The system utilizes two registers: <code>R1</code> (stores the correct PIN: <strong>${student.pin}</strong>) and <code>R2</code> (stores the user input PIN).</li>
            <li>You must compare <code>R2</code> with <code>R1</code>.</li>
            <li>If the PIN matches, the program must conditionally jump to a block named <code>${student.unlockBlock}</code>.</li>
            <li>If the PIN is incorrect, deduct 1 from register <code>R3</code> (which tracks remaining attempts, starting at ${student.maxAttempts}).</li>
            <li>After deducting an attempt, the program must jump unconditionally to a block named <code>${student.lockBlock}</code>.</li>
        </ul>

        <div class="task-box">
            <span class="task-title">Task 3: Assembly Implementation</span>
            Write the complete inline Assembly code to model the security system described above. You must include comments (using the <code>;</code> symbol) on every single line of your code to justify why that specific instruction was chosen based on the management's requirements.
        </div>

        <!-- Part 4 -->
        <h2>Part 4: Recovery System Sabotage (Compilation Lifecycle)</h2>
        <p>${student.part4Intro}</p>
        <p style="color: #c0392b; font-family: monospace; background: #fadbd8; padding: 10px; border-radius: 4px; border: 1px solid #f5b7b1;">${student.errorMsg}</p>

        <div class="task-box">
            <span class="task-title">Task 4: Compilation Diagnostics</span>
            <ol>
                <li>Management blames the Compiler for being corrupted by the hacker. Based on the compilation lifecycle, identify exactly which stage this error occurs in: is it the Compiler, the Parser, or the Linker?</li>
                <li>Provide a technical explanation for why this specific error appears in a multi-file project, and detail the steps you must take to resolve the missing reference.</li>
            </ol>
        </div>

        <div class="footer-note">
            <p><strong>Teacher's Note:</strong> This assignment integrates competency indicators B.IV.1.b (sequential instructions), B.IV.1.c (jumps/branching), C.IV.1.b (register classification), and C.IV.2.a (compiler and linker roles) from the Programming 26/27 RPS. The detective narrative structure utilizes causality, conflict, complications, and character to strengthen students' long-term memory retention.</p>
        </div>
    </div>
</div>

<script src="../../js/security.js"></script>
</body>
</html>`;
}

function buildHomework3() {
  const hw3Dir = path.join(__dirname, '..', 'homework', 'homework-3');
  if (!fs.existsSync(hw3Dir)) {
    fs.mkdirSync(hw3Dir, { recursive: true });
  }

  const packageManifest = [];

  STUDENTS.forEach(student => {
    const htmlContent = generateHomework3Html(student);
    const targetFile = path.join(hw3Dir, student.filename);
    fs.writeFileSync(targetFile, htmlContent, 'utf8');
    console.log(`✓ Generated Homework 3 file for ${student.name}: ${student.filename}`);

    packageManifest.push({
      file: student.filename,
      studentName: student.name,
      course: 'Programming (Semester 1)'
    });
  });

  // Write packages.json manifest for homework-3
  fs.writeFileSync(path.join(hw3Dir, 'packages.json'), JSON.stringify(packageManifest, null, 2), 'utf8');
  console.log('✓ Created packages.json manifest for Homework 3');
}

buildHomework3();
