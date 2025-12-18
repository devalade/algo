# Compilation Pipeline

## Overview
Pipeline complet de compilation AlgoLang transformant le code source en exécutable binaire avec support pédagogique intégré.

## Pipeline Architecture
```
Source Code (.algo)
       ↓
   Lexical Analysis
       ↓
   Syntax Analysis
       ↓
   Semantic Analysis
       ↓
   Intermediate Code Generation
       ↓
   Optimization
       ↓
   Code Generation
       ↓
   Binary Output (.exe)
```

## Phase 1: Lexical Analysis

### Input Processing
```algolang
// Source code example
programme CalculMoyenne
  variables
    notes: tableau[5] de réel
    somme: réel
    moyenne: réel
  fin variables
début
  somme := 0
  pour i de 1 à 5 faire
    lire notes[i]
    somme := somme + notes[i]
  fin pour
  moyenne := somme / 5
  écrire "Moyenne: " + moyenne
fin programme
```

### Token Generation
```yaml
tokens:
  - type: KEYWORD, value: "programme", line: 1, col: 1
  - type: IDENTIFIER, value: "CalculMoyenne", line: 1, col: 11
  - type: KEYWORD, value: "variables", line: 2, col: 3
  - type: IDENTIFIER, value: "notes", line: 3, col: 5
  - type: OPERATOR, value: ":", line: 3, col: 10
  - type: KEYWORD, value: "tableau", line: 3, col: 12
  # ... more tokens
```

### Error Detection
- Caractères invalides
- Mots-clés mal orthographiés
- Nombres mal formés
- Chaînes non fermées

## Phase 2: Syntax Analysis

### Parse Tree Construction
```yaml
parse_tree:
  program:
    header: "programme CalculMoyenne"
    declarations:
      variables:
        - name: "notes", type: "tableau[5] de réel"
        - name: "somme", type: "réel"
        - name: "moyenne", type: "réel"
    main_block:
      statements:
        - assignment: "somme := 0"
        - for_loop:
            variable: "i"
            range: "1 à 5"
            body:
              - read: "notes[i]"
              - assignment: "somme := somme + notes[i]"
        - assignment: "moyenne := somme / 5"
        - write: "\"Moyenne: \" + moyenne"
```

### Syntax Validation
- Vérification de la grammaire BNF
- Équilibre des délimiteurs
- Structure des blocs
- Ordre des déclarations

## Phase 3: Semantic Analysis

### Symbol Table Construction
```yaml
symbol_table:
  global_scope:
    variables:
      notes:
        type: "tableau[5] de réel"
        size: 5
        address: 0x1000
      somme:
        type: "réel"
        address: 0x1040
      moyenne:
        type: "réel"
        address: 0x1048
    functions: {}
```

### Type Checking
```yaml
type_checks:
  - expression: "somme := 0"
    left_type: "réel"
    right_type: "entier"
    conversion: "entier → réel"
    status: "valid"
  
  - expression: "somme / 5"
    left_type: "réel"
    right_type: "entier"
    conversion: "entier → réel"
    status: "valid"
```

### Semantic Errors
- Variables non déclarées
- Incompatibilités de types
- Portée incorrecte
- Fonctions non définies

## Phase 4: Intermediate Code Generation

### Three-Address Code
```yaml
intermediate_code:
  - temp1 := 0.0
  somme := temp1
  i := 1
label_L1:
  if i > 5 goto label_L2
  read notes[i]
  temp2 := somme + notes[i]
  somme := temp2
  i := i + 1
  goto label_L1
label_L2:
  temp3 := somme / 5.0
  moyenne := temp3
  write "Moyenne: "
  write moyenne
```

### Optimization Opportunities
- Propagation de constantes
- Élimination de code mort
- Simplification d'expressions
- Boucles optimisées

## Phase 5: Optimization

### Local Optimizations
```yaml
optimizations:
  before:
    - temp1 := 0.0
    - somme := temp1
  after:
    - somme := 0.0  // Direct assignment
  
  before:
    - i := i + 1
    - temp := i * 2
    - array[temp]
  after:
    - array[i * 2]  // Strength reduction
```

### Loop Optimizations
- Induction variable analysis
- Loop unrolling (small loops)
- Invariant code motion

## Phase 6: Code Generation

### Target Architecture
```yaml
target:
  architecture: "x86_64"
  calling_convention: "System V AMD64"
  register_allocation:
    - RAX: return value
    - RDI: first argument
    - RSI: second argument
    - RDX: third argument
```

### Assembly Output
```assembly
; Generated assembly for CalculMoyenne
section .data
  format_str: db "Moyenne: %f", 10, 0

section .bss
  notes: resq 5
  somme: resq 1
  moyenne: resq 1

section .text
global main

main:
  ; somme := 0
  mov qword [somme], 0
  
  ; Loop initialization
  mov rcx, 1
  
loop_start:
  cmp rcx, 5
  jg loop_end
  
  ; Read notes[i]
  ; (System call for input)
  
  ; somme := somme + notes[i]
  mov rax, [somme]
  add rax, [notes + rcx*8 - 8]
  mov [somme], rax
  
  inc rcx
  jmp loop_start
  
loop_end:
  ; moyenne := somme / 5
  mov rax, [somme]
  cvtsi2sd xmm0, rax
  movsd xmm1, [five_double]
  divsd xmm0, xmm1
  movsd [moyenne], xmm0
  
  ; Print result
  mov rdi, format_str
  movsd xmm0, [moyenne]
  mov al, 1
  call printf
  
  ret
```

## Error Handling Integration

### Educational Error Messages
```yaml
error_examples:
  syntax_error:
    line: 5
    column: 10
    message: "Erreur de syntaxe: ':' attendu après le nom de variable"
    suggestion: "Ajoutez ':' après 'notes' pour spécifier le type"
    context: "notes tableau[5] de réel"
            "      ^"
  
  type_error:
    line: 12
    message: "Erreur de type: Impossible d'ajouter un entier à une chaîne"
    suggestion: "Convertissez l'entier en chaîne avec chaîne(valeur)"
    context: "message := \"Total: \" + total"
```

## Dependencies
- lexical-analysis.md (détails phase 1)
- syntax-analysis.md (détails phase 2)
- code-generation.md (détails phase 6)
- error-handling-standards.md (gestion des erreurs)

## Performance Metrics
- Compilation speed: < 1s pour programmes < 1000 lignes
- Memory usage: < 50MB pour compilation typique
- Generated code efficiency: 80-90% de code C optimisé

## Educational Features
- Affichage étape par étape du processus
- Visualisation de l'arbre syntaxique
- Messages d'erreur explicatifs
- Mode débogage avec points d'arrêt virtuels