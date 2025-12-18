// ===============================================
// Code généré par AlgoLang - Compilateur Éducatif
// Fichier source: ./examples/calculatrice.algo
// Variables déclarées: 4
// Erreurs de compilation: 0
// Avertissements: 0
// ===============================================

// Code généré par AlgoLang
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Programme: Calculatrice
async function main() {
// Point d'entrée principal
      let x, y, resultat, i; // number
// Déclaration de variable
    x = 10;
  y = 5;
  resultat = (x + y);
  ecrire("Addition: ", x, " + ", y, " = ", resultat);
  ecrire("Table de multiplication de 3:");
  for (let i = 1; i <= 5; i++) {
// Déclaration de variable
      ecrire("3 × ", i, " = ", (3 * i));
}
  if ((resultat > 15)) {
// Structure conditionnelle : exécute le code si la condition est vraie
      ecrire("Le résultat est grand");
} else {
      ecrire("Le résultat est petit");
}
}

// Fonctions utilitaires pour les entrées/sorties
function lire(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

function ecrire(...args) {
  console.log(...args);
}

// Point d'entrée principal
main().then(() => {
  rl.close();
});