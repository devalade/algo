# Syntax Analysis

## Overview
Processus d'analyse syntaxique vérifiant la structure grammaticale du code AlgoLang et construisant l'arbre syntaxique abstrait (AST).

## Parser Architecture

### Grammar Foundation
```ebnf
<program> ::= 'programme' <identifier> <declaration_section> 
             { <subprogram> } <main_block>

<declaration_section> ::= [ 'variables' <variable_declaration_list> 'fin' 'variables' ]

<variable_declaration_list> ::= <variable_declaration> { ';' <variable_declaration> }

<variable_declaration> ::= <identifier_list> ':' <type>

<statement> ::= <assignment_statement> 
              | <procedure_call>
              | <if_statement>
              | <while_statement>
              | <for_statement>
              | <read_statement>
              | <write_statement>
              | <compound_statement>
```

### Recursive Descent Parser Structure
```python
class AlgoLangParser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.current = 0
        self.errors = []
    
    def parse(self):
        try:
            return self.program()
        except ParseError as e:
            self.errors.append(e)
            return None
    
    def program(self):
        self.consume('KEYWORD', 'programme')
        name = self.consume('IDENTIFIER')
        declarations = self.declaration_section()
        subprograms = []
        while self.check('KEYWORD', ['procédure', 'fonction']):
            subprograms.append(self.subprogram())
        main_block = self.main_block()
        return ProgramNode(name, declarations, subprograms, main_block)
```

## AST Node Types

### Program Structure Nodes
```python
class ProgramNode:
    def __init__(self, name, declarations, subprograms, main_block):
        self.name = name
        self.declarations = declarations
        self.subprograms = subprograms
        self.main_block = main_block

class VariableDeclarationNode:
    def __init__(self, identifiers, type_node):
        self.identifiers = identifiers
        self.type_node = type_node

class TypeNode:
    def __init__(self, base_type, dimensions=None):
        self.base_type = base_type
        self.dimensions = dimensions  # For arrays
```

### Statement Nodes
```python
class AssignmentNode:
    def __init__(self, identifier, expression):
        self.identifier = identifier
        self.expression = expression

class IfNode:
    def __init__(self, condition, then_statement, else_statement=None):
        self.condition = condition
        self.then_statement = then_statement
        self.else_statement = else_statement

class WhileNode:
    def __init__(self, condition, body):
        self.condition = condition
        self.body = body

class ForNode:
    def __init__(self, variable, start, end, step, body):
        self.variable = variable
        self.start = start
        self.end = end
        self.step = step
        self.body = body
```

### Expression Nodes
```python
class BinaryOpNode:
    def __init__(self, left, operator, right):
        self.left = left
        self.operator = operator
        self.right = right

class UnaryOpNode:
    def __init__(self, operator, operand):
        self.operator = operator
        self.operand = operand

class LiteralNode:
    def __init__(self, value, type):
        self.value = value
        self.type = type

class IdentifierNode:
    def __init__(self, name):
        self.name = name
```

## Parsing Process Example

### Input Code
```algolang
programme CalculFactoriel
  variables
    n: entier
    résultat: entier
    i: entier
  fin variables
  
début
  lire n
  résultat := 1
  pour i de 1 à n faire
    résultat := résultat * i
  fin pour
  écrire "Factoriel: " + résultat
fin programme
```

### Token Stream Input
```yaml
tokens:
  - KEYWORD:programme
  - IDENTIFIER:CalculFactoriel
  - KEYWORD:variables
  - IDENTIFIER:n
  - OPERATOR::
  - KEYWORD:entier
  - IDENTIFIER:résultat
  - OPERATOR::
  - KEYWORD:entier
  # ... more tokens
```

### AST Construction
```yaml
ast:
  type: Program
  name: "CalculFactoriel"
  declarations:
    type: VariableDeclarations
    variables:
      - name: "n", type: "entier"
      - name: "résultat", type: "entier"
      - name: "i", type: "entier"
  main_block:
    type: CompoundStatement
    statements:
      - type: ReadStatement
        variable: "n"
      
      - type: AssignmentStatement
        variable: "résultat"
        expression:
          type: Literal
          value: 1
          data_type: "entier"
      
      - type: ForStatement
        variable: "i"
        start:
          type: Literal
          value: 1
        end:
          type: Identifier
          name: "n"
        step: null
        body:
          type: AssignmentStatement
          variable: "résultat"
          expression:
            type: BinaryOp
            operator: "*"
            left:
              type: Identifier
              name: "résultat"
            right:
              type: Identifier
              name: "i"
      
      - type: WriteStatement
        expression:
          type: BinaryOp
          operator: "+"
          left:
            type: Literal
            value: "Factoriel: "
            data_type: "chaîne"
          right:
            type: Identifier
            name: "résultat"
```

## Error Detection and Recovery

### Syntax Error Types
```yaml
syntax_errors:
  missing_keyword:
    example: "x := 5"  // Missing 'variables' declaration
    message: "Mot-clé 'variables' attendu à la ligne 1"
    recovery: "Insert missing keyword"
  
  unexpected_token:
    example: "si x alors ; fin si"  // Semicolon not allowed
    message: "Token ';' inattendu dans une condition si"
    recovery: "Skip semicolon and continue"
  
  unbalanced_delimiters:
    example: "pour i de 1 à 10 faire"  // Missing 'fin pour'
    message: "Delimiteur 'fin pour' manquant"
    recovery: "Insert missing delimiter at end of block"
  
  invalid_statement_sequence:
    example: "lire x écrire y"  // Missing separator
    message: "Séparateur ';' attendu entre les instructions"
    recovery: "Insert semicolon"
```

### Error Recovery Strategies
```python
class ParseErrorRecovery:
    def synchronize(self):
        """Skip tokens until we find a synchronization point"""
        while not self.is_at_end():
            if self.previous().type == 'SEMICOLON':
                return
            
            if self.peek().type == 'KEYWORD' and self.peek().value in [
                'si', 'tant', 'pour', 'lire', 'écrire', 'fin'
            ]:
                return
            
            self.advance()
    
    def recover_from_missing_delimiter(self, expected_delimiter):
        """Insert missing delimiter and continue parsing"""
        self.errors.append(f"Delimiteur '{expected_delimiter}' manquant")
        # Continue as if delimiter was present
        return True
```

## Parser Implementation Details

### Lookahead Mechanism
```python
class Parser:
    def peek(self, ahead=1):
        return self.tokens[self.current + ahead] if self.current + ahead < len(self.tokens) else None
    
    def check(self, token_type, value=None):
        token = self.peek()
        if token and token.type == token_type:
            if value is None or token.value == value:
                return True
        return False
    
    def match(self, token_type, value=None):
        if self.check(token_type, value):
            return self.advance()
        return None
    
    def consume(self, token_type, value=None):
        token = self.match(token_type, value)
        if token:
            return token
        
        raise ParseError(f"Token {token_type} attendu, trouvé {self.peek().type}")
```

### Operator Precedence Parsing
```python
class ExpressionParser:
    def parse_expression(self):
        return self.parse_logical_or()
    
    def parse_logical_or(self):
        expr = self.parse_logical_and()
        
        while self.match('KEYWORD', 'ou'):
            operator = self.previous()
            right = self.parse_logical_and()
            expr = BinaryOpNode(expr, operator, right)
        
        return expr
    
    def parse_logical_and(self):
        expr = parse_equality()
        
        while self.match('KEYWORD', 'et'):
            operator = self.previous()
            right = parse_equality()
            expr = BinaryOpNode(expr, operator, right)
        
        return expr
    
    def parse_equality(self):
        expr = parse_comparison()
        
        while self.match('OPERATOR', ['=', '≠']):
            operator = self.previous()
            right = parse_comparison()
            expr = BinaryOpNode(expr, operator, right)
        
        return expr
```

## Dependencies
- compilation-pipeline.md (pipeline global)
- lexical-analysis.md (tokens en entrée)
- semantic-rules.md (phase suivante)
- grammar-formal.md (définition formelle)

## Educational Features

### AST Visualization
```yaml
visualization:
  tree_display:
    - Interactive tree structure
    - Color-coded node types
    - Expandable/collapsible branches
    - Hover information for each node
  
  step_by_step_parsing:
    - Show current token being processed
    - Highlight production rule being applied
    - Display partial AST construction
    - Explain parser decisions
```

### Learning Mode
```yaml
learning_features:
  grammar_explanation:
    - "Chaque règle montre comment les tokens sont groupés"
    - "L'arbre représente la structure hiérarchique du programme"
    - "Les nœuds internes sont des opérations, les feuilles sont des valeurs"
  
  common_syntax_errors:
    - "Oublier 'fin' après un bloc"
    - "Utiliser ':' au lieu de ':=' pour l'assignation"
    - "Mauvais ordre des déclarations"
```

## Performance Metrics

### Parser Efficiency
```yaml
performance:
  time_complexity: O(n) where n = number of tokens
  space_complexity: O(n) for AST storage
  parsing_speed: > 10,000 tokens/second
  memory_usage: < 20MB for typical programs
```

### Error Recovery Success
```yaml
recovery_metrics:
  single_error_recovery: 95% success
  multiple_error_recovery: 80% success
  cascade_prevention: 90% success
  meaningful_error_messages: 85% success
```

## Testing Framework

### Test Cases
```yaml
test_categories:
  valid_programs:
    - minimal_program
    - variable_declarations
    - control_structures
    - function_definitions
    - nested_structures
  
  syntax_errors:
    - missing_keywords
    - unbalanced_delimiters
    - invalid_sequences
    - malformed_expressions
  
  edge_cases:
    - deeply_nested_blocks
    - complex_expressions
    - empty_programs
    - maximum_nesting_depth
```