# AlgoLang Specification

## Overview
AlgoLang est un langage de programmation éducatif conçu pour l'enseignement de l'algorithmique, inspiré de Pascal mais simplifié pour l'apprentissage.

## Language Philosophy
- **Pédagogie avant performance**: Syntaxe claire et messages d'erreur explicatifs
- **Progressivité**: Concepts introduits progressivement
- **Sécurité**: Pas de pointeurs, gestion mémoire automatique
- **Algorithmique pure**: Focus sur les structures de données et algorithmes

## Core Features

### Types de Données
```algolang
// Types primitifs
entier: integer
réel: real
booléen: boolean
caractère: character
chaîne: string

// Types structurés
tableau[T]: array[T]
liste[T]: list[T]
ensemble[T]: set[T]
```

### Structure de Programme
```algolang
programme NomProgramme
  // Déclarations globales
  variables
    x: entier
    y: réel
  fin variables
  
  // Procédures et fonctions
  procédure Calculer()
    // Corps de procédure
  fin procédure
  
  // Programme principal
début
  // Instructions principales
fin programme
```

## Language Characteristics

### Syntaxe Française
- Mots-clés en français pour accessibilité
- Indentation non-significative
- Délimiteurs explicites (début/fin, si/alors/sinon)

### Typage Statique Fort
- Vérification des types à la compilation
- Conversions explicites requises
- Inférence de type limitée

### Structures de Contrôle
```algolang
si condition alors
  // instructions
sinon si autre_condition alors
  // instructions
sinon
  // instructions
fin si

tant que condition faire
  // instructions
fin tant que

pour i de 1 à 10 faire
  // instructions
fin pour
```

## Memory Model
- Variables automatiquement initialisées
- Gestion mémoire par le runtime
- Pas d'allocation manuelle
- Garbage collection intégré

## Error Handling Philosophy
- Messages d'erreur en français
- Suggestions de correction
- Contexte d'erreur détaillé
- Mode apprentissage avec indices progressifs

## Dependencies
- syntax-reference.md (détails syntaxiques)
- grammar-formal.md (définition formelle)
- semantic-rules.md (règles sémantiques)

## Educational Goals
1. Compréhension des concepts algorithmiques fondamentaux
2. Apprentissage progressif de la programmation structurée
3. Développement de la pensée logique
4. Transition facile vers d'autres langages

## Target Audience
- Étudiants débutants en programmation (lycée, université)
- Formation professionnelle en informatique
- Auto-apprentissage de l'algorithmique