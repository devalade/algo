# Semantic Rules

## Overview
Règles sémantiques et système de typage pour AlgoLang, garantissant la cohérence et la sécurité des programmes.

## Type System

### Type Hierarchy
```
Type
├── Primitive Types
│   ├── entier (Integer)
│   ├── réel (Real)
│   ├── booléen (Boolean)
│   ├── caractère (Character)
│   └── chaîne (String)
├── Composite Types
│   ├── tableau[T] (Array)
│   ├── liste[T] (List)
│   └── ensemble[T] (Set)
└── Procedure Types
    ├── procédure(params)
    └── fonction(params): return_type
```

### Type Compatibility Rules

#### Numeric Types
```algolang
// Implicit conversions (widening)
entier → réel  // Allowed

// Explicit conversions (narrowing)
réel → entier  // Requires cast: entier(valeur_réelle)

// Examples
x: entier := 5
y: réel := x        // OK: implicit conversion
z: entier := y      // Error: requires explicit cast
z := entier(y)      // OK: explicit conversion
```

#### Boolean Operations
```algolang
// Only boolean operands allowed
condition1: booléen := vrai
condition2: booléen := faux
résultat: booléen := condition1 et condition2  // OK

// Invalid: mixing types
// résultat := (5 > 3) et "bonjour"  // Error: type mismatch
```

#### String Operations
```algolang
// Concatenation
nom: chaîne := "Alice"
message: chaîne := "Bonjour, " + nom  // OK

// String comparison
si message = "Bonjour, Alice" alors  // OK
  écrire "Message identique"
fin si
```

## Variable Declaration Rules

### Declaration Before Use
```algolang
// Valid
x: entier
x := 10

// Invalid
y := 20  // Error: y not declared
y: entier
```

### Initialization Requirements
```algolang
// Automatic initialization
compteur: entier  // Initialized to 0
valide: booléen   // Initialized to faux
texte: chaîne     // Initialized to ""

// Explicit initialization preferred
total: entier := 0
```

### Scope Rules
```algnf
programme TestScope
  variables
    globale: entier := 100
  fin variables
  
  procédure maProcédure()
    variables
      locale: entier := 50
    fin variables
    
    // globale accessible here
    écrire globale  // OK: 100
    écrire locale   // OK: 50
  fin procédure
  
début
  écrire globale  // OK: 100
  // écrire locale  // Error: locale not in scope
fin programme
```

## Expression Type Rules

### Arithmetic Operations
```algolang
// Same type operations
a: entier := 5 + 3        // Result: entier
b: réel := 3.14 + 2.71    // Result: réel

// Mixed type operations
c: réel := 5 + 3.14       // Result: réel (integer promoted)
d: entier := entier(5.14) + 3  // Explicit cast required
```

### Comparison Operations
```algolang
// Valid comparisons
5 = 5           // booléen: vrai
3.14 > 2.71     // booléen: vrai
"a" < "b"       // booléen: vrai (lexicographic)

// Type compatibility
5 = 5.0         // OK: integer compared to real
"a" = 97        // Error: string compared to integer
```

### Logical Operations
```algolang
// Only boolean operands
(vrai et faux)          // booléen: faux
(non (5 > 3))           // booléen: faux
((3 < 5) ou (10 > 20))  // booléen: vrai
```

## Function and Procedure Rules

### Parameter Type Checking
```algolang
// Function definition
fonction calculerSomme(a: entier, b: entier): entier
  retourner a + b
fin fonction

// Valid calls
résultat1: entier := calculerSomme(5, 3)        // OK
résultat2: entier := calculerSomme(5, entier(3.14))  // OK with cast

// Invalid calls
// résultat3 := calculerSomme(5, 3.14)        // Error: type mismatch
// résultat4 := calculerSomme("5", 3)        // Error: type mismatch
```

### Return Type Validation
```algolang
// Function with return type
fonction obtenirValeur(): entier
  variables
    temp: entier := 42
  fin variables
  retourner temp  // OK: temp is entier
fin fonction

// Invalid return
fonction erreurType(): chaîne
  retourner 123  // Error: integer returned instead of string
fin fonction
```

## Array and Collection Rules

### Array Index Validation
```algolang
notes: tableau[10] de réel

// Valid indexing
notes[1] := 15.5    // OK: index in range
notes[10] := 18.0   // OK: last element

// Invalid indexing
// notes[0] := 12.0   // Error: index out of bounds (1-based)
// notes[11] := 20.0  // Error: index out of bounds
// notes["un"] := 15.0 // Error: non-integer index
```

### Type Consistency in Collections
```algolang
// Valid: consistent types
nombres: liste d'entier
nombres.ajouter(5)
nombres.ajouter(10)

// Invalid: mixed types
// nombres.ajouter("bonjour")  // Error: string in integer list
```

## Type Inference Rules

### Limited Type Inference
```algolang
// Some inference allowed
x := 5           // Inferred as entier
y := 3.14        // Inferred as réel
z := "bonjour"   // Inferred as chaîne

// Explicit declaration preferred for clarity
// x: entier := 5  // Better practice
```

## Dependencies
- algolang-specification.md (définition du langage)
- grammar-formal.md (structure syntaxique)

## Error Categories
1. **Type Mismatch**: Opération entre types incompatibles
2. **Undeclared Variable**: Utilisation sans déclaration
3. **Scope Violation**: Accès hors portée
4. **Array Bounds**: Index hors limites
5. **Return Type**: Type de retour incorrect

## Educational Benefits
- Détection précoce des erreurs
- Compréhension des types de données
- Apprentissage de la rigueur sémantique
- Transition facile vers langages typés