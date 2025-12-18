# Lexical Analysis

## Overview
Processus d'analyse lexicale transformant le code source AlgoLang en flux de tokens pour l'analyse syntaxique.

## Lexical Analyzer Architecture

### Input Processing
```algolang
// Source code input
programme ExempleLexical
  variables
    compteur: entier := 0
    message: chaîne := "Bonjour monde!"
  fin variables
début
  tant que compteur < 10 faire
    écrire message
    compteur := compteur + 1
  fin tant que
fin programme
```

### Character Stream Processing
```yaml
character_stream:
  - char: 'p', line: 1, col: 1
  - char: 'r', line: 1, col: 2
  - char: 'o', line: 1, col: 3
  - char: 'g', line: 1, col: 4
  # ... continues for entire source
```

## Token Recognition

### Token Types Definition
```yaml
token_types:
  KEYWORDS:
    - programme, variables, début, fin, si, alors, sinon
    - tant, que, faire, pour, de, à, procédure, fonction
    - entier, réel, booléen, caractère, chaîne
    - tableau, liste, ensemble, et, ou, non, vrai, faux
    - lire, écrire, pas, retourner
  
  IDENTIFIERS:
    pattern: '[a-zA-Zà-ÿ][a-zA-Zà-ÿ0-9_]*'
    examples: ['compteur', 'message', 'calculerSomme']
  
  LITERALS:
    INTEGER: '[0-9]+'
    REAL: '[0-9]+\.[0-9]+'
    STRING: '"[^"]*"'
    CHARACTER: "'[^]'"
    BOOLEAN: 'vrai|faux'
  
  OPERATORS:
    ASSIGNMENT: ':='
    ARITHMETIC: ['+', '-', '*', '/', '%', '^']
    COMPARISON: ['=', '≠', '<', '≤', '>', '≥']
    LOGICAL: ['et', 'ou', 'non']
  
  DELIMITERS:
    - '(', ')', '[', ']', '{', '}'
    - ';', ',', '.', ':'
  
  WHITESPACE:
    - space, tab, newline, carriage_return
  
  COMMENTS:
    SINGLE_LINE: '//.*$'
    MULTI_LINE: '/\*[\s\S]*?\*/'
```

### Token Generation Process
```python
class Token:
    def __init__(self, type, value, line, column):
        self.type = type
        self.value = value
        self.line = line
        self.column = column

def tokenize(source_code):
    tokens = []
    line = 1
    column = 1
    i = 0
    
    while i < len(source_code):
        char = source_code[i]
        
        # Skip whitespace
        if char.isspace():
            if char == '\n':
                line += 1
                column = 1
            else:
                column += 1
            i += 1
            continue
        
        # Check for keywords and identifiers
        if char.isalpha() or char in 'àâäãåāæçèéêëēėęîïíīįìôöòóœøōõßùûüúūÿý':
            word = read_word(source_code, i)
            if word in KEYWORDS:
                tokens.append(Token('KEYWORD', word, line, column))
            else:
                tokens.append(Token('IDENTIFIER', word, line, column))
            i += len(word)
            column += len(word)
            continue
        
        # Check for numbers
        if char.isdigit():
            number = read_number(source_code, i)
            if '.' in number:
                tokens.append(Token('REAL', number, line, column))
            else:
                tokens.append(Token('INTEGER', number, line, column))
            i += len(number)
            column += len(number)
            continue
        
        # Check for strings
        if char == '"':
            string = read_string(source_code, i)
            tokens.append(Token('STRING', string, line, column))
            i += len(string)
            column += len(string)
            continue
        
        # Check for operators
        # ... additional token recognition logic
```

## Token Output Example

### Complete Token Stream
```yaml
token_stream:
  - type: KEYWORD, value: "programme", line: 1, col: 1
  - type: IDENTIFIER, value: "ExempleLexical", line: 1, col: 10
  - type: KEYWORD, value: "variables", line: 2, col: 3
  - type: IDENTIFIER, value: "compteur", line: 3, col: 5
  - type: OPERATOR, value: ":", line: 3, col: 13
  - type: KEYWORD, value: "entier", line: 3, col: 15
  - type: OPERATOR, value: ":=", line: 3, col: 21
  - type: INTEGER, value: "0", line: 3, col: 24
  - type: IDENTIFIER, value: "message", line: 4, col: 5
  - type: OPERATOR, value: ":", line: 4, col: 12
  - type: KEYWORD, value: "chaîne", line: 4, col: 14
  - type: OPERATOR, value: ":=", line: 4, col: 20
  - type: STRING, value: "\"Bonjour monde!\"", line: 4, col: 23
  - type: KEYWORD, value: "fin", line: 5, col: 3
  - type: KEYWORD, value: "variables", line: 5, col: 7
  - type: KEYWORD, value: "début", line: 6, col: 1
  - type: KEYWORD, value: "tant", line: 7, col: 3
  - type: KEYWORD, value: "que", line: 7, col: 8
  - type: IDENTIFIER, value: "compteur", line: 7, col: 12
  - type: OPERATOR, value: "<", line: 7, col: 21
  - type: INTEGER, value: "10", line: 7, col: 23
  - type: KEYWORD, value: "faire", line: 7, col: 26
  - type: KEYWORD, value: "écrire", line: 8, col: 5
  - type: IDENTIFIER, value: "message", line: 8, col: 12
  - type: IDENTIFIER, value: "compteur", line: 9, col: 5
  - type: OPERATOR, value: ":=", line: 9, col: 14
  - type: IDENTIFIER, value: "compteur", line: 9, col: 17
  - type: OPERATOR, value: "+", line: 9, col: 26
  - type: INTEGER, value: "1", line: 9, col: 28
  - type: KEYWORD, value: "fin", line: 10, col: 3
  - type: KEYWORD, value: "tant", line: 10, col: 7
  - type: KEYWORD, value: "que", line: 10, col: 12
  - type: KEYWORD, value: "fin", line: 11, col: 1
  - type: KEYWORD, value: "programme", line: 11, col: 5
```

## Error Detection and Recovery

### Lexical Error Types
```yaml
lexical_errors:
  invalid_character:
    example: "x := 5 @ 3"  # @ is not valid
    message: "Caractère invalide '@' à la ligne 1, colonne 8"
    recovery: "Skip character and continue"
  
  malformed_number:
    example: "x := 12.34.56"  # Multiple decimal points
    message: "Nombre mal formé '12.34.56' à la ligne 1, colonne 7"
    recovery: "Treat as two separate numbers"
  
  unclosed_string:
    example: 'message := "Bonjour monde'  # Missing closing quote
    message: "Chaîne non fermée débutant à la ligne 1, colonne 12"
    recovery: "Assume string ends at line end"
  
  invalid_identifier:
    example: "123variable := 5"  # Starts with digit
    message: "Identifiant invalide '123variable' à la ligne 1, colonne 1"
    recovery: "Treat as separate tokens"
```

### Error Recovery Strategies
```python
def handle_lexical_error(error_type, position, context):
    if error_type == "invalid_character":
        # Skip the invalid character and continue
        return position + 1
    
    elif error_type == "malformed_number":
        # Read until next valid character
        return skip_to_next_valid_char(position)
    
    elif error_type == "unclosed_string":
        # Close string at end of line
        return find_end_of_line(position)
    
    elif error_type == "invalid_identifier":
        # Split into valid tokens
        return split_into_valid_tokens(position)
```

## Performance Optimizations

### Buffer Management
```yaml
optimizations:
  double_buffering:
    description: "Read ahead while processing current buffer"
    benefit: "Reduces I/O wait time"
  
  string_interning:
    description: "Share identical string literals in memory"
    benefit: "Reduces memory usage for repeated identifiers"
  
  token_lookahead:
    description: "Pre-tokenize common patterns"
    benefit: "Faster recognition of frequent tokens"
```

### Memory Efficiency
```python
class TokenPool:
    def __init__(self):
        self.keyword_tokens = {}
        self.identifier_pool = []
        self.literal_pool = []
    
    def get_keyword_token(self, keyword):
        if keyword not in self.keyword_tokens:
            self.keyword_tokens[keyword] = Token('KEYWORD', keyword)
        return self.keyword_tokens[keyword]
    
    def intern_string(self, string):
        if string not in self.identifier_pool:
            self.identifier_pool.append(string)
        return self.identifier_pool.index(string)
```

## Dependencies
- compilation-pipeline.md (pipeline global)
- syntax-analysis.md (phase suivante)
- error-handling-standards.md (gestion des erreurs)

## Educational Features

### Token Visualization
```yaml
visualization:
  color_coding:
    KEYWORDS: blue
    IDENTIFIERS: black
    LITERALS: green
    OPERATORS: red
    COMMENTS: gray
  
  interactive_display:
    - Hover over token for details
    - Click token to highlight in source
    - Step-by-step token generation
```

### Learning Mode
```yaml
learning_features:
  token_explanation:
    - "KEYWORD: Mot réservé du langage"
    - "IDENTIFIER: Nom choisi par le programmeur"
    - "LITERAL: Valeur constante"
    - "OPERATOR: Symbole d'opération"
  
  common_mistakes:
    - "Confondre := (assignation) et = (comparaison)"
    - "Oublier les guillemets pour les chaînes"
    - "Utiliser des caractères non valides dans les identifiants"
```

## Testing and Validation

### Test Cases
```yaml
test_cases:
  valid_programs:
    - simple_variables
    - control_structures
    - function_definitions
    - complex_expressions
  
  error_cases:
    - invalid_characters
    - malformed_numbers
    - unclosed_strings
    - invalid_identifiers
  
  edge_cases:
    - very_long_identifiers
    - deeply_nested_comments
    - unicode_characters
    - empty_program
```

## Metrics
- Tokens/second: > 50,000 for typical source files
- Memory usage: < 10MB for 10,000 line program
- Error recovery: 95% success rate
- Accuracy: 99.9% correct tokenization