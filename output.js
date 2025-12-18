// ===============================================
// Code généré par AlgoLang - Compilateur Éducatif
// Fichier source: examples/bonjour.algo
// Variables déclarées: 1
// Erreurs de compilation: 0
// Avertissements: 0
// ===============================================

// Code généré par AlgoLang
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Programme: BonjourMonde
async function main() {
// Point d'entrée principal
    let message; // string
// Déclaration de variable
    message = "Bonjour, AlgoLang en français!";
  ecrire(message);
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