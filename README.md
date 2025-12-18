# AlgoLang - Compilateur Éducatif

AlgoLang est un langage de programmation éducatif pour l'apprentissage de l'algorithmique avec une syntaxe française.

## Installation

```bash
bun install
```

## Utilisation

### Compiler un fichier

```bash
# Compiler un fichier AlgoLang
bun run src/cli.ts compile examples/bonjour.algo -o output.js

# Compiler et exécuter directement
bun run src/cli.ts run examples/calculatrice.algo
```

### Vérifier la syntaxe

```bash
# Vérifier la syntaxe avec détails
bun run src/cli.ts check examples/calculatrice.algo --verbose
```

### Créer un nouveau projet

```bash
# Créer un nouveau programme avec template
bun run src/cli.ts init monprogramme --template hello
bun run src/cli.ts init moncalculatrice --template calculator
```

## Syntaxe AlgoLang

### Structure de base

```algo
programme NomDuProgramme;
var
  variable1: entier;
  variable2: chaine;
debut
  // Votre code ici
fin.
```

### Types de données

- `entier` : nombres entiers
- `reel` : nombres à virgule flottante  
- `chaine` : chaînes de caractères
- `booleen` : valeurs vrai/faux

### Instructions principales

- `ecrire(expr)` : afficher une valeur
- `lire(variable)` : lire une entrée utilisateur
- `variable := valeur` : affectation
- `si condition alors ... sinon ...` : condition
- `tantque condition faire ...` : boucle while
- `pour variable := debut a fin faire ...` : boucle for

### Opérateurs

- Arithmétiques : `+`, `-`, `*`, `/`
- Comparaison : `=`, `<>`, `<`, `<=`, `>`, `>=`
- Logiques : `et`, `ou`, `non`

## Exemples

### Bonjour le monde

```algo
programme BonjourMonde;
var
  message: chaine;
debut
  message := "Bonjour, AlgoLang en français!";
  ecrire(message);
fin.
```

### Calculatrice simple

```algo
programme Calculatrice;
var
  x, y, resultat: entier;
debut
  x := 10;
  y := 5;
  resultat := x + y;
  ecrire("Addition: ", x, " + ", y, " = ", resultat);
fin.
```

## Fonctionnalités

- ✅ Compilation JavaScript complète
- ✅ Génération de code avec commentaires pédagogiques
- ✅ Vérification syntaxique et sémantique
- ✅ Messages d'erreur en français
- ✅ Support des structures de contrôle classiques
- ✅ Gestion des variables typées
- ✅ Interface en ligne de commande moderne
- ✅ Validation des mots-clés réservés
- ✅ Messages d'erreur détaillés avec suggestions

## Structure du projet

```
├── src/
│   ├── lexer/          # Analyse lexicale
│   ├── parser/         # Analyse syntaxique  
│   ├── codegen/        # Génération de code JavaScript
│   ├── types/          # Définitions de types TypeScript
│   ├── compiler.ts     # Orchestrateur du compilateur
│   └── cli.ts         # Interface en ligne de commande
├── examples/           # Exemples de programmes AlgoLang
└── context/           # Documentation technique
```

## Mots-clés réservés

Les mots-clés suivants sont réservés par le langage et ne peuvent pas être utilisés comme noms de variables :

### Mots-clés principaux
- `programme`, `debut`, `fin`, `var`

### Types de données
- `entier`, `reel`, `booleen`, `chaine`

### Structures de contrôle
- `si`, `alors`, `sinon`, `finsi`
- `tantque`, `faire`, `fintantque`
- `pour`, `a`, `finpour`
- `repeter`, `jusqua`

### Entrées/sorties
- `lire`, `ecrire`

### Valeurs booléennes
- `vrai`, `faux`

### Opérateurs logiques
- `et`, `ou`, `non`

### Exemple d'erreur et correction

❌ **Incorrect** (utilisation d'un mot-clé réservé) :
```algo
programme MonProgramme;
var
  pour: entier;  // Erreur: 'pour' est réservé
debut
  pour := 10;
fin.
```

✅ **Correct** (noms valides) :
```algo
programme MonProgramme;
var
  compteurPour: entier;  // ✅ Valide
  valeur: entier;        // ✅ Valide
debut
  compteurPour := 10;
fin.
```

## Notes

- Le compilateur génère du code JavaScript moderne avec Node.js
- Les programmes peuvent être exécutés directement avec la commande `run`
- Le mode pédagogique ajoute des commentaires explicatifs dans le code généré
- Les erreurs de mots-clés réservés incluent des suggestions de noms alternatifs