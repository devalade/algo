// ===============================================
// Code généré par AlgoLang - Compilateur Éducatif
// Fichier source: examples/deviner-nombre.algo
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

// Programme: DevinerNombre
async function main() {
// Point d'entrée principal
    let secret; // number
// Déclaration de variable
  let essai; // number
// Déclaration de variable
  let compteur; // number
// Déclaration de variable
  let trouve; // boolean
// Déclaration de variable
    secret = 42;
  compteur = 0;
  trouve = false;
  ecrire("Jeu du nombre secret !");
  ecrire("Devinez un nombre entre 1 et 100");
  while (!(trouve)) {
// Boucle conditionnelle : répète tant que la condition est vraie
      ecrire("Votre essai : ");
  essai = parseInt(await lire(""));
  compteur = (compteur + 1);
  if ((essai === secret)) {
// Structure conditionnelle : exécute le code si la condition est vraie
    trouve = true;
}
}
  ecrire("Bravo ! Trouve en ", compteur, " essais !");
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