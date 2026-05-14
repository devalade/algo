export const KEYWORD_DOCS: Record<string, { detail: string; documentation: string }> = {
	PROGRAMME: {
		detail: "Mot-clé PROGRAMME",
		documentation: "**PROGRAMME** : Début d'un programme AlgoLang."
	},
	DEBUT: {
		detail: "Mot-clé DEBUT",
		documentation: "**DEBUT** : Début du bloc d'instructions principal."
	},
	FIN: {
		detail: "Mot-clé FIN",
		documentation: "**FIN** : Fin du bloc d'instructions ou du programme."
	},
	VAR: {
		detail: "Mot-clé VAR",
		documentation: "**VAR** : Section de déclaration des variables."
	},
	ENTIER: {
		detail: "Type ENTIER",
		documentation: "**ENTIER** : Type de donnée pour les nombres entiers."
	},
	REEL: {
		detail: "Type REEL",
		documentation: "**REEL** : Type de donnée pour les nombres à virgule."
	},
	BOOLEEN: {
		detail: "Type BOOLEEN",
		documentation: "**BOOLEEN** : Type de donnée logique (VRAI/FAUX)."
	},
	CHAINE: {
		detail: "Type CHAINE",
		documentation: "**CHAINE** : Type de donnée pour le texte."
	},
	SI: {
		detail: "Mot-clé SI",
		documentation: "**SI** : Structure conditionnelle."
	},
	ALORS: {
		detail: "Mot-clé ALORS",
		documentation: "**ALORS** : Début du bloc exécuté si la condition est vraie."
	},
	SINON: {
		detail: "Mot-clé SINON",
		documentation: "**SINON** : Début du bloc exécuté si la condition est fausse."
	},
	FINSI: {
		detail: "Mot-clé FINSI",
		documentation: "**FINSI** : Fin d'une structure conditionnelle."
	},
	TANTQUE: {
		detail: "Mot-clé TANTQUE",
		documentation: "**TANTQUE** : Boucle répétitive tant qu'une condition est vraie."
	},
	FAIRE: {
		detail: "Mot-clé FAIRE",
		documentation: "**FAIRE** : Début du corps d'une boucle."
	},
	FINTANTQUE: {
		detail: "Mot-clé FINTANTQUE",
		documentation: "**FINTANTQUE** : Fin d'une boucle TANTQUE."
	},
	POUR: {
		detail: "Mot-clé POUR",
		documentation: "**POUR** : Boucle avec compteur."
	},
	ALLANT: {
		detail: "Mot-clé ALLANT",
		documentation: "**ALLANT** : Utilisé dans une boucle POUR pour spécifier la plage."
	},
	DE: {
		detail: "Mot-clé DE",
		documentation: "**DE** : Spécifie le début d'une plage dans une boucle POUR."
	},
	A: {
		detail: "Mot-clé A",
		documentation: "**A** : Spécifie la fin d'une plage dans une boucle POUR."
	},
	FINPOUR: {
		detail: "Mot-clé FINPOUR",
		documentation: "**FINPOUR** : Fin d'une boucle POUR."
	},
	REPETER: {
		detail: "Mot-clé REPETER",
		documentation: "**REPETER** : Boucle exécutée au moins une fois."
	},
	"JUSQU'A": {
		detail: "Mot-clé JUSQU'A",
		documentation: "**JUSQU'A** : Condition de fin d'une boucle REPETER."
	},
	LIRE: {
		detail: "Fonction LIRE",
		documentation: "**LIRE(variable)** : Lit une valeur depuis l'entrée standard."
	},
	ECRIRE: {
		detail: "Fonction ECRIRE",
		documentation: "**ECRIRE(...)** : Affiche des valeurs dans la console."
	},
	VRAI: {
		detail: "Constante VRAI",
		documentation: "**VRAI** : Valeur booléenne vraie."
	},
	FAUX: {
		detail: "Constante FAUX",
		documentation: "**FAUX** : Valeur booléenne fausse."
	},
	ET: {
		detail: "Opérateur ET",
		documentation: "**ET** : Opérateur logique ET (AND)."
	},
	OU: {
		detail: "Opérateur OU",
		documentation: "**OU** : Opérateur logique OU (OR)."
	},
	NON: {
		detail: "Opérateur NON",
		documentation: "**NON** : Opérateur logique NON (NOT)."
	},
	TABLEAU: {
		detail: "Type TABLEAU",
		documentation: "**TABLEAU** : Déclare un tableau de n éléments.\nSyntaxe : `t: TABLEAU[10] DE ENTIER`"
	},
	FONCTION: {
		detail: "Mot-clé FONCTION",
		documentation: "**FONCTION** nom(params): TYPE : Déclare une fonction qui retourne une valeur.\nExemple : `FONCTION carre(n: ENTIER): ENTIER`"
	},
	PROCEDURE: {
		detail: "Mot-clé PROCEDURE",
		documentation: "**PROCEDURE** nom(params) : Déclare une procédure (sans valeur de retour).\nExemple : `PROCEDURE afficher(s: CHAINE)`"
	},
	RETOURNER: {
		detail: "Mot-clé RETOURNER",
		documentation: "**RETOURNER** expr : Retourne une valeur depuis une fonction."
	},
	abs: {
		detail: "Fonction abs(x)",
		documentation: "**abs(x)** : Retourne la valeur absolue de x."
	},
	max: {
		detail: "Fonction max(a, b)",
		documentation: "**max(a, b)** : Retourne le plus grand des deux nombres."
	},
	min: {
		detail: "Fonction min(a, b)",
		documentation: "**min(a, b)** : Retourne le plus petit des deux nombres."
	},
	mod: {
		detail: "Fonction mod(a, b)",
		documentation: "**mod(a, b)** : Retourne le reste de la division de a par b. Équivalent à `a % b`."
	},
	racine_carree: {
		detail: "Fonction racine_carree(x)",
		documentation: "**racine_carree(x)** : Retourne la racine carrée de x."
	},
	taille: {
		detail: "Fonction taille(x)",
		documentation: "**taille(x)** : Retourne la taille d'un tableau ou la longueur d'une chaîne."
	},
	sous_chaine: {
		detail: "Fonction sous_chaine(s, i, n)",
		documentation: "**sous_chaine(s, i, n)** : Retourne n caractères de la chaîne s à partir de l'indice i."
	},
	concat: {
		detail: "Fonction concat(a, b)",
		documentation: "**concat(a, b)** : Concatène deux chaînes de caractères."
	},
	entier_en_reel: {
		detail: "Fonction entier_en_reel(x)",
		documentation: "**entier_en_reel(x)** : Convertit un entier en réel."
	},
	reel_en_entier: {
		detail: "Fonction reel_en_entier(x)",
		documentation: "**reel_en_entier(x)** : Convertit un réel en entier (troncature)."
	}
};
