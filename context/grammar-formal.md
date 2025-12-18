# Grammar Formal

## Overview
Définition formelle de la grammaire AlgoLang en notation BNF/EBNF pour l'implémentation du compilateur.

## BNF Notation Conventions
- `::=` définition
- `|` alternative
- `[]` optionnel (0 ou 1)
- `{}` répétition (0 ou plus)
- `()` groupement
- `*` Kleene star (0 ou plus)
- `+` Kleene plus (1 ou plus)

## Lexical Grammar

### Tokens
```bnf
<identifier> ::= <letter> { <letter> | <digit> | '_' }
<letter> ::= 'A'..'Z' | 'a'..'z' | 'à'..'ÿ'
<digit> ::= '0'..'9'
<string_literal> ::= '"' { <character> } '"'
<number> ::= <integer> | <real>
<integer> ::= <digit> { <digit> }
<real> ::= <integer> '.' <integer>
```

### Keywords
```bnf
<keyword> ::= 'programme' | 'variables' | 'début' | 'fin' | 'si' | 'alors' 
            | 'sinon' | 'tant' | 'que' | 'faire' | 'pour' | 'de' | 'à'
            | 'procédure' | 'fonction' | 'retourner' | 'entier' | 'réel'
            | 'booléen' | 'caractère' | 'chaîne' | 'tableau' | 'liste'
            | 'ensemble' | 'et' | 'ou' | 'non' | 'vrai' | 'faux'
            | 'lire' | 'écrire' | 'pas'
```

## Syntactic Grammar

### Program Structure
```ebnf
<program> ::= 'programme' <identifier> <declaration_section> 
             { <subprogram> } <main_block>

<declaration_section> ::= [ 'variables' <variable_declaration_list> 'fin' 'variables' ]

<variable_declaration_list> ::= <variable_declaration> { ';' <variable_declaration> }

<variable_declaration> ::= <identifier_list> ':' <type>

<identifier_list> ::= <identifier> { ',' <identifier> }
```

### Types
```ebnf
<type> ::= <primitive_type> | <array_type> | <list_type> | <set_type>

<primitive_type> ::= 'entier' | 'réel' | 'booléen' | 'caractère' | 'chaîne'

<array_type> ::= 'tableau' '[' <expression> ']' 'de' <type>

<list_type> ::= 'liste' 'de' <type>

<set_type> ::= 'ensemble' 'de' <type>
```

### Statements
```ebnf
<statement> ::= <assignment_statement> 
              | <procedure_call>
              | <if_statement>
              | <while_statement>
              | <for_statement>
              | <read_statement>
              | <write_statement>
              | <compound_statement>

<compound_statement> ::= 'début' <statement_list> 'fin'

<statement_list> ::= <statement> { ';' <statement> }
```

### Assignment and Expressions
```ebnf
<assignment_statement> ::= <identifier> ':=' <expression>

<expression> ::= <logical_expression>

<logical_expression> ::= <relational_expression> 
                        { ('et' | 'ou') <relational_expression> }

<relational_expression> ::= <additive_expression> 
                          { ('=' | '≠' | '<' | '≤' | '>' | '≥') <additive_expression> }

<additive_expression> ::= <multiplicative_expression> 
                         { ('+' | '-') <multiplicative_expression> }

<multiplicative_expression> ::= <unary_expression> 
                               { ('*' | '/' | '%') <unary_expression> }

<unary_expression> ::= [ '+' | '-' | 'non' ] <primary_expression>

<primary_expression> ::= <identifier> 
                        | <literal> 
                        | '(' <expression> ')' 
                        | <function_call>
```

### Control Structures
```ebnf
<if_statement> ::= 'si' <expression> 'alors' <statement>
                  [ 'sinon' 'si' <expression> 'alors' <statement> ]
                  [ 'sinon' <statement> ]
                  'fin' 'si'

<while_statement> ::= 'tant' 'que' <expression> 'faire' <statement> 'fin' 'tant' 'que'

<for_statement> ::= 'pour' <identifier> 'de' <expression> 'à' <expression>
                   [ 'pas' <expression> ] 'faire' <statement> 'fin' 'pour'
```

### Subprograms
```ebnf
<subprogram> ::= <procedure_declaration> | <function_declaration>

<procedure_declaration> ::= 'procédure' <identifier> '(' [ <parameter_list> ] ')'
                           <declaration_section> <compound_statement>

<function_declaration> ::= 'fonction' <identifier> '(' [ <parameter_list> ] ')'
                           ':' <type> <declaration_section> <compound_statement>

<parameter_list> ::= <parameter> { ';' <parameter> }

<parameter> ::= [ 'var' ] <identifier> ':' <type>
```

### Input/Output
```ebnf
<read_statement> ::= 'lire' <identifier>

<write_statement> ::= 'écrire' <expression> [ ',' <expression> ]
```

## Semantic Constraints

### Type Rules
- All variables must be declared before use
- Type compatibility enforced in assignments
- Function return type must match declared type
- Array indices must be integer expressions

### Scope Rules
- Variables have block scope
- Function parameters have function scope
- Global variables accessible throughout program

## Dependencies
- algolang-specification.md (définition du langage)
- syntax-reference.md (exemples syntaxiques)

## Implementation Notes
- Grammar is LL(1) for recursive descent parsing
- No left recursion in productions
- Clear separation between lexical and syntactic analysis
- Suitable for educational compiler construction