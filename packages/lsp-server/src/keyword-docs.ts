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
	}
};
