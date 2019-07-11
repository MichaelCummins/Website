/*Function to store attributes of each token
What kind of token it is
The value of the token
What line the token is on
What column the token is located in
*/
function Token(kind, value, currentLine, currentColumn){
    this.kind = kind;
    this.value = value;
    this.currentLine = currentLine;
    this.currentColumn = currentColumn;
}

function addToken(kind, value, currentLine, currentColumn){
    //Create a variable of an empty temporary token
    var token = new Token(kind, value, currentLine, currentColumn);
    //Output the results of what the token is to the user
    outputMessage("DEBUG Lexer - " + kind + "[ " + value + " ] found at " + currentLine + "," + currentColumn);
    //Push the created token to the tokens array
    tokens.push(token);
}