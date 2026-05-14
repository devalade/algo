import { TokenType } from "./types/index.js";

export type KeywordKind =
	| "control"
	| "type"
	| "io"
	| "operator"
	| "literal"
	| "declaration"
	| "builtin-function";

export interface KeywordEntry {
	/** TokenType for keywords tokenised by the lexer; null for built-in functions (parsed as identifiers). */
	tokenType: TokenType | null;
	kind: KeywordKind;
	detail: string;
	documentation: string;
}

/**
 * Single source of truth for all AlgoLang keywords and built-in functions.
 *
 * Keys are the canonical surface strings exactly as they appear in source code
 * (uppercase for keywords, lowercase for built-in functions).
 *
 * Consumers:
 *  - Lexer   → derives its keyword→TokenType Map from entries where tokenType !== null
 *  - Parser  → derives its reservedKeywords Set from those same entries
 *  - LSP     → derives CompletionItems and hover docs directly from this record
 */
export const KEYWORDS: Record<string, KeywordEntry> = {
	// ── Programme structure ───────────────────────────────────────────────────
	PROGRAMME: {
		tokenType: TokenType.PROGRAM,
		kind: "control",
		detail: "Mot-clé PROGRAMME",
		documentation: "**PROGRAMME** : Début d'un programme AlgoLang.",
	},
	DEBUT: {
		tokenType: TokenType.BEGIN,
		kind: "control",
		detail: "Mot-clé DEBUT",
		documentation: "**DEBUT** : Début du bloc d'instructions principal.",
	},
	FIN: {
		tokenType: TokenType.END,
		kind: "control",
		detail: "Mot-clé FIN",
		documentation: "**FIN** : Fin du bloc d'instructions ou du programme.",
	},
	VAR: {
		tokenType: TokenType.VAR,
		kind: "declaration",
		detail: "Mot-clé VAR",
		documentation: "**VAR** : Section de déclaration des variables.",
	},

	// ── Types ─────────────────────────────────────────────────────────────────
	ENTIER: {
		tokenType: TokenType.INTEGER,
		kind: "type",
		detail: "Type ENTIER",
		documentation: "**ENTIER** : Type de donnée pour les nombres entiers.",
	},
	REEL: {
		tokenType: TokenType.REAL,
		kind: "type",
		detail: "Type REEL",
		documentation: "**REEL** : Type de donnée pour les nombres à virgule.",
	},
	BOOLEEN: {
		tokenType: TokenType.BOOLEAN,
		kind: "type",
		detail: "Type BOOLEEN",
		documentation: "**BOOLEEN** : Type de donnée logique (VRAI/FAUX).",
	},
	CHAINE: {
		tokenType: TokenType.STRING,
		kind: "type",
		detail: "Type CHAINE",
		documentation: "**CHAINE** : Type de donnée pour le texte.",
	},

	// ── Conditionals ──────────────────────────────────────────────────────────
	SI: {
		tokenType: TokenType.IF,
		kind: "control",
		detail: "Mot-clé SI",
		documentation: "**SI** : Structure conditionnelle.",
	},
	ALORS: {
		tokenType: TokenType.THEN,
		kind: "control",
		detail: "Mot-clé ALORS",
		documentation: "**ALORS** : Début du bloc exécuté si la condition est vraie.",
	},
	SINON: {
		tokenType: TokenType.ELSE,
		kind: "control",
		detail: "Mot-clé SINON",
		documentation: "**SINON** : Début du bloc exécuté si la condition est fausse.",
	},
	FINSI: {
		tokenType: TokenType.ENDIF,
		kind: "control",
		detail: "Mot-clé FINSI",
		documentation: "**FINSI** : Fin d'une structure conditionnelle.",
	},

	// ── While loop ────────────────────────────────────────────────────────────
	TANTQUE: {
		tokenType: TokenType.WHILE,
		kind: "control",
		detail: "Mot-clé TANTQUE",
		documentation: "**TANTQUE** : Boucle répétitive tant qu'une condition est vraie.",
	},
	FAIRE: {
		tokenType: TokenType.DO,
		kind: "control",
		detail: "Mot-clé FAIRE",
		documentation: "**FAIRE** : Début du corps d'une boucle.",
	},
	FINTANTQUE: {
		tokenType: TokenType.ENDWHILE,
		kind: "control",
		detail: "Mot-clé FINTANTQUE",
		documentation: "**FINTANTQUE** : Fin d'une boucle TANTQUE.",
	},

	// ── For loop ──────────────────────────────────────────────────────────────
	POUR: {
		tokenType: TokenType.FOR,
		kind: "control",
		detail: "Mot-clé POUR",
		documentation: "**POUR** : Boucle avec compteur.",
	},
	ALLANT: {
		tokenType: TokenType.ALLANT,
		kind: "control",
		detail: "Mot-clé ALLANT",
		documentation: "**ALLANT** : Utilisé dans une boucle POUR pour spécifier la plage.",
	},
	DE: {
		tokenType: TokenType.DE,
		kind: "control",
		detail: "Mot-clé DE",
		documentation: "**DE** : Spécifie le début d'une plage dans une boucle POUR.",
	},
	A: {
		tokenType: TokenType.TO,
		kind: "control",
		detail: "Mot-clé A",
		documentation: "**A** : Spécifie la fin d'une plage dans une boucle POUR.",
	},
	FINPOUR: {
		tokenType: TokenType.ENDFOR,
		kind: "control",
		detail: "Mot-clé FINPOUR",
		documentation: "**FINPOUR** : Fin d'une boucle POUR.",
	},

	// ── Repeat loop ───────────────────────────────────────────────────────────
	REPETER: {
		tokenType: TokenType.REPEAT,
		kind: "control",
		detail: "Mot-clé REPETER",
		documentation: "**REPETER** : Boucle exécutée au moins une fois.",
	},
	"JUSQU'A": {
		tokenType: TokenType.UNTIL,
		kind: "control",
		detail: "Mot-clé JUSQU'A",
		documentation: "**JUSQU'A** : Condition de fin d'une boucle REPETER.",
	},

	// ── I/O ───────────────────────────────────────────────────────────────────
	LIRE: {
		tokenType: TokenType.READ,
		kind: "io",
		detail: "Fonction LIRE",
		documentation: "**LIRE(variable)** : Lit une valeur depuis l'entrée standard.",
	},
	ECRIRE: {
		tokenType: TokenType.WRITE,
		kind: "io",
		detail: "Fonction ECRIRE",
		documentation: "**ECRIRE(...)** : Affiche des valeurs dans la console.",
	},

	// ── Boolean literals ──────────────────────────────────────────────────────
	VRAI: {
		tokenType: TokenType.TRUE,
		kind: "literal",
		detail: "Constante VRAI",
		documentation: "**VRAI** : Valeur booléenne vraie.",
	},
	FAUX: {
		tokenType: TokenType.FALSE,
		kind: "literal",
		detail: "Constante FAUX",
		documentation: "**FAUX** : Valeur booléenne fausse.",
	},

	// ── Logical operators ─────────────────────────────────────────────────────
	ET: {
		tokenType: TokenType.AND,
		kind: "operator",
		detail: "Opérateur ET",
		documentation: "**ET** : Opérateur logique ET (AND).",
	},
	OU: {
		tokenType: TokenType.OR,
		kind: "operator",
		detail: "Opérateur OU",
		documentation: "**OU** : Opérateur logique OU (OR).",
	},
	NON: {
		tokenType: TokenType.NOT,
		kind: "operator",
		detail: "Opérateur NON",
		documentation: "**NON** : Opérateur logique NON (NOT).",
	},

	// ── Arrays and subprograms ────────────────────────────────────────────────
	TABLEAU: {
		tokenType: TokenType.ARRAY,
		kind: "declaration",
		detail: "Type TABLEAU",
		documentation: "**TABLEAU** : Déclare un tableau de n éléments.\nSyntaxe : `t: TABLEAU[10] DE ENTIER`",
	},
	FONCTION: {
		tokenType: TokenType.FUNCTION,
		kind: "declaration",
		detail: "Mot-clé FONCTION",
		documentation: "**FONCTION** nom(params): TYPE : Déclare une fonction qui retourne une valeur.\nExemple : `FONCTION carre(n: ENTIER): ENTIER`",
	},
	PROCEDURE: {
		tokenType: TokenType.PROCEDURE,
		kind: "declaration",
		detail: "Mot-clé PROCEDURE",
		documentation: "**PROCEDURE** nom(params) : Déclare une procédure (sans valeur de retour).\nExemple : `PROCEDURE afficher(s: CHAINE)`",
	},
	RETOURNER: {
		tokenType: TokenType.RETURN,
		kind: "declaration",
		detail: "Mot-clé RETOURNER",
		documentation: "**RETOURNER** expr : Retourne une valeur depuis une fonction.",
	},

	// ── Built-in functions (parsed as identifiers, tokenType: null) ───────────
	abs: {
		tokenType: null,
		kind: "builtin-function",
		detail: "Fonction abs(x)",
		documentation: "**abs(x)** : Retourne la valeur absolue de x.",
	},
	max: {
		tokenType: null,
		kind: "builtin-function",
		detail: "Fonction max(a, b)",
		documentation: "**max(a, b)** : Retourne le plus grand des deux nombres.",
	},
	min: {
		tokenType: null,
		kind: "builtin-function",
		detail: "Fonction min(a, b)",
		documentation: "**min(a, b)** : Retourne le plus petit des deux nombres.",
	},
	mod: {
		tokenType: null,
		kind: "builtin-function",
		detail: "Fonction mod(a, b)",
		documentation: "**mod(a, b)** : Retourne le reste de la division de a par b. Équivalent à `a % b`.",
	},
	racine_carree: {
		tokenType: null,
		kind: "builtin-function",
		detail: "Fonction racine_carree(x)",
		documentation: "**racine_carree(x)** : Retourne la racine carrée de x.",
	},
	taille: {
		tokenType: null,
		kind: "builtin-function",
		detail: "Fonction taille(x)",
		documentation: "**taille(x)** : Retourne la taille d'un tableau ou la longueur d'une chaîne.",
	},
	sous_chaine: {
		tokenType: null,
		kind: "builtin-function",
		detail: "Fonction sous_chaine(s, i, n)",
		documentation: "**sous_chaine(s, i, n)** : Retourne n caractères de la chaîne s à partir de l'indice i.",
	},
	concat: {
		tokenType: null,
		kind: "builtin-function",
		detail: "Fonction concat(a, b)",
		documentation: "**concat(a, b)** : Concatène deux chaînes de caractères.",
	},
	entier_en_reel: {
		tokenType: null,
		kind: "builtin-function",
		detail: "Fonction entier_en_reel(x)",
		documentation: "**entier_en_reel(x)** : Convertit un entier en réel.",
	},
	reel_en_entier: {
		tokenType: null,
		kind: "builtin-function",
		detail: "Fonction reel_en_entier(x)",
		documentation: "**reel_en_entier(x)** : Convertit un réel en entier (troncature).",
	},
};

/** Names of built-in functions that cannot be used as variable names. */
export const BUILTIN_NAMES: ReadonlySet<string> = new Set(
	Object.entries(KEYWORDS)
		.filter(([, e]) => e.tokenType === null)
		.map(([label]) => label),
);
