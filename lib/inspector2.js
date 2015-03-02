var data = {

  "rules": [
    "Statement": {
      "match": [
        "Block",
        "VariableStatement",
        "IfStatement"
      ]
    },

    "Block": {
      "match": ["{", "Statement", "}"]
    },

    "VariableStatement": {
      "match": [
        ["VAR", "IDENTIFIER"],
      ]
    },

    "IfStatement": {
      "match": [
        ["IF", "(", "...", ")", "Statement"],
      ]
    },

    "SourceElement": {
      "match": ["Statement"]
    },

    "Program": {
      "match": ["SourceElement", "EOF"]
    }
  ]
};









go('Program');


function go(start) {
  
}