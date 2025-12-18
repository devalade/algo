import { TokenType, NodeType, DataType } from "@/types";
export class Parser {
    tokens;
    current = 0;
    errors = [];
    symbolTable;
    // Liste des mots-clés réservés qui ne peuvent pas être utilisés comme noms de variables
    reservedKeywords = new Set([
        // Mots-clés principaux
        "programme",
        "debut",
        "fin",
        "var",
        // Types de données
        "entier",
        "reel",
        "booleen",
        "chaine",
        // Structures de contrôle
        "si",
        "alors",
        "sinon",
        "finsi",
        "tantque",
        "faire",
        "fintantque",
        "pour",
        "a",
        "finpour",
        "repeter",
        "jusqua",
        // Entrées/sorties
        "lire",
        "ecrire",
        // Valeurs booléennes
        "vrai",
        "faux",
        // Opérateurs logiques
        "et",
        "ou",
        "non",
        // Mots-clés spéciaux
        "fonction",
        "procedure",
        "retourner",
    ]);
    constructor(tokens) {
        this.tokens = tokens;
        this.symbolTable = {
            symbols: new Map(),
            children: [],
            scopeName: "global",
        };
    }
    /**
     * Vérifie si un identificateur est un mot-clé réservé
     */
    isReservedKeyword(identifier) {
        return this.reservedKeywords.has(identifier.toLowerCase());
    }
    /**
     * Vérifie si un token type correspond à un mot-clé réservé
     */
    isKeywordToken(tokenType) {
        return [
            TokenType.PROGRAM,
            TokenType.BEGIN,
            TokenType.END,
            TokenType.VAR,
            TokenType.INTEGER,
            TokenType.REAL,
            TokenType.BOOLEAN,
            TokenType.STRING,
            TokenType.IF,
            TokenType.THEN,
            TokenType.ELSE,
            TokenType.WHILE,
            TokenType.DO,
            TokenType.FOR,
            TokenType.ALLANT,
            TokenType.DE,
            TokenType.TO,
            TokenType.REPEAT,
            TokenType.UNTIL,
            TokenType.READ,
            TokenType.WRITE,
            TokenType.TRUE,
            TokenType.FALSE,
            TokenType.AND,
            TokenType.OR,
            TokenType.NOT,
            TokenType.ENDFOR,
            TokenType.ENDIF,
            TokenType.ENDWHILE,
        ].includes(tokenType);
    }
    /**
     * Crée une erreur pour un mot-clé réservé utilisé comme nom de variable
     */
    createReservedKeywordError(identifier, token) {
        this.errors.push({
            type: "ERROR",
            message: `Le nom '${identifier}' est un mot-clé réservé et ne peut pas être utilisé comme nom de variable`,
            line: token.line,
            column: token.column,
            position: token.position,
            code: "RESERVED_KEYWORD",
            explanation: "Les mots-clés réservés sont utilisés par le langage AlgoLang pour définir la structure du programme et ne peuvent pas être utilisés comme noms de variables.",
            suggestion: `Choisissez un autre nom plus descriptif, par exemple: '${identifier}Valeur', '${identifier}Temp', 'ma${identifier.charAt(0).toUpperCase() + identifier.slice(1)}'`,
        });
    }
    parse() {
        try {
            const program = this.parseProgram();
            return {
                ast: program,
                errors: this.errors,
                symbolTable: this.symbolTable,
            };
        }
        catch (error) {
            return {
                ast: { type: NodeType.PROGRAM, children: [] },
                errors: [
                    ...this.errors,
                    {
                        type: "ERROR",
                        message: error instanceof Error
                            ? error.message
                            : "Erreur de parsing inconnue",
                        line: 0,
                        column: 0,
                        position: 0,
                        code: "PARSE_ERROR",
                    },
                ],
                symbolTable: this.symbolTable,
            };
        }
    }
    parseProgram() {
        const programToken = this.expect(TokenType.PROGRAM, 'Le programme doit commencer par le mot-clé "programme"');
        const identifier = this.expect(TokenType.IDENTIFIER, "Le programme doit avoir un nom");
        this.expect(TokenType.SEMICOLON, "Le nom du programme doit être suivi d'un point-virgule");
        const block = this.parseBlock();
        this.expect(TokenType.DOT, "Le programme doit se terminer par un point");
        return {
            type: NodeType.PROGRAM,
            value: identifier.value,
            children: [block],
            token: programToken,
        };
    }
    parseBlock() {
        const declarations = this.parseDeclarations();
        const compoundStatement = this.parseCompoundStatement();
        return {
            type: NodeType.BLOCK,
            children: [declarations, compoundStatement],
        };
    }
    parseDeclarations() {
        const declarations = [];
        while (this.check(TokenType.VAR)) {
            this.advance(); // Consommer 'var'
            while (!this.check(TokenType.BEGIN) && !this.isAtEnd()) {
                const declaration = this.parseVariableDeclaration();
                declarations.push(declaration);
                if (!this.check(TokenType.SEMICOLON)) {
                    break;
                }
                this.advance(); // Consommer ';'
            }
        }
        return {
            type: NodeType.BLOCK,
            children: declarations,
        };
    }
    parseVariableDeclaration() {
        const identifiers = [];
        // Parser la liste d'identificateurs
        do {
            let identifier;
            // Vérifier si on a un identificateur ou un mot-clé réservé
            if (this.check(TokenType.IDENTIFIER)) {
                identifier = this.advance();
            }
            else {
                // Vérifier si c'est un mot-clé réservé
                const currentToken = this.peek();
                if (this.isKeywordToken(currentToken.type)) {
                    identifier = this.advance(); // Consommer le mot-clé
                    this.createReservedKeywordError(identifier.value, identifier);
                }
                else {
                    // Erreur normale - pas un identificateur
                    this.expect(TokenType.IDENTIFIER, "Identificateur attendu dans la déclaration de variable");
                    break;
                }
            }
            // Vérifier si l'identificateur est un mot-clé réservé (au cas où)
            if (this.isReservedKeyword(identifier.value)) {
                this.createReservedKeywordError(identifier.value, identifier);
            }
            identifiers.push(identifier.value);
            if (this.check(TokenType.COMMA)) {
                this.advance();
            }
            else {
                break;
            }
        } while (true);
        this.expect(TokenType.COLON, "Deux-points attendus après les identificateurs");
        // Parser le type
        const typeToken = this.expect([TokenType.INTEGER, TokenType.REAL, TokenType.BOOLEAN, TokenType.STRING], "Type de variable attendu");
        const type = this.tokenTypeToDataType(typeToken.type);
        // Ajouter les variables à la table des symboles
        for (const identifier of identifiers) {
            if (this.symbolTable.symbols.has(identifier)) {
                this.errors.push({
                    type: "ERROR",
                    message: `La variable '${identifier}' est déjà déclarée`,
                    line: typeToken.line,
                    column: typeToken.column,
                    position: typeToken.position,
                    code: "DUPLICATE_VARIABLE",
                    explanation: "Chaque variable doit avoir un nom unique dans son scope",
                    suggestion: `Choisissez un autre nom pour la variable '${identifier}'`,
                });
            }
            else {
                const symbolInfo = {
                    name: identifier,
                    type,
                    scope: this.symbolTable.scopeName,
                    line: typeToken.line,
                    column: typeToken.column,
                };
                this.symbolTable.symbols.set(identifier, symbolInfo);
            }
        }
        return {
            type: NodeType.VAR_DECLARATION,
            value: type,
            children: identifiers.map((name) => ({
                type: NodeType.VARIABLE,
                value: name,
            })),
            token: typeToken,
        };
    }
    parseCompoundStatement() {
        this.expect(TokenType.BEGIN, 'Le bloc d\'instructions doit commencer par "debut"');
        const statements = [];
        while (!this.check(TokenType.END) && !this.isAtEnd()) {
            const statement = this.parseStatement();
            statements.push(statement);
            // Après une instruction, vérifier s'il y a un point-virgule
            // Mais ne pas en exiger si le token suivant est END, ENDIF, ou ENDWHILE
            if (this.check(TokenType.SEMICOLON)) {
                this.advance();
            }
            else if (!this.check(TokenType.END) &&
                !this.check(TokenType.ENDIF) &&
                !this.check(TokenType.ENDWHILE)) {
                // Si ce n'est pas END, ENDIF, ou ENDWHILE, on attend un point-virgule
                this.errors.push({
                    type: "ERROR",
                    message: "Point-virgule attendu après l'instruction",
                    line: this.peek().line,
                    column: this.peek().column,
                    position: this.peek().position,
                    code: "MISSING_SEMICOLON",
                });
                break;
            }
        }
        this.expect(TokenType.END, 'Le bloc d\'instructions doit se terminer par "fin"');
        return {
            type: NodeType.COMPOUND_STATEMENT,
            children: statements,
        };
    }
    parseStatement() {
        if (this.check(TokenType.BEGIN)) {
            return this.parseCompoundStatement();
        }
        // Vérifier si c'est une affectation avec un mot-clé réservé comme nom de variable
        if (this.isKeywordToken(this.peek().type) &&
            this.peekAhead(1)?.type === TokenType.ASSIGN) {
            return this.parseAssignment();
        }
        if (this.check(TokenType.IF)) {
            return this.parseIfStatement();
        }
        if (this.check(TokenType.WHILE)) {
            return this.parseWhileStatement();
        }
        if (this.check(TokenType.FOR)) {
            return this.parseForStatement();
        }
        if (this.check(TokenType.REPEAT)) {
            return this.parseRepeatStatement();
        }
        if (this.check(TokenType.READ)) {
            return this.parseReadStatement();
        }
        if (this.check(TokenType.WRITE)) {
            return this.parseWriteStatement();
        }
        // Sinon, c'est une affectation
        return this.parseAssignment();
    }
    parseIfStatement(isElseIf = false) {
        const ifToken = this.advance(); // Consommer 'si'
        const condition = this.parseExpression();
        this.expect(TokenType.THEN, '"alors" attendu après la condition du si');
        // Parser le bloc "alors"
        const thenStatements = [];
        while (!this.check(TokenType.ELSE) &&
            !this.check(TokenType.ENDIF) &&
            !this.check(TokenType.END) &&
            !this.isAtEnd()) {
            const statement = this.parseStatement();
            thenStatements.push(statement);
            // Gérer le point-virgule optionnel après l'instruction
            if (this.check(TokenType.SEMICOLON)) {
                this.advance();
            }
        }
        const thenStatement = {
            type: NodeType.COMPOUND_STATEMENT,
            children: thenStatements,
        };
        // Gérer la chaîne de "sinon si" ou "sinon"
        let elseStatement;
        // Vérifier s'il y a un point-virgule avant le sinon (optionnel mais fréquent)
        if (this.check(TokenType.SEMICOLON) && this.peekAhead(1)?.type === TokenType.ELSE) {
            this.advance(); // Consommer ';'
        }
        if (this.check(TokenType.ELSE)) {
            this.advance(); // Consommer 'sinon'
            if (this.check(TokenType.IF)) {
                // "sinon si" - on traite ça comme un nouvel if dans la branche else
                // NOTE: On passe true pour isElseIf car dans une chaîne sinon si, le finsi est partagé
                elseStatement = this.parseIfStatement(true);
            }
            else {
                // "sinon" normal
                const elseStatements = [];
                while (!this.check(TokenType.ENDIF) &&
                    !this.check(TokenType.END) &&
                    !this.isAtEnd()) {
                    const statement = this.parseStatement();
                    elseStatements.push(statement);
                    // Gérer le point-virgule optionnel
                    if (this.check(TokenType.SEMICOLON)) {
                        this.advance();
                    }
                }
                elseStatement = {
                    type: NodeType.COMPOUND_STATEMENT,
                    children: elseStatements,
                };
            }
        }
        // Si c'est un "sinon si", on ne consomme pas le finsi (il appartient au si parent)
        if (!isElseIf) {
            // Vérifier s'il y a un point-virgule avant le finsi (optionnel mais fréquent)
            if (this.check(TokenType.SEMICOLON) && this.peekAhead(1)?.type === TokenType.ENDIF) {
                this.advance(); // Consommer ';'
            }
            this.expect(TokenType.ENDIF, '"finsi" attendu à la fin du bloc si');
        }
        return {
            type: NodeType.IF_STATEMENT,
            children: [
                condition,
                thenStatement,
                ...(elseStatement ? [elseStatement] : []),
            ],
            token: ifToken,
        };
    }
    parseWhileStatement() {
        const whileToken = this.advance(); // Consommer 'tantque'
        const condition = this.parseExpression();
        this.expect(TokenType.DO, '"faire" attendu après la condition du tantque');
        // Parser le corps de la boucle
        const bodyStatements = [];
        // Tant qu'on ne trouve pas fintantque, on ajoute les instructions
        while (!this.check(TokenType.ENDWHILE) &&
            !this.check(TokenType.END) &&
            !this.isAtEnd()) {
            const statement = this.parseStatement();
            bodyStatements.push(statement);
            // Vérifier s'il y a un point-virgule après l'instruction
            if (this.check(TokenType.SEMICOLON)) {
                this.advance();
            }
        }
        // Consommer le fintantque obligatoire
        this.expect(TokenType.ENDWHILE, '"fintantque" attendu à la fin de la boucle tantque');
        return {
            type: NodeType.WHILE_STATEMENT,
            children: [
                condition,
                { type: NodeType.COMPOUND_STATEMENT, children: bodyStatements },
            ],
            token: whileToken,
        };
    }
    parseForStatement() {
        const forToken = this.advance(); // Consommer 'pour'
        const variable = this.expect(TokenType.IDENTIFIER, 'Identificateur attendu après "pour"');
        let startValue;
        if (this.check(TokenType.ALLANT)) {
            this.advance(); // Consommer 'allant'
            this.expect(TokenType.DE, '"de" attendu après "allant" dans la boucle pour');
            startValue = this.parseExpression();
        }
        else if (this.check(TokenType.ASSIGN)) {
            this.advance(); // Consommer ':='
            startValue = this.parseExpression();
        }
        else {
            throw new Error('"allant de" ou ":=" attendu après la variable dans la boucle pour');
        }
        this.expect(TokenType.TO, '"a" attendu dans la boucle pour');
        const endValue = this.parseExpression();
        this.expect(TokenType.DO, '"faire" attendu dans la boucle pour');
        // Parser le corps de la boucle
        const bodyStatements = [];
        // Tant qu'on ne trouve pas finpour, on ajoute les instructions
        while (!this.check(TokenType.ENDFOR) &&
            !this.check(TokenType.END) &&
            !this.isAtEnd()) {
            const statement = this.parseStatement();
            bodyStatements.push(statement);
            // Vérifier s'il y a un point-virgule après l'instruction
            if (this.check(TokenType.SEMICOLON)) {
                this.advance();
            }
        }
        // Consommer le finpour obligatoire
        this.expect(TokenType.ENDFOR, '"finpour" attendu à la fin de la boucle pour');
        return {
            type: NodeType.FOR_STATEMENT,
            children: [
                { type: NodeType.VARIABLE, value: variable.value, token: variable },
                startValue,
                endValue,
                { type: NodeType.COMPOUND_STATEMENT, children: bodyStatements },
            ],
            token: forToken,
        };
    }
    parseReadStatement() {
        const readToken = this.advance(); // Consommer 'lire'
        this.expect(TokenType.LEFT_PAREN, 'Parenthèse ouvrante attendue après "lire"');
        let variable;
        // Vérifier si on a un identificateur ou un mot-clé réservé
        if (this.check(TokenType.IDENTIFIER)) {
            variable = this.advance();
        }
        else {
            // Vérifier si c'est un mot-clé réservé
            const currentToken = this.peek();
            if (this.isKeywordToken(currentToken.type)) {
                variable = this.advance(); // Consommer le mot-clé
                this.createReservedKeywordError(variable.value, variable);
            }
            else {
                // Erreur normale - pas un identificateur
                this.expect(TokenType.IDENTIFIER, 'Variable attendue dans "lire"');
                throw new Error('Variable attendue dans "lire"');
            }
        }
        this.expect(TokenType.RIGHT_PAREN, 'Parenthèse fermante attendue dans "lire"');
        return {
            type: NodeType.READ_STATEMENT,
            children: [
                { type: NodeType.VARIABLE, value: variable.value, token: variable },
            ],
            token: readToken,
        };
    }
    parseWriteStatement() {
        const writeToken = this.advance(); // Consommer 'ecrire'
        this.expect(TokenType.LEFT_PAREN, 'Parenthèse ouvrante attendue après "ecrire"');
        const expressions = [];
        // Parser la première expression
        expressions.push(this.parseExpression());
        // Parser les expressions supplémentaires séparées par des virgules
        while (this.check(TokenType.COMMA)) {
            this.advance(); // Consommer la virgule
            expressions.push(this.parseExpression());
        }
        this.expect(TokenType.RIGHT_PAREN, 'Parenthèse fermante attendue dans "ecrire"');
        return {
            type: NodeType.WRITE_STATEMENT,
            children: expressions,
            token: writeToken,
        };
    }
    parseAssignment() {
        let variable;
        // Vérifier si on a un identificateur ou un mot-clé réservé
        if (this.check(TokenType.IDENTIFIER)) {
            variable = this.advance();
        }
        else {
            // Vérifier si c'est un mot-clé réservé
            const currentToken = this.peek();
            if (this.isKeywordToken(currentToken.type)) {
                variable = this.advance(); // Consommer le mot-clé
                this.createReservedKeywordError(variable.value, variable);
            }
            else {
                // Erreur normale - pas un identificateur
                this.expect(TokenType.IDENTIFIER, "Variable attendue dans l'affectation");
                throw new Error("Variable attendue dans l'affectation");
            }
        }
        // Vérifier si la variable est un mot-clé réservé (au cas où)
        if (this.isReservedKeyword(variable.value)) {
            this.createReservedKeywordError(variable.value, variable);
        }
        this.expect(TokenType.ASSIGN, '":=" attendu dans l\'affectation');
        const expression = this.parseExpression();
        return {
            type: NodeType.ASSIGNMENT,
            children: [
                { type: NodeType.VARIABLE, value: variable.value, token: variable },
                expression,
            ],
            token: variable,
        };
    }
    parseExpression() {
        return this.parseOrExpression();
    }
    parseOrExpression() {
        let left = this.parseAndExpression();
        while (this.check(TokenType.OR)) {
            const operator = this.advance();
            const right = this.parseAndExpression();
            left = {
                type: NodeType.BINARY_OP,
                value: operator.value,
                children: [left, right],
                token: operator,
            };
        }
        return left;
    }
    parseAndExpression() {
        let left = this.parseEqualityExpression();
        while (this.check(TokenType.AND)) {
            const operator = this.advance();
            const right = this.parseEqualityExpression();
            left = {
                type: NodeType.BINARY_OP,
                value: operator.value,
                children: [left, right],
                token: operator,
            };
        }
        return left;
    }
    parseEqualityExpression() {
        let left = this.parseRelationalExpression();
        while (this.check([TokenType.EQUAL, TokenType.NOT_EQUAL])) {
            const operator = this.advance();
            const right = this.parseRelationalExpression();
            left = {
                type: NodeType.BINARY_OP,
                value: operator.value,
                children: [left, right],
                token: operator,
            };
        }
        return left;
    }
    parseRelationalExpression() {
        let left = this.parseAdditiveExpression();
        while (this.check([
            TokenType.LESS_THAN,
            TokenType.LESS_EQUAL,
            TokenType.GREATER_THAN,
            TokenType.GREATER_EQUAL,
        ])) {
            const operator = this.advance();
            const right = this.parseAdditiveExpression();
            left = {
                type: NodeType.BINARY_OP,
                value: operator.value,
                children: [left, right],
                token: operator,
            };
        }
        return left;
    }
    parseAdditiveExpression() {
        let left = this.parseMultiplicativeExpression();
        while (this.check([TokenType.PLUS, TokenType.MINUS])) {
            const operator = this.advance();
            const right = this.parseMultiplicativeExpression();
            left = {
                type: NodeType.BINARY_OP,
                value: operator.value,
                children: [left, right],
                token: operator,
            };
        }
        return left;
    }
    parseMultiplicativeExpression() {
        let left = this.parseUnaryExpression();
        while (this.check([TokenType.MULTIPLY, TokenType.DIVIDE])) {
            const operator = this.advance();
            const right = this.parseUnaryExpression();
            left = {
                type: NodeType.BINARY_OP,
                value: operator.value,
                children: [left, right],
                token: operator,
            };
        }
        return left;
    }
    parseUnaryExpression() {
        // Vérifier si TokenType.NOT est utilisé comme variable de préférence à l'opérateur unaire
        if (this.check(TokenType.NOT)) {
            const nextToken = this.peekAhead();
            // Si le token suivant est ), ;, ,, ou EOF, alors c'est probablement une variable, pas un opérateur unaire
            if (nextToken &&
                [
                    TokenType.RIGHT_PAREN,
                    TokenType.SEMICOLON,
                    TokenType.COMMA,
                    TokenType.EOF,
                ].includes(nextToken.type)) {
                return this.parsePrimary(); // Laisser parsePrimary gérer le mot-clé réservé
            }
        }
        if (this.check([TokenType.NOT, TokenType.MINUS])) {
            const operator = this.advance();
            const operand = this.parseUnaryExpression();
            return {
                type: NodeType.UNARY_OP,
                value: operator.value,
                children: [operand],
                token: operator,
            };
        }
        return this.parsePrimary();
    }
    parsePrimary() {
        if (this.check(TokenType.NUMBER)) {
            const token = this.advance();
            return {
                type: NodeType.LITERAL,
                value: parseFloat(token.value),
                token,
            };
        }
        if (this.check([TokenType.TRUE, TokenType.FALSE])) {
            const token = this.advance();
            return {
                type: NodeType.LITERAL,
                value: token.value === "vrai",
                token,
            };
        }
        if (this.check(TokenType.STRING_LITERAL)) {
            const token = this.advance();
            return {
                type: NodeType.LITERAL,
                value: token.value,
                token,
            };
        }
        if (this.check(TokenType.IDENTIFIER)) {
            const token = this.advance();
            // Vérifier si l'identificateur est un mot-clé réservé
            if (this.isReservedKeyword(token.value)) {
                this.createReservedKeywordError(token.value, token);
            }
            return {
                type: NodeType.VARIABLE,
                value: token.value,
                token,
            };
        }
        // Vérifier si c'est un mot-clé réservé utilisé comme variable
        const currentToken = this.peek();
        if (this.isKeywordToken(currentToken.type)) {
            const token = this.advance(); // Consommer le mot-clé
            this.createReservedKeywordError(token.value, token);
            return {
                type: NodeType.VARIABLE,
                value: token.value,
                token,
            };
        }
        if (this.check(TokenType.LEFT_PAREN)) {
            this.advance(); // Consommer '('
            const expression = this.parseExpression();
            this.expect(TokenType.RIGHT_PAREN, "Parenthèse fermante attendue");
            return expression;
        }
        const token = this.peek();
        this.errors.push({
            type: "ERROR",
            message: `Expression inattendue: ${token.value}`,
            line: token.line,
            column: token.column,
            position: token.position,
            code: "UNEXPECTED_TOKEN",
        });
        this.advance();
        return {
            type: NodeType.LITERAL,
            value: 0,
        };
    }
    parseRepeatStatement() {
        const repeatToken = this.advance(); // Consommer 'repeter'
        const statements = [];
        // Parser les instructions du corps de la boucle
        while (!this.check(TokenType.UNTIL) && !this.isAtEnd()) {
            const statement = this.parseStatement();
            statements.push(statement);
            // Sauter les points-virgules après les instructions
            if (this.check(TokenType.SEMICOLON)) {
                this.advance();
            }
        }
        this.expect(TokenType.UNTIL, '"jusqua" attendu à la fin de la boucle repeter');
        // Parser la condition
        const condition = this.parseExpression();
        return {
            type: NodeType.REPEAT_STATEMENT,
            children: [...statements, condition],
            token: repeatToken,
        };
    }
    // Méthodes utilitaires
    check(type) {
        if (this.isAtEnd())
            return false;
        if (Array.isArray(type)) {
            return type.includes(this.peek().type);
        }
        return this.peek().type === type;
    }
    advance() {
        if (!this.isAtEnd())
            this.current++;
        return this.previous();
    }
    isAtEnd() {
        return this.peek().type === "EOF";
    }
    peek() {
        return (this.tokens[this.current] ?? {
            type: TokenType.EOF,
            value: "",
            line: 0,
            column: 0,
            position: 0,
        });
    }
    peekAhead(offset = 1) {
        return this.tokens[this.current + offset];
    }
    previous() {
        return (this.tokens[this.current - 1] ?? {
            type: TokenType.EOF,
            value: "",
            line: 0,
            column: 0,
            position: 0,
        });
    }
    expect(type, message) {
        if (this.check(type)) {
            return this.advance();
        }
        const token = this.peek();
        this.errors.push({
            type: "ERROR",
            message,
            line: token.line,
            column: token.column,
            position: token.position,
            code: "EXPECTED_TOKEN",
            explanation: `Attendu: ${Array.isArray(type) ? type.join(" ou ") : type}, Trouvé: ${token.type}`,
            suggestion: "Vérifiez la syntaxe de votre programme",
        });
        throw new Error(message);
    }
    tokenTypeToDataType(tokenType) {
        switch (tokenType) {
            case TokenType.INTEGER:
                return DataType.INTEGER;
            case TokenType.REAL:
                return DataType.REAL;
            case TokenType.BOOLEAN:
                return DataType.BOOLEAN;
            case TokenType.STRING:
                return DataType.STRING;
            default:
                return DataType.VOID;
        }
    }
}
//# sourceMappingURL=parser.js.map