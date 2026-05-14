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
PROGRAMME Bonjour;
DEBUT
  ECRIRE("Bonjour le monde !");
FIN
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
PROGRAMME BonjourMonde;
VAR
  message: CHAINE;
DEBUT
  message := "Bonjour, bienvenue dans l'apprentissage de l'algorithmique !";
  ECRIRE(message);
FIN
```

### Niveau 2 : Variables et Calculs
Manipulez des nombres et effectuez des opérations arithmétiques.

```algo
PROGRAMME CalculSimple;
VAR
  nombre1, nombre2, resultat: ENTIER;
DEBUT
  nombre1 := 15;
  nombre2 := 10;
  resultat := (nombre1 + nombre2) * 2;
  ECRIRE("Le résultat de (15 + 10) * 2 est : ", resultat);
FIN
```

### Niveau 3 : Conditions (SI/SINON)
Apprenez à prendre des décisions dans votre code.

```algo
PROGRAMME VerifAge;
VAR
  age: ENTIER;
DEBUT
  ECRIRE("Entrez votre âge : ");
  LIRE(age);
  
  SI age >= 18 ALORS
    ECRIRE("Vous êtes majeur.");
  SINON
    ECRIRE("Vous êtes mineur.");
  FINSI;
FIN
```

### Niveau 4 : Boucles (Répétition)
Automatisez des tâches répétitives avec `POUR` et `TANTQUE`.

```algo
PROGRAMME TableMultiplication;
VAR
  i, nombre: ENTIER;
DEBUT
  nombre := 7;
  ECRIRE("Table de ", nombre, " :");
  
  POUR i := 1 A 10 FAIRE
    ECRIRE(i, " x ", nombre, " = ", i * nombre);
  FINPOUR;
FIN
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
bun run packages/algolang/src/cli.ts run examples/bonjour.algo
bun run packages/algolang/src/cli.ts compile examples/bonjour.algo -o output.js
bun run packages/algolang/src/cli.ts check examples/bonjour.algo --verbose
```

---

## 📝 Référence de Syntaxe

### Types de données
- `ENTIER` : Nombres entiers (ex: 10, -5)
- `REEL` : Nombres à virgule (ex: 3.14)
- `CHAINE` : Texte (ex: "Bonjour")
- `BOOLEEN` : Logique (`VRAI` ou `FAUX`)

### Opérateurs
| Type | Opérateurs |
| :--- | :--- |
| **Calcul** | `+`, `-`, `*`, `/` |
| **Comparaison** | `=`, `<>`, `<`, `<=`, `>`, `>=` |
| **Logique** | `ET`, `OU`, `NON` |

### Mots-clés réservés
Ne les utilisez pas comme noms de variables !
`PROGRAMME`, `DEBUT`, `FIN`, `VAR`, `SI`, `ALORS`, `SINON`, `FINSI`, `TANTQUE`, `FAIRE`, `POUR`, `A`, `FINPOUR`, `REPETER`, `JUSQUA`, `LIRE`, `ECRIRE`.

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