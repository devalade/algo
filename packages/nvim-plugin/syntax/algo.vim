if exists("b:current_syntax")
  finish
endif

syn case ignore

syn keyword algoKeyword PROGRAMME DEBUT FIN VAR
syn keyword algoKeyword SI ALORS SINON FINSI
syn keyword algoKeyword TANTQUE FAIRE FINTANTQUE
syn keyword algoKeyword POUR ALLANT DE A FINPOUR
syn keyword algoKeyword REPETER JUSQUA
syn keyword algoType    ENTIER REEL BOOLEEN CHAINE
syn keyword algoBool    VRAI FAUX
syn keyword algoFunc    LIRE ECRIRE
syn keyword algoOp      ET OU NON

syn match   algoNumber  "\b\d\+\(\.\d\+\)\?\b"
syn match   algoAssign  ":="
syn match   algoCompare "<>\|<=\|>=\|<\|>"
syn region  algoString  start='"' end='"'
syn match   algoComment "//.*$"
syn region  algoComment start="/\*" end="\*/"

hi def link algoKeyword Keyword
hi def link algoType    Type
hi def link algoBool    Boolean
hi def link algoFunc    Function
hi def link algoOp      Operator
hi def link algoNumber  Number
hi def link algoAssign  Operator
hi def link algoCompare Operator
hi def link algoString  String
hi def link algoComment Comment

let b:current_syntax = "algo"
