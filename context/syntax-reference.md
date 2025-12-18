# Syntax Reference

## Overview
Référence complète de la syntaxe AlgoLang avec exemples pratiques pour chaque construction.

## Lexical Elements

### Identifiers
```algolang
// Valid identifiers
nomVariable
calculerSomme
valeur_max
compteur1

// Invalid identifiers
1variable    // starts with digit
nom-variable // contains hyphen
nom variable // contains space
```

### Keywords (Mots-clés)
```algolang
programme, variables, début, fin, si, alors, sinon, tant que, faire, pour, de, à
procédure, fonction, retourner, entier, réel, booléen, caractère, chaîne
tableau, liste, ensemble, et, ou, non, vrai, faux, lire, écrire
```

### Operators
```algolang
// Arithmetic: +, -, *, /, %, ^
// Comparison: =, ≠, <, ≤, >, ≥
// Logical: et, ou, non
// Assignment: :=
```

## Data Types Syntax

### Primitive Types
```algolang
// Variable declarations
âge: entier
prix: réel
valide: booléen
initiale: caractère
nom: chaîne

// Constants
PI := 3.14159
MAX_ETUDIANTS := 30
```

### Composite Types
```algolang
// Arrays
notes: tableau[10] de réel
matrice: tableau[3][4] de entier

// Lists
étudiants: liste de chaîne
nombres: liste d'entier

// Sets
voyelles: ensemble de caractère
premiers: ensemble d'entier
```

## Control Structures

### Conditional Statements
```algolang
// Simple if
si âge >= 18 alors
  écrire "Majeur"
fin si

// If-else
si note >= 10 alors
  écrire "Admis"
sinon
  écrire "Ajourné"
fin si

// Nested conditions
si température > 30 alors
  si humidité > 70 alors
    écrire "Chaud et humide"
  sinon
    écrire "Chaud et sec"
  fin si
fin si
```

### Loops
```algolang
// While loop
compteur := 0
tant que compteur < 10 faire
  écrire compteur
  compteur := compteur + 1
fin tant que

// For loop
pour i de 1 à 10 faire
  écrire i * 2
fin pour

// For with step
pour i de 0 à 100 pas 10 faire
  écrire i
fin pour
```

## Functions and Procedures

### Procedure Definition
```algolang
procédure afficherBonjour(nom: chaîne)
  écrire "Bonjour, " + nom
fin procédure
```

### Function Definition
```algolang
fonction calculerAire(longueur: réel, largeur: réel): réel
  retourner longueur * largeur
fin fonction
```

### Parameter Passing
```algolang
// By value (default)
procédure incrémenter(x: entier)
  x := x + 1  // local copy only
fin procédure

// By reference
procédure échanger(var a: entier, var b: entier)
  temp := a
  a := b
  b := temp
fin procédure
```

## Input/Output

### Input Operations
```algolang
// Read single value
lire âge

// Read with prompt
écrire "Entrez votre nom: "
lire nom

// Read into array
pour i de 1 à 5 faire
  lire notes[i]
fin pour
```

### Output Operations
```algolang
// Simple output
écrire "Hello World"

// With variables
écrire "Votre âge: " + âge

// Formatted output
écrire "Note: %.2f", note
```

## Comments
```algolang
// Single line comment

/* 
   Multi-line comment
   spanning multiple lines
*/

// Educational comment
// Cette boucle calcule la somme des N premiers entiers
```

## Dependencies
- algolang-specification.md (concepts du langage)
- grammar-formal.md (structure formelle)

## Common Patterns
- Déclaration avant utilisation
- Indentation pour lisibilité (non obligatoire)
- Noms explicites en français
- Commentaires pédagogiques recommandés