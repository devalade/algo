# AlgoLang - Compilateur Éducatif

AlgoLang est un langage de programmation éducatif conçu pour apprendre l'algorithmique avec une syntaxe française intuitive.

## ⚡ Démarrage Rapide

**1. Installer AlgoLang**
```bash
# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/devalade/algo/main/install.sh | bash

# Windows (PowerShell)
irm https://raw.githubusercontent.com/devalade/algo/main/install.ps1 | iex
```

**2. Créer votre premier programme** (`bonjour.algo`)
```algo
programme Bonjour;
debut
  ecrire("Bonjour le monde !");
fin.
```

**3. Exécuter**
```bash
algolang run bonjour.algo
```

---

## 🚀 Installation

### Installation rapide (Binaire pré-compilé)

#### Linux / macOS
```bash
curl -fsSL https://raw.githubusercontent.com/devalade/algo/main/install.sh | bash
```

#### Windows (PowerShell)
```powershell
irm https://raw.githubusercontent.com/devalade/algo/main/install.ps1 | iex
```

### Plateformes supportées

| Système d'exploitation | Architecture | Binaire |
|------------------------|--------------|---------|
| Linux | x86_64 (amd64) | `algolang-linux-amd64` |
| Linux | ARM64 | `algolang-linux-arm64` |
| macOS | Intel (x86_64) | `algolang-darwin-amd64` |
| macOS | Apple Silicon (ARM64) | `algolang-darwin-arm64` |
| Windows | x86_64 (amd64) | `algolang-windows-amd64.exe` |

### Compilation depuis les sources

Si vous préférez compiler depuis les sources ou contribuer au projet :

```bash
# Cloner le dépôt
git clone https://github.com/devalade/algo.git
cd algo

# Installer les dépendances (nécessite Bun)
bun install

# Compiler pour votre plateforme
bun run compile:linux        # Linux x86_64
bun run compile:linux-arm64  # Linux ARM64
bun run compile:darwin       # macOS Intel
bun run compile:darwin-arm64 # macOS Apple Silicon
bun run compile:windows      # Windows x86_64

# Ou compiler pour toutes les plateformes
bun run compile:all

# Le binaire sera créé dans le répertoire racine
```

### Désinstallation

#### Linux / macOS
```bash
# Si installé dans /usr/local/bin
sudo rm /usr/local/bin/algolang

# Si installé dans ~/.local/bin
rm ~/.local/bin/algolang
```

#### Windows
```powershell
# Supprimer le binaire
Remove-Item "$env:LOCALAPPDATA\AlgoLang" -Recurse

# Retirer du PATH (manuel)
# Ouvrez "Modifier les variables d'environnement système"
# et supprimez l'entrée AlgoLang du PATH utilisateur
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
algolang run side-panel.algo
```

### Compiler vers JavaScript
Si vous voulez voir le code JavaScript généré :

```bash
algolang compile examples/bonjour.algo -o output.js
```

### Vérifier la Syntaxe
Utile pour trouver des erreurs sans exécuter le code :

```bash
algolang check examples/calculatrice.algo --verbose
```

### Initialiser un nouveau projet
Créer un nouveau programme AlgoLang avec un modèle de base :

```bash
algolang init mon-programme
```

### Développement (depuis les sources)
Si vous développez AlgoLang ou n'avez pas installé le binaire :

```bash
# Utiliser directement avec Bun
bun run packages/compiler/src/cli.ts run examples/bonjour.algo
bun run packages/compiler/src/cli.ts compile examples/bonjour.algo -o output.js
bun run packages/compiler/src/cli.ts check examples/bonjour.algo --verbose
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