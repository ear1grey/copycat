'use strict'

var Inspector = require('../../lib/inspector');

module.exports = function (source) {

  var inspector = new Inspector(source, {
    tokens: [
      {
        name: 'String',
        match: '/[\'\"]([^\"\']+)[\'\"]/g'
      },
      {
        name: 'Keyword',
        match: '/\\b(break|case|class|catch|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with|yield)/g'
      },
      {
        name: 'Identifier',
        match: '/[A-Za-z$_][A-Za-z0-9$_]*/g'
      },
      {
        name: 'Number',
        match: '/(\\d+\\.\\d+)/g'
      },
      {
        name: 'Number',
        match: '/(\\.\\d+)/g'
      },
      {
        name: 'Number',
        match: '/(\\d+)/g'
      },
      {
        name: 'Punctuation',
        match: '/(\\=\\=\\=|\\!\\=\\=)/g'
      },
      {
        name: 'Punctuation',
        match: '/(\\=\\=|\\!\\=|\\+\\+|\\-\\-|\\&\\&|\\|\\|)/g'
      },
      {
        name: 'Punctuation',
        match: '/[\\.\\,\\=\\!\\+\\-\\&\\|\\(\\)\\{\\}\\;\\:\\[\\]\\"\\\']/g'
      }
    ],
    rules: [
      {
        name: 'Block',
        type: 'Container',
        match: '{ Statement }'
      },
      {
        name: 'VariableStatement',
        type: 'Assignment',
        match: 'var ... ;'
      },
      {
        name: 'IfStatement',
        type: 'Conditional',
        match: 'if ( ... ) Statement'
      },
      {
        name: 'ForStatement',
        type: 'Iteration',
        match: 'for ( ... )'
      },
      {
        name: 'ConsoleLogStatement',
        type: 'Output',
        match: 'console . log ( ... ) ;'
      }
    ]
  });

  return inspector;

};