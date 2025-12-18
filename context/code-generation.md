# Code Generation

## Overview
Processus de génération de code transformant l'AST AlgoLang en code machine exécutable avec optimisations adaptées à l'apprentissage.

## Target Architecture

### Platform Specification
```yaml
target_platform:
  architecture: x86_64
  operating_system: Linux/Windows/macOS
  calling_convention: System V AMD64 (Linux/macOS), Microsoft x64 (Windows)
  instruction_set: x86-64 with SSE2
  register_set:
    general: [RAX, RBX, RCX, RDX, RSI, RDI, R8-R15]
    floating_point: [XMM0-XMM15]
    stack: [RSP, RBP]
```

### Memory Layout
```yaml
memory_layout:
  text_segment: 0x400000  # Code
  data_segment: 0x600000  # Initialized data
  bss_segment: 0x601000   # Uninitialized data
  stack_segment: 0x7ffffff # Runtime stack
  heap_segment: 0x200000  # Dynamic allocation
```

## Intermediate Representation

### Three-Address Code (TAC)
```yaml
# Example: Calcul de moyenne
source:
  somme := 0
  pour i de 1 à 5 faire
    somme := somme + notes[i]
  fin pour
  moyenne := somme / 5

tac_representation:
  - temp1 := 0
  somme := temp1
  i := 1
label_L1:
  if i > 5 goto label_L2
  temp2 := notes + (i - 1) * 8  # Array indexing
  temp3 := *temp2                # Array access
  temp4 := somme + temp3
  somme := temp4
  temp5 := i + 1
  i := temp5
  goto label_L1
label_L2:
  temp6 := 5.0
  temp7 := somme / temp6
  moyenne := temp7
```

### Control Flow Graph
```yaml
cfg_nodes:
  - id: entry
    type: basic_block
    instructions: [temp1 := 0, somme := temp1, i := 1]
    successors: [loop_check]
  
  - id: loop_check
    type: basic_block
    instructions: [if i > 5 goto loop_end]
    successors: [loop_body, loop_end]
  
  - id: loop_body
    type: basic_block
    instructions: [temp2 := notes + (i - 1) * 8, temp3 := *temp2, 
                   temp4 := somme + temp3, somme := temp4, 
                   temp5 := i + 1, i := temp5]
    successors: [loop_check]
  
  - id: loop_end
    type: basic_block
    instructions: [temp6 := 5.0, temp7 := somme / temp6, moyenne := temp7]
    successors: [exit]
```

## Register Allocation

### Graph Coloring Algorithm
```python
class RegisterAllocator:
    def __init__(self, interference_graph):
        self.graph = interference_graph
        self.registers = ['RAX', 'RBX', 'RCX', 'RDX', 'RSI', 'RDI', 'R8', 'R9']
        self.colors = {}
    
    def allocate_registers(self):
        # Simplify graph
        stack = self.simplify()
        
        # Select registers
        while stack:
            node = stack.pop()
            available = self.get_available_registers(node)
            if available:
                self.colors[node] = available[0]
            else:
                # Spill to memory
                self.spill_to_memory(node)
        
        return self.colors
```

### Allocation Example
```yaml
variables:
  somme: RAX
  i: RBX
  temp2: RCX
  temp3: RDX
  temp4: RSI
  temp5: RDI
  temp6: XMM0
  temp7: XMM1

spilled_variables:
  notes: memory  # Array stored in memory
  moyenne: R8    # Final result in register
```

## Assembly Code Generation

### Function Prologue/Epilogue
```assembly
; Function prologue
function_start:
  push rbp           ; Save old base pointer
  mov rbp, rsp       ; Set new base pointer
  sub rsp, 32        ; Allocate stack space for locals
  
  ; Function body here
  
  ; Function epilogue
  mov rsp, rbp       ; Restore stack pointer
  pop rbp            ; Restore base pointer
  ret                ; Return to caller
```

### Variable Access
```assembly
; Local variable access
mov qword [rbp-8], rax    ; Store RAX in local variable at [rbp-8]
mov rbx, qword [rbp-8]    ; Load local variable into RBX

; Global variable access
mov rax, [rel somme]       ; Load global variable
mov [rel somme], rbx       ; Store to global variable

; Array access
mov rcx, i                 ; Load index
mov rdx, 8                 ; Element size
mul rcx, rdx               ; Calculate offset
mov rsi, [rel notes]       ; Load array base
add rsi, rcx               ; Calculate address
mov rax, [rsi]             ; Load array element
```

### Control Structures
```assembly
; If statement
cmp eax, ebx
jle else_label
; Then block
mov ecx, 1
jmp end_if
else_label:
; Else block
mov ecx, 0
end_if:

; While loop
while_start:
cmp eax, 10
jge while_end
; Loop body
inc eax
jmp while_start
while_end:

; For loop
mov ecx, 1                 ; i := 1
for_start:
cmp ecx, 10
jg for_end
; Loop body
inc ecx
jmp for_start
for_end:
```

### Arithmetic Operations
```assembly
; Integer operations
add rax, rbx              ; rax := rax + rbx
sub rax, rbx              ; rax := rax - rbx
imul rax, rbx             ; rax := rax * rbx
idiv rbx                  ; rax := rax / rbx (signed)

; Floating point operations
movsd xmm0, [rel x]       ; Load x into XMM0
movsd xmm1, [rel y]       ; Load y into XMM1
addsd xmm0, xmm1          ; xmm0 := xmm0 + xmm1
mulsd xmm0, xmm1          ; xmm0 := xmm0 * xmm1
divsd xmm0, xmm1          ; xmm0 := xmm0 / xmm1
```

## Optimization Strategies

### Local Optimizations
```yaml
optimizations:
  constant_folding:
    before: "temp := 5 + 3"
    after: "temp := 8"
  
  constant_propagation:
    before: "x := 5; y := x + 2"
    after: "x := 5; y := 7"
  
  dead_code_elimination:
    before: "temp := 5; x := 10"
    after: "x := 10"  # temp never used
  
  strength_reduction:
    before: "temp := i * 2"
    after: "temp := i << 1"
```

### Loop Optimizations
```yaml
loop_optimizations:
  induction_variable:
    before: "for i := 1 to 10 do a[i] := i * 4"
    after: "temp := 4; for i := 1 to 10 do a[i] := temp; temp := temp + 4"
  
  loop_unrolling:
    before: "for i := 1 to 4 do sum := sum + a[i]"
    after: "sum := sum + a[1] + a[2] + a[3] + a[4]"
  
  invariant_code_motion:
    before: "for i := 1 to n do x := a + b * c"
    after: "temp := b * c; for i := 1 to n do x := a + temp"
```

## Runtime System

### Memory Management
```c
// Runtime memory management
typedef struct {
    void* heap_start;
    void* heap_end;
    size_t heap_size;
} HeapManager;

void* alloc_memory(size_t size) {
    // Simple bump allocator for educational purposes
    if (heap_manager.heap_end + size > heap_manager.heap_start + heap_manager.heap_size) {
        runtime_error("Mémoire insuffisante");
    }
    void* ptr = heap_manager.heap_end;
    heap_manager.heap_end += size;
    return ptr;
}
```

### Error Handling
```c
// Runtime error handling
void runtime_error(const char* message) {
    fprintf(stderr, "Erreur d'exécution: %s\n", message);
    fprintf(stderr, "Position: ligne %d, colonne %d\n", current_line, current_column);
    exit(1);
}

void array_bounds_check(int index, int size) {
    if (index < 1 || index > size) {
        runtime_error("Index de tableau hors limites");
    }
}
```

### Standard Library Functions
```c
// Input/Output functions
void algo_read_string(char* buffer, int max_length) {
    if (fgets(buffer, max_length, stdin) == NULL) {
        runtime_error("Erreur de lecture");
    }
    // Remove newline
    buffer[strcspn(buffer, "\n")] = 0;
}

void algo_write_string(const char* string) {
    printf("%s", string);
}

void algo_write_integer(int value) {
    printf("%d", value);
}

void algo_write_real(double value) {
    printf("%.6f", value);
}
```

## Dependencies
- compilation-pipeline.md (pipeline global)
- syntax-analysis.md (AST en entrée)
- semantic-rules.md (informations de typage)
- performance-benchmarks.md (critères de performance)

## Educational Features

### Code Annotation
```yaml
annotations:
  variable_tracking:
    - Show variable values at each step
    - Highlight register assignments
    - Display memory layout
  
  optimization_explanation:
    - Show before/after optimization
    - Explain why optimization is beneficial
    - Demonstrate performance impact
  
  assembly_comments:
    - Add educational comments to generated code
    - Explain each instruction's purpose
    - Show correspondence with source code
```

### Debug Information
```yaml
debug_info:
  source_mapping:
    - Map assembly instructions to source lines
    - Enable stepping through source code
    - Show variable values in debugger
  
  symbol_table:
    - Include variable names in executable
    - Enable symbolic debugging
    - Support for breakpoints
```

## Performance Metrics

### Generation Speed
```yaml
performance:
  compilation_time: < 500ms for typical programs
  code_size: 2-3x source size (reasonable for educational use)
  execution_speed: 70-80% of optimized C code
  memory_usage: < 100MB during compilation
```

### Code Quality
```yaml
quality_metrics:
  instruction_count: Optimized within educational constraints
  register_usage: Efficient allocation with minimal spills
  branch_prediction: Optimized for common patterns
  cache_locality: Good spatial and temporal locality
```

## Testing Framework

### Test Cases
```yaml
test_categories:
  simple_programs:
    - hello_world
    - variable_operations
    - basic_io
    - simple_loops
  
  complex_programs:
    - recursive_functions
    - array_operations
    - string_processing
    - mathematical_calculations
  
  optimization_tests:
    - constant_folding
    - dead_code_elimination
    - loop_optimizations
    - register_allocation
  
  error_cases:
    - division_by_zero
    - array_bounds
    - stack_overflow
    - memory_exhaustion
```