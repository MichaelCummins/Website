//Declare global variables
var currentToken;
var tokens = [];
var numParseErrors = 0;
var programLevel = 0;
var programCounter = 1;
var braceCounter = 0;
var cst = new Tree();
cst.addNode("Root", "branch");
var booleanStatement = false;
var printStatement = false;

//Reset variables for each program
function initializeParser(){
    currentToken;
    tokens = [];
    numParseErrors = 0;
    programLevel = 0;
    programCounter = 1;
    braceCounter = 0;
    cst = new Tree();
    cst.addNode("Root", "branch");
    booleanStatement = false;
    printStatement = false;
}

//Get the next token in the array
function getNextToken(){
    currentToken = tokens[0];
    tokens.shift();
}

//Look at the next Token
function lookAhead(){
    return tokens[0];
}

//Get what to parse from parameter and beging parsing
function parseStart(userInput){
    initializeParser();
    tokens = userInput;
    parseProgram();
    
    if(numParseErrors != 0){
        outputMessage("Parser failed with " + numParseErrors + " errors");
    }
    return numParseErrors;
}

//Parse program method
function parseProgram(){
    //If no tokens left, were done parsing
    if(tokens.length == 0){
        outputMessage("Parsing over");
        return;
    }
    //Get the next token
    getNextToken();
    //If the current program doesnt match the counter, output its a new program
    if(programLevel != programCounter){
        outputMessage("Parsing Program " + currentProgram);
        programCounter++;
    }
    //Output parser dialogue
    outputMessage("parseProgram()");
    //If we get what is expected 
    if(matchToken(currentToken, "L_Brace")){
        //Add program to the cst
        cst.addNode("Program", "branch");
        //Go to parse block
        parseBlock();    
    }else{
        //Else we got an error and alert the user
        parseErrorMessage("{");
        //Increment error count
        numParseErrors++;
    }
    //Climb back up the cst
    cst.endChildren();
    return;
}

function parseBlock(){
    //Output parsing path
    outputMessage("parseBlock()");
    
    //If we got a { they did good
    if(matchToken(currentToken, "L_Brace")){
        //Add block to the cst 
        cst.addNode("Block", "branch");
        //Increment brace counter
        braceCounter++;
        //Add leaf node for the bracket
        cst.addNode(currentToken.value, "leaf");
        //Get next token
        getNextToken();
        //Go to StatementList
        parseStatementList();
        //If we got a } its okay
    }else if(matchToken(currentToken, "R_Brace")){
        //Decrement?(sp) brace counter
        braceCounter--;
        //Add leaf node for }
        cst.addNode(currentToken.value, "leaf");
        //Get the next token
        getNextToken();
        //Climb the cst
        cst.endChildren();
        //If the token is an EOP and the braces are balanced
        //Its the end of the program
        if(matchToken(currentToken, "EOF")  && (braceCounter == 0)){
            //Add leaf node for the EOP
            cst.addNode(currentToken.value, "leaf");
            //Increment to the next program
            programLevel++;
            //Climb up the cst
            cst.endChildren();
            //Go to start parsing the next program
            parseProgram();
        }else{
            //Climb up the cst
            cst.endChildren();
            //Go to statement list
            parseStatementList();
        }
        return;
    }else{
        //We got a uh-oh 
        //Alert user of error
        parseErrorMessage("}");
        //Increment error count
        numParseErrors++;
    }
    return;
}

function parseStatementList(){
    //Add branch node for statement list to cst
    cst.addNode("Statement List", "branch");
    //Output parser progress
    outputMessage("parseStatementList()");
    
    //Check if were exiting a block or going to a statement
    if(matchToken(currentToken, "R_Brace")){
        //Go back up if we got a brace
        cst.endChildren();
        //Go to block
        parseBlock();
        
        //Check if we got a statement starter
        //If we did, go to parse statement
    }else if(matchToken(currentToken, "print") || matchToken(currentToken, "id")
        || matchToken(currentToken, "int") || matchToken(currentToken, "string")
        || matchToken(currentToken, "boolean") || matchToken(currentToken, "while")
        || matchToken(currentToken, "if") || matchToken(currentToken, "L_Brace")){
        parseStatement();
        //Continue going through the token array
        while(!(matchToken(currentToken, "EOF"))){
            getNextToken();
            parseStatementList();
        }
    }else{
        //Alert what we shouldve gotten
        //Increment number of parse errors
        parseErrorMessage("}, print, id, int, string, boolean, while, if, or {");
        numParseErrors++;
    }
    //Climb the cst
    cst.endChildren();
    return;
}

function parseStatement(){
    outputMessage("parseStatement()");
    cst.addNode("Statement", "branch");
        //Since a statement can be many things in our grammar check what it starts with
        //If it starts with the token PRINT its a print statement
    if(matchToken(currentToken, "print")){
        //Go to print statement
        parsePrintStatement();
        //If its an id it goes to assignment 
    }else if(matchToken(currentToken, "id")){
        //Go to assignment statement
        parseAssignmentStatement();
        //If it starts with int string or boolean it is a variable declaration
    }else if(matchToken(currentToken, "int") || matchToken(currentToken, "string") || 
             matchToken(currentToken, "boolean")){
        //Go to variable declaration
        parseVarDecl();
        //If it is while it is the start of a while statement
    }else if(matchToken(currentToken, "while")){
        //Go to while statement
        parseWhileStatement();
        //If it is if it is the start of an if statement
    }else if(matchToken(currentToken, "if")){
        //Go to if statement
        parseIfStatement();
        //If anything else, parse as a block statment
    }else if(matchToken(currentToken, "L_Brace") && braceCounter != 0 || 
             matchToken(currentToken, "R_Brace")){
        cst.endChildren();
        //Go to block statement
        parseBlock();
    }else if(matchToken(currentToken, "L_Brace") && braceCounter == 0){
        parseErrorMessage("{");
        numParseErrors++;
    }else{
        parseErrorMessage("either print, id, int, string, boolean, while, if");
        numParseErrors++;
    }
    //Go up 2 branches
    cst.endChildren();
    cst.endChildren();
    return;
}

function parsePrintStatement(){
    //Output parsing path
    outputMessage("parsePrintStatement()");
    //Add a branch stating that we went to printStatement
    cst.addNode("Print Statement", "branch");
    //Add a leaf for the value of what to print
    cst.addNode(currentToken.value, "leaf");
    //Move to the next node
    getNextToken();
    //Set that we are currently in a print statement
    printStatement = true;
    //Check if we got a (
    if(matchToken(currentToken, "L_Paren")){
        //Add the Left Paren
        cst.addNode(currentToken.value, "leaf");
        //Parse the Left Paren
        paren();
    }else{
        //Increment error count and output error
        parseErrorMessage("(");
        numParseErrors++;
    }
    //Climb the cst
    cst.endChildren();
    return;
}

function parseAssignmentStatement(){
    //Output path of parser
    outputMessage("parseAssignmentStatement()");
    //Add Assignment statement node
    cst.addNode("Assignment Statement", "branch");
    //Check if we got an id
    if(matchToken(currentToken, "id")){
        //Go to ID
        parseId();
        //Ge the next token
        getNextToken();
        //Check if we got the right token for assignment
        if(matchToken(currentToken, "OP_Assignment")){
            //Get the next token
            getNextToken();
            //Parse the expression
            parseExpr();
        }else{
            //Increment error count and output error
            parseErrorMessage("OP_Assignment");
            numParseErrors++;
        }
    }else{
        //Increment error count and output error
        parseErrorMessage("id");
        numParseErrors++;
    }
    //Climb a branch
    cst.endChildren();
    return;
}

function parseVarDecl(){
    //Output path of the parser
    outputMessage("parseVarDecl()");
    //Add brach node for the variable
    cst.addNode("Variable Declaration", "branch");
    //Add value of the VarDecl token
    cst.addNode(currentToken.value, "leaf");
    //Go to the next token
    getNextToken();
    //Check if we got an expected id
    if(matchToken(currentToken, "id")){
        //Add the id to the cst
        cst.addNode(currentToken.value, "leaf");
    }else{
        //Increment error count and output error
        parseErrorMessage("id");
        numParseErrors++;
    }
    //Climb a branch
    cst.endChildren();
    return;
}

function parseWhileStatement(){
    //Output path of the parser
    outputMessage("parseWhileStatement()");
    //Add a branch for the while statement
    cst.addNode("While Statement", "branch");
    //Add a leaf for the while token
    cst.addNode(currentToken.value, "leaf");
    //Go to the next token
    getNextToken();
    //Check if we got the start of a (
    if(matchToken(currentToken, "L_Paren")){
        //Parse boolean expr
        parseBooleanExpr();
        //Get the next token
        getNextToken();
        //Parse a new block
        parseBlock();
    }else{
        //Increment error count and output error
        parseErrorMessage("L_Paren");
        numParseErrors++;
    }
    //Climb a branch
    cst.endChildren();
    return;
}

function parseIfStatement(){
    //Output path of the parser
    outputMessage("parseIfStatement");
    //Add if statement branch
    cst.addNode("If Statement", "branch");
    //Add the value of the currentnode if statement
    cst.addNode(currentToken.value, "leaf");
    //Go to the next token
    getNextToken();
    //Check if we got the start of a (
    if(matchToken(currentToken, "L_Paren")){
        //Parse boolean expr
        parseBooleanExpr();
        //Go to the next token
        getNextToken();
        //Parse a new block
        parseBlock();
    }else{
        //Increment error count and output error
        parseErrorMessage("L_Paren");
        numParseErrors++;
    }
    //Climb a branch
    cst.endChildren();
    return;
}

function parseExpr(){
    //Output path of the parser
    outputMessage("parseExpr()");
    //Add branch node for expression
    cst.addNode("Expression", "branch");
    //If we got a digit parse as int expression
    if(matchToken(currentToken, "digit")){
       parseIntExpr();
    //If we got a double quote parse as string expression
    }else if(matchToken(currentToken, '"')){
       parseStringExpr();
    //If we got a left paren or a bool parse as boolean expression
    }else if(matchToken(currentToken, "L_Paren") || matchToken(currentToken, "boolean")){
        parseBooleanExpr();
    //If we got an id parse as an id
    }else if(matchToken(currentToken, "id")){
        parseId();
    }else{
    //Increment error count and out a plethora of errors
        parseErrorMessage("either a digit, double quote, Left parenthesis, or an id");
        numParseErrors++;
    }
    //Climb a branch
    cst.endChildren();
    return;
}

function parseIntExpr(){
    //Output path of the parser
    outputMessage("parseIntExpr()");
    //Add int expression branch node to the cst
    cst.addNode("Int expression", "branch");
    //Add value of whatevers being parsed as a leaf
    cst.addNode(currentToken.value, "leaf");
    //Check beforehand if the next token in the array is a '+'
    //If it is we cna parse it as an increment
    if(lookAhead().kind == "intop"){
        //Go to the plus
        getNextToken();
        //Add it as a leaf node
        cst.addNode(currentToken.value, "leaf");
        //Go to the next token
        getNextToken();
        //Parse an expresson
        parseExpr();
        //Kill all those kids
        cst.endChildren();
        return;
    }else{
        //Climb a branch
        cst.endChildren();
        return;
    }
}

function parseStringExpr(){
    //Output path of the parser
    outputMessage("parseStringExpr()");
    //Add branch node of string expr to cst
    cst.addNode("String expression", "branch");
    //Add leaf node of the string
    cst.addNode(currentToken.value, "leaf");
    //Get the next token
    getNextToken();
    //Output that it is a the beginning of a char list
    cst.addNode("Char List", "branch");
    //Parse the char list
    parseCharlist();
    //If the token is a "
    if(matchToken(currentToken, '"')){
        //Climb the cst and add it to the cst
        cst.endChildren();
        cst.addNode(currentToken.value, "leaf");
    }else{
        //Increment error count and output error
        parseErrorMessage('"');
        numParseErrors++;
    }
    //Climb the cst
    cst.endChildren();
    return;
}

function parseBooleanExpr(){
    //Output path of the parser
    outputMessage("parseBooleanExpr()");
    //Add branch node for bool expression
    cst.addNode("Boolean Expression", "branch");
    //Check if we got the start of a bool expr
    if(matchToken(currentToken, "L_Paren")){
        //If we did set bool to true
        booleanStatement = true;
        //Parse the paren
        paren();
    }else{
        //Add the token to the cst as a leaf
        cst.addNode(currentToken.value, "leaf");
    }
    //Climb the cst
    cst.endChildren();
    return;
}

function parseId(){
    //Output path of the parser
    outputMessage("parseId()");
    //Add id branch
    cst.addNode("id", "branch");
    //Add the value of the id to the cst
    cst.addNode(currentToken.value, "leaf");
    //Climb a branch
    cst.endChildren();
    return;
}

function parseCharlist(){
    //Output path of the parser
    outputMessage("parseCharList()");
    //Check if we got a char
    if(matchToken(currentToken, "char")){
        //Add the value of the char to the cst
        cst.addNode(currentToken.value, "leaf");
        //Go to the next token
        getNextToken();
        //Continue parsing the char list until we get to the end 
        parseCharlist();
    }else if(matchToken(currentToken, '"')){
        //If we got " we are at the end of the char list
        return;
    }else{
        //Increment error count and output error
        parseErrorMessage();
        numParseErrors++;
    }
    return;
}

function paren(){
    //Check if we are in a boolean
    if(booleanStatement){
        //If we are get the next token
        getNextToken();
        //If we are parse an expr
        parseExpr();
        //Go to the next token
        getNextToken();
        //Check how its being compared
        if(matchToken(currentToken, "OP_Equality") || matchToken(currentToken, "Not_Equal")){
            //Add the comparison to the cst as a leaf
            cst.addNode(currentToken.value, "leaf");
            //Go to the next token
            getNextToken();
            //Parse as an expression
            parseExpr();
        }else{
            //Output error and increment error count
            parseErrorMessage("=");
            numParseErrors++;
        }
    //Check if we are in a print statement
    }else if(printStatement){
        //Go to the next token and parse as an expression
        getNextToken();
        parseExpr();
    }
    //No errors? Good!
    if(numParseErrors){
        return;
    }
    //Go to the next token
    getNextToken();
    //Check if were at the closing of an expression
    if(matchToken(currentToken, "R_Paren")){
        //If it was a boolean make it false
        //If it was a print make it false
        if(booleanStatement){
            booleanStatement = false;
        }else if(printStatement){
            printStatement = false;
        }
        //Add the paren as a leaf node
        cst.addNode(currentToken.value, "leaf");
        return;
    }else{
        //Increment error count and output error
        parseErrorMessage("R_Paren");
        numParseErrors++;
    }
    return;
}

function parseErrorMessage(convictedToken = ""){
    //Output the errors
    outputMessage("ERROR Unexpected Token: " + currentToken.value + " at line " + currentToken.currentLine);
    outputMessage("Expected " + convictedToken);

}

function matchToken(currentToken, expectedToken){
    var match;
    if(currentToken.kind == expectedToken){
        match = true;
    }else{
        match = false;
    }
    return match
}