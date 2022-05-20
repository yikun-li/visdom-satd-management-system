grammar XmlCommentGrammar;

@header {
   package nl.rug.mvittersum.bproj.commentparser.grammar;
}

parse: .*? EOF;

XML_COMMENT: '<!--' .*? '-->';

STRING: ('"' (STR_ESC | ~('\\' | '"' | '\r' | '\n'))* '"' | '\'' (CH_ESC | ~('\\' | '\'' | '\r' | '\n'))* '\'') -> skip;
SPACE: (' ' | '\t' | '\r' | '\n')+ -> skip;
OTHER: . -> skip;

fragment WHITESPACE: ' ' | '\t';
fragment WS: WHITESPACE*?;
fragment EOL: '\r' ? '\n' | '\r';
fragment TEXT_NO_EOL: ~('\r' | '\n')*;
fragment STR_ESC: '\\' ('\\' | '"' | 't' | 'n' | 'r');
fragment CH_ESC: '\\' ('\\' | '\'' | 't' | 'n' | 'r');
