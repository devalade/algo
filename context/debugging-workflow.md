# Debugging Workflow

## Overview
Workflow de débogage pédagogique intégré à AlgoLang pour aider les étudiants à comprendre et corriger leurs erreurs de programmation.

## Debugging Philosophy

### Educational Principles
```yaml
principles:
  learning_oriented:
    - Focus on understanding rather than just fixing
    - Explain why errors occur
    - Provide hints before solutions
    - Encourage self-discovery
  
  progressive_assistance:
    - Level 1: Error detection and location
    - Level 2: Error explanation
    - Level 3: Suggested fixes
    - Level 4: Complete solution (last resort)
  
  constructive_feedback:
    - Positive reinforcement for correct code
    - Clear, non-judgmental error messages
    - Encouragement to try again
```

### Debugging Interface
```yaml
interface_components:
  source_editor:
    - Syntax highlighting
    - Error indicators
    - Warning highlights
    - Breakpoint markers
  
  console_output:
    - Program output
    - Error messages
    - Debug information
    - Progress indicators
  
  variable_watcher:
    - Real-time variable values
    - Type information
    - Memory addresses
    - Change history
  
  call_stack:
    - Function call hierarchy
    - Parameter values
    - Return addresses
    - Local variables
```

## Error Detection System

### Compilation Errors
```yaml
compilation_errors:
  syntax_errors:
    detection: "During parsing phase"
    examples:
      - missing_delimiters
      - invalid_keywords
      - malformed_expressions
    educational_response:
      level_1: "Erreur de syntaxe à la ligne X"
      level_2: "Le mot-clé 'fin' est manquant"
      level_3: "Ajoutez 'fin si' après le bloc"
      level_4: "Code corrigé: si condition alors ... fin si"
  
  semantic_errors:
    detection: "During semantic analysis"
    examples:
      - type_mismatches
      - undeclared_variables
      - scope_violations
    educational_response:
      level_1: "Erreur de type à la ligne X"
      level_2: "Impossible d'ajouter une chaîne et un entier"
      level_3: "Convertissez l'entier en chaîne avec chaîne(valeur)"
      level_4: "message := \"Total: \" + chaîne(total)"
```

### Runtime Errors
```yaml
runtime_errors:
  division_by_zero:
    detection: "During execution"
    message: "Division par zéro à la ligne X"
    explanation: "Le dénominateur d'une division ne peut pas être zéro"
    suggestion: "Vérifiez que le dénominateur n'est pas zéro avant la division"
    example_fix: "si dénominateur ≠ 0 alors résultat := numérateur / dénominateur"
  
  array_bounds:
    detection: "During array access"
    message: "Index de tableau hors limites"
    explanation: "L'index 11 n'existe pas dans un tableau de taille 10"
    suggestion: "Vérifiez que l'index est entre 1 et la taille du tableau"
    example_fix: "si index ≥ 1 et index ≤ taille alors tableau[index]"
  
  stack_overflow:
    detection: "During function call"
    message: "Dépassement de la pile d'exécution"
    explanation: "Trop d'appels de fonction récursifs"
    suggestion: "Ajoutez une condition d'arrêt ou utilisez une itération"
    example_fix: "si n ≤ 1 alors retourner 1 sinon retourner n * factoriel(n-1)"
```

## Interactive Debugging Features

### Step-by-Step Execution
```yaml
step_execution:
  step_over:
    description: "Exécuter la ligne suivante sans entrer dans les fonctions"
    shortcut: "F10"
    use_case: "Quand vous voulez sauter l'exécution d'une fonction"
  
  step_into:
    description: "Entrer dans la fonction pour voir son exécution détaillée"
    shortcut: "F11"
    use_case: "Quand vous voulez comprendre comment une fonction fonctionne"
  
  step_out:
    description: "Sortir de la fonction actuelle"
    shortcut: "Shift+F11"
    use_case: "Quand vous voulez continuer après avoir inspecté une fonction"
  
  continue:
    description: "Exécuter jusqu'au prochain point d'arrêt"
    shortcut: "F5"
    use_case: "Quand vous voulez exécuter rapidement jusqu'à un point précis"
```

### Breakpoint Management
```yaml
breakpoints:
  line_breakpoint:
    type: "Conditional/Unconditional"
    setup: "Click on line number or press F9"
    features:
      - Enable/disable
      - Edit conditions
      - Hit count
      - Log message
  
  variable_breakpoint:
    type: "Watch/Read/Write"
    setup: "Right-click variable in watcher"
    features:
      - Break on value change
      - Break on specific value
      - Break on read access
      - Break on write access
  
  exception_breakpoint:
    type: "Runtime/Compilation"
    setup: "Configure in debug settings"
    features:
      - Break on specific exceptions
      - Break on all exceptions
      - Ignore first N occurrences
```

### Variable Inspection
```yaml
variable_inspection:
  basic_view:
    - Name and value
    - Data type
    - Memory address
    - Scope information
  
  advanced_view:
    - Change history
    - Dependencies
    - Format options (hex, binary, decimal)
    - Expression evaluation
  
  array_view:
    - Index navigation
    - Slice visualization
    - Search functionality
    - Export capabilities
```

## Educational Debugging Modes

### Learning Mode
```yaml
learning_mode:
  guided_debugging:
    description: "Assistant virtuel guide le débogage"
    features:
      - Suggests next debugging step
      - Explains error causes
      - Provides hints
      - Celebrates progress
  
  error_pattern_recognition:
    description: "Reconnaît les erreurs courantes des débutants"
    patterns:
      - off-by-one errors
      - infinite loops
      - type confusion
      - missing initialization
    interventions:
      - "Avez-vous vérifié les bornes de votre boucle?"
      - "Cette boucle pourrait ne jamais se terminer"
      - "Essayez d'initialiser cette variable"
  
  concept_explanation:
    description: "Explique les concepts informatiques liés aux erreurs"
    topics:
      - "Qu'est-ce qu'une variable?"
      - "Comment fonctionne la pile d'exécution?"
      - "Pourquoi les types sont-ils importants?"
      - "Qu'est-ce qu'un pointeur (dans d'autres langages)?"
```

### Challenge Mode
```yaml
challenge_mode:
  bug_hunting:
    description: "Trouvez et corrigez les bugs dans des programmes fournis"
    levels:
      - Débutant: Erreurs de syntaxe simples
      - Intermédiaire: Erreurs logiques
      - Avancé: Erreurs subtiles et complexes
    rewards:
      - Points de débogage
      - Badges d'accomplissement
      - Déblocage de nouveaux défis
  
  debugging_race:
    description: "Compétition pour trouver le plus rapidement les bugs"
    features:
      - Timer
      - Leaderboard
      - Multiplayer support
      - Different difficulty levels
```

## Error Message Templates

### Structured Error Messages
```yaml
error_message_structure:
  header:
    icon: "❌ Erreur"
    type: "Syntaxe/Sémantique/Exécution"
    location: "Ligne X, Colonne Y"
  
  problem:
    description: "Description claire et concise du problème"
    context: "Extrait du code avec l'erreur mise en évidence"
    visual: "Représentation visuelle de l'erreur"
  
  explanation:
    why: "Pourquoi cette erreur se produit"
    concept: "Concept informatique sous-jacent"
    analogy: "Analogie pour faciliter la compréhension"
  
  solution:
    hint: "Indice pour trouver la solution"
    approach: "Approche suggérée"
    example: "Exemple de code corrigé"
  
  learning:
    related_topics: "Sujets connexes à apprendre"
    practice_exercises: "Exercices pour pratiquer"
    further_reading: "Ressources supplémentaires"
```

### Example Error Messages
```yaml
example_messages:
  syntax_error:
    header: "❌ Erreur de syntaxe - Ligne 5, Colonne 12"
    problem: "Mot-clé 'alors' manquant après la condition"
    context: |
      si age >= 18
          écrire "Majeur"
      fin si
      ^
    explanation: |
      En AlgoLang, la structure conditionnelle requiert le mot-clé 'alors'
      après la condition pour séparer la condition des instructions.
    solution:
      hint: "Ajoutez le mot-clé 'alors' après la condition"
      example: |
        si age >= 18 alors
            écrire "Majeur"
        fin si
    learning:
      related_topics: ["Structures de contrôle", "Syntaxe AlgoLang"]
      practice_exercises: ["Exercices sur les conditions si/alors"]
  
  runtime_error:
    header: "❌ Erreur d'exécution - Division par zéro"
    problem: "Tentative de division par zéro à la ligne 12"
    context: |
      moyenne := total / nombre_étudiants
      ^ nombre_étudiants = 0
    explanation: |
      La division par zéro est mathématiquement impossible et cause une erreur
      d'exécution. Il faut toujours vérifier que le dénominateur n'est pas zéro.
    solution:
      hint: "Ajoutez une vérification avant la division"
      example: |
        si nombre_étudiants > 0 alors
            moyenne := total / nombre_étudiants
        sinon
            moyenne := 0
        fin si
    learning:
      related_topics: ["Gestion des erreurs", "Validation des entrées"]
      practice_exercises: ["Exercices sur la validation des données"]
```

## Dependencies
- compilation-pipeline.md (pipeline de compilation)
- error-handling-standards.md (standards de gestion d'erreurs)
- error-message-templates.md (templates de messages)
- educational-effectiveness.md (critères pédagogiques)

## Performance Metrics

### Debugging Efficiency
```yaml
efficiency_metrics:
  error_detection_time: < 100ms for most errors
  breakpoint_performance: < 10ms overhead per breakpoint
  variable_inspection_speed: Real-time updates
  step_execution_speed: < 50ms per step
```

### Educational Impact
```yaml
educational_metrics:
  error_understanding_rate: > 85% of students understand errors after explanation
  self_correction_rate: > 70% of errors fixed without complete solution
  learning_retention: > 80% retention of debugging concepts
  student_satisfaction: > 4.5/5 rating for debugging experience
```

## Integration with IDE

### IDE Features
```yaml
ide_integration:
  real_time_analysis:
    - Syntax checking as you type
    - Underline errors immediately
    - Show tooltips with hints
    - Auto-suggest corrections
  
  smart_assistance:
    - Code completion with error prevention
    - Refactoring tools
    - Code formatting
    - Import suggestions
  
  collaborative_debugging:
    - Share debugging sessions
    - Comment on code
    - Pair programming support
    - Teacher-student interaction
```

## Testing and Validation

### Debugging Test Suite
```yaml
test_categories:
  error_detection:
    - All syntax errors detected
    - All semantic errors detected
    - All runtime errors caught
    - False positive rate < 5%
  
  user_experience:
    - Error messages clarity rating
    - Learning effectiveness measurement
    - Interface usability testing
    - Performance under load
  
  educational_validation:
    - Student improvement tracking
    - Concept understanding assessment
    - Debugging skill development
    - Long-term learning retention
```