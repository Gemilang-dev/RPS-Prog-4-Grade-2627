# Cambridge A-Level Computer Science: Unconditional Jumps (JMP)

## 1. Introduction to Program Flow
In the von Neumann architecture, the **Program Counter (PC)** holds the memory address of the next instruction to be fetched and executed. By default, the PC increments sequentially. However, to build complex logic (like loops and subroutines), we must manipulate the PC directly.

## 2. The Unconditional Jump (JMP)
An unconditional jump instruction forces the Program Counter to jump to a specific memory address, completely bypassing the sequential execution order. Unlike conditional jumps (e.g., `JE`, `JNE`), a `JMP` instruction does not evaluate the status of the CPU Flags (such as the Zero Flag or Carry Flag) before executing.

**Syntax:**
```assembly
JMP <label/address>
```

### 2.1 Execution Mechanics at the CPU Level
When the CPU decodes a `JMP` instruction:
1. The operand (the target address or label) is fetched.
2. The ALU is generally bypassed.
3. The Control Unit overwrites the Program Counter (PC) with the target address.
4. The fetch-execute cycle restarts from the newly assigned address.

## 3. Practical Applications

### 3.1 Creating Infinite Loops
Unconditional jumps are often used to create infinite loops, which are critical in low-level system polling, embedded systems, or main game loops.

```assembly
main_loop:
    MOV AX, 1       ; Execute some logic
    ADD BX, AX
    
    JMP main_loop   ; Jump back to the start of the loop unconditionally
```

### 3.2 Bypassing Code Blocks
`JMP` is frequently used in conjunction with conditional jumps to skip over alternative logic paths, similar to the `else` block in high-level languages.

```assembly
    CMP CX, 5
    JE  is_equal      ; Conditional jump: if CX == 5, jump to 'is_equal'
    
    ; If not equal, execute this block
    MOV DX, 0
    JMP end_block     ; Unconditional jump to skip the 'is_equal' block
    
is_equal:
    MOV DX, 1
    
end_block:
    ; Execution continues here
```

## 4. Performance Implications in Modern CPUs
While `JMP` is fundamental, frequent jumping disrupts the **Instruction Pipeline**. 
Modern processors pre-fetch instructions sequentially. An unconditional jump causes a **Pipeline Flush** because the pre-fetched sequential instructions are no longer valid. To mitigate performance drops, modern CPUs rely heavily on **Branch Target Predictors** in their cache architecture.

## 5. Summary
* **JMP** forcefully alters the Program Counter.
* It does **not** rely on the CPU's Status Register/Flags.
* Commonly used for infinite loops, `switch` statement implementations, and skipping mutually exclusive code blocks.
* Can cause pipeline flushes, impacting execution speed on deep-pipeline architectures.
