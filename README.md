# AlgoLang - Compilateur Éducatif

AlgoLang est un langage de programmation éducatif conçu pour apprendre l'algorithmique avec une syntaxe française intuitive.

## 🚀 Installation

```bash
bun install
```

## 📖 Guide d'apprentissage par l'exemple

Ce guide est conçu pour vous aider à maîtriser AlgoLang pas à pas.

### Niveau 1 : Les Bases (Bonjour Monde)
Apprenez à structurer un programme et à afficher du texte.

```algo
programme BonjourMonde;
var
  message: chaine;
debut
  message := "Bonjour, bienvenue dans l'apprentissage de l'algorithmique !";
  ecrire(message);
fin.
```

### Niveau 2 : Variables et Calculs
Manipulez des nombres et effectuez des opérations arithmétiques.

```algo
programme CalculSimple;
var
  nombre1, nombre2, resultat: entier;
debut
  nombre1 := 15;
  nombre2 := 10;
  resultat := (nombre1 + nombre2) * 2;
  ecrire("Le résultat de (15 + 10) * 2 est : ", resultat);
fin.
```

### Niveau 3 : Conditions (Si/Sinon)
Apprenez à prendre des décisions dans votre code.

```algo
programme VerifAge;
var
  age: entier;
debut
  ecrire("Entrez votre âge : ");
  lire(age);
  
  si age >= 18 alors
    ecrire("Vous êtes majeur.");
  sinon
    ecrire("Vous êtes mineur.");
  finsi;
fin.
```

### Niveau 4 : Boucles (Répétition)
Automatisez des tâches répétitives avec `pour` et `tantque`.

```algo
programme TableMultiplication;
var
  i, nombre: entier;
debut
  nombre := 7;
  ecrire("Table de ", nombre, " :");
  
  pour i := 1 à 10 faire
    ecrire(i, " x ", nombre, " = ", i * nombre);
  finpour;
fin.
```

---

## 🛠 Utilisation (CLI)

### Compiler et Exécuter
Le moyen le plus simple de tester votre code :

```bash
# Compiler et exécuter directement
bun run src/cli.ts run side-panel.algo
```

### Compiler vers JavaScript
Si vous voulez voir le code JavaScript généré :

```bash
bun run src/cli.ts compile examples/bonjour.algo -o output.js
```

### Vérifier la Syntaxe
Utile pour trouver des erreurs sans exécuter le code :

```bash
bun run src/cli.ts check examples/calculatrice.algo --verbose
```

---

## 📝 Référence de Syntaxe

### Types de données
- `entier` : Nombres entiers (ex: 10, -5)
- `reel` : Nombres à virgule (ex: 3.14)
- `chaine` : Texte (ex: "Bonjour")
- `booleen` : Logique (`vrai` ou `faux`)

### Opérateurs
| Type | Opérateurs |
| :--- | :--- |
| **Calcul** | `+`, `-`, `*`, `/` |
| **Comparaison** | `=`, `<>`, `<`, `<=`, `>`, `>=` |
| **Logique** | `et`, `ou`, `non` |

### Mots-clés réservés
Ne les utilisez pas comme noms de variables !
`programme`, `debut`, `fin`, `var`, `si`, `alors`, `sinon`, `finsi`, `tantque`, `faire`, `pour`, `à`, `finpour`, `repeter`, `jusqu'à`, `lire`, `ecrire`.

---

## ✨ Fonctionnalités Pédagogiques

- **Messages en Français** : Toutes les erreurs et suggestions sont dans votre langue.
- **Mode Pédagogique** : Le code JavaScript généré contient des commentaires expliquant chaque étape.
- **Gestion Stricte** : Empêche l'utilisation de mots-clés réservés avec des suggestions de correction.

---

## 📁 Structure du Projet

```text
.
├── src/                    # Code source du compilateur
│   ├── cli.ts              # Interface en ligne de commande (CLI)
│   ├── compiler.ts         # Orchestrateur (Lexer -> Parser -> Codegen)
│   ├── lexer/              # Analyse lexicale (découpage en jetons)
│   ├── parser/             # Analyse syntaxique (génération de l'AST)
│   ├── codegen/            # Génération de code JavaScript
│   └── types/              # Définitions des types et structures de l'AST
├── examples/               # Programmes d'exemple (.algo)
│   ├── bonjour.algo        # Niveau 1 : Bases
│   ├── calculatrice.algo   # Niveau 2 : Variables
│   └── ...                 # Autres exemples (boucles, conditions)
├── tests/                  # Suite de tests complète
│   ├── lexer.test.ts       # Tests unitaires du Lexer
│   ├── parser.test.ts      # Tests unitaires du Parser
│   ├── codegen.test.ts     # Tests de génération de code
│   └── regression.test.ts  # Tests de bout en bout
├── package.json            # Dépendances (Bun)
└── README.md               # Cette documentation
```