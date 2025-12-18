// Types de base pour AlgoLang
export var TokenType;
(function (TokenType) {
    // Mots-clés en français
    TokenType["PROGRAM"] = "PROGRAMME";
    TokenType["BEGIN"] = "DEBUT";
    TokenType["END"] = "FIN";
    TokenType["VAR"] = "VAR";
    TokenType["INTEGER"] = "ENTIER";
    TokenType["REAL"] = "REEL";
    TokenType["BOOLEAN"] = "BOOLEEN";
    TokenType["STRING"] = "CHAINE";
    TokenType["IF"] = "SI";
    TokenType["THEN"] = "ALORS";
    TokenType["ELSE"] = "SINON";
    TokenType["WHILE"] = "TANTQUE";
    TokenType["DO"] = "FAIRE";
    TokenType["FOR"] = "POUR";
    TokenType["ALLANT"] = "ALLANT";
    TokenType["DE"] = "DE";
    TokenType["TO"] = "A";
    TokenType["REPEAT"] = "REPETER";
    TokenType["UNTIL"] = "JUSQUA";
    TokenType["READ"] = "LIRE";
    TokenType["WRITE"] = "ECRIRE";
    TokenType["TRUE"] = "VRAI";
    TokenType["FALSE"] = "FAUX";
    TokenType["AND"] = "ET";
    TokenType["OR"] = "OU";
    TokenType["NOT"] = "NON";
    TokenType["ENDFOR"] = "FINPOUR";
    TokenType["ENDIF"] = "FINIF";
    TokenType["ENDWHILE"] = "FINTANTQUE";
    // Opérateurs
    TokenType["PLUS"] = "PLUS";
    TokenType["MINUS"] = "MINUS";
    TokenType["MULTIPLY"] = "MULTIPLY";
    TokenType["DIVIDE"] = "DIVIDE";
    TokenType["ASSIGN"] = "ASSIGN";
    TokenType["EQUAL"] = "EQUAL";
    TokenType["NOT_EQUAL"] = "NOT_EQUAL";
    TokenType["LESS_THAN"] = "LESS_THAN";
    TokenType["LESS_EQUAL"] = "LESS_EQUAL";
    TokenType["GREATER_THAN"] = "GREATER_THAN";
    TokenType["GREATER_EQUAL"] = "GREATER_EQUAL";
    // Délimiteurs
    TokenType["SEMICOLON"] = "SEMICOLON";
    TokenType["COLON"] = "COLON";
    TokenType["COMMA"] = "COMMA";
    TokenType["DOT"] = "DOT";
    TokenType["LEFT_PAREN"] = "LEFT_PAREN";
    TokenType["RIGHT_PAREN"] = "RIGHT_PAREN";
    // Littéraux et identificateurs
    TokenType["NUMBER"] = "NUMBER";
    TokenType["IDENTIFIER"] = "IDENTIFIER";
    TokenType["STRING_LITERAL"] = "STRING_LITERAL";
    // Spécial
    TokenType["EOF"] = "EOF";
    TokenType["NEWLINE"] = "NEWLINE";
    TokenType["COMMENT"] = "COMMENT";
})(TokenType || (TokenType = {}));
export var NodeType;
(function (NodeType) {
    // Programme
    NodeType["PROGRAM"] = "PROGRAM";
    // Déclarations
    NodeType["VAR_DECLARATION"] = "VAR_DECLARATION";
    NodeType["TYPE_SPECIFIER"] = "TYPE_SPECIFIER";
    // Instructions
    NodeType["ASSIGNMENT"] = "ASSIGNMENT";
    NodeType["IF_STATEMENT"] = "IF_STATEMENT";
    NodeType["WHILE_STATEMENT"] = "WHILE_STATEMENT";
    NodeType["FOR_STATEMENT"] = "FOR_STATEMENT";
    NodeType["REPEAT_STATEMENT"] = "REPEAT_STATEMENT";
    NodeType["READ_STATEMENT"] = "READ_STATEMENT";
    NodeType["WRITE_STATEMENT"] = "WRITE_STATEMENT";
    NodeType["COMPOUND_STATEMENT"] = "COMPOUND_STATEMENT";
    // Expressions
    NodeType["BINARY_OP"] = "BINARY_OP";
    NodeType["UNARY_OP"] = "UNARY_OP";
    NodeType["LITERAL"] = "LITERAL";
    NodeType["VARIABLE"] = "VARIABLE";
    // Utilitaires
    NodeType["BLOCK"] = "BLOCK";
    NodeType["PARAMETER_LIST"] = "PARAMETER_LIST";
})(NodeType || (NodeType = {}));
export var DataType;
(function (DataType) {
    DataType["INTEGER"] = "ENTIER";
    DataType["REAL"] = "REEL";
    DataType["BOOLEAN"] = "BOOLEEN";
    DataType["STRING"] = "CHAINE";
    DataType["VOID"] = "VIDE";
})(DataType || (DataType = {}));
//# sourceMappingURL=index.js.map