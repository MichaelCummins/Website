//Array for tokens
var analyzerTokens = [];
//Keep track of which token
var analyzerCurrentToken;
//Number of errors
var numAnalyzerErrors = 0;
//Number of warnigns
var numAnalyzerWarnings = 0;
//Which scope an ID is in
var scope = -1;
//Which level were in
var scopeLevel = -1;
var analyzerScopeArray = [];
//How deep the max is
var scopeCounter = 0;
//Whether were adding to something or not
var addition = false;
//All temporary values for adding
var temporaryId = null;
var temporaryValue = null;
var temporaryType = null;
//Declare Abstract Syntax Tree and Symbol Tree
var ast = new Tree();
ast.addNode("root", "branch");
var st = new symbolTree();

//Reset global variables at start of analyzing
function analyzerInit(){
    analyzerTokens = [];
    analyzerCurrentToken;
    numAnalyzerErrors = 0;
    numAnalyzerWarnings = 0;
    scope = -1;
    scopeLevel = -1;
    analyzerScopeArray = [];
    scopeCounter = 0;
    addition = false;
    temporaryId = null;
    temporaryValue = null;
    temporaryType = null;
    ast = new Tree();
    ast.addNode("root", "branch");
    st = new symbolTree();
}

//Same as parsing, just get next token
function getNextAnalyzerToken(){
    analyzerCurrentToken = analyzerTokens[0];
    analyzerTokens.shift();
}

//Same as parsing, look ahead for addition
function analyzerLookAhead(){
    return analyzerTokens[0];
}

//See if an id exists within the symbol Tree already
function doesVariableExistAlready(id){
    for(var i = 0; i < st.cur.symbols.length; i++){
        if(id == st.cur.symbols[i].getKind()){
            return st.cur.symbols[i].getLine();
        }
    }
}

//Get the value of an id from the symbol tree
function FindValue(id, level){
    if((level.parent != undefined || level.parent != null) && level.symbols.length > 0){
        for(var i = 0; i < level.symbols.length; i++){
            if(id == level.symbols[i].getKind() && currentProgram == level.symbols[i].programNumber){
                return level.symbols[i].value;
            }
        }
    }
}

//Set the value of an id when adding
function setValue(id, value, level){
    //Check if symbols are null
    if((level.parent!= undefined || level.parent != null) && level.symbols.length > 0){
        //Check if already there
        for(var i = 0; i < level.symbols.length; i++){
            if(id == level.symbols[i].getKind()){
                //Set to true
                level.symbols[i].initialized = true;
                level.symbols[i].value = value;
                var localScope = level.symbols[i].scope;
            }
        }
    }
    //Recursive if not there
    if(level.parent != undefined || level.parent != null){
        setValue(id, value, level.parent);
    }
    for(var i = 0; i < allSymbols.length; i++){
        if((id == allSymbols[i].getKind()) && (localScope == allSymbols[i].scope)){
            allSymbols[i].initialized = true;
            allSymbols[i].value = value;
        }
    }
}

//Set that an id was used 
function setUsed(id, level){
    if((level.parent != undefined || level.parent != null) && level.symbols.length > 0){
        for(var i = 0; i < level.symbols.length; i++){
            if(id == level.symbols[i].getKind()){
                level.symbols[i].utilized = true;
            }
        }
    }
    if(level.parent != undefined || level.parent != null){
        setUsed(id, level.parent);
    }
}

//Get the type of an id
function FindType(id, level){
    //Check for symbols
    if((level.symbols != undefined || level.symbols != null) && level.symbols.length > 0){
        //Find type
        for(var i = 0; i < level.symbols.length; i++){
            //Return the type
            if(id == level.symbols[i].getKind()){
                return level.symbols[i].type;
            }
        }
    }
    
    if(level.parent != undefined || level.parent != null){
        return FindType(id, level.parent);
    }
}


//Check if an id is in the tree
function alreadyHere(id, level){
    if((level.parent != undefined || level.parent != null) && level.symbols.length > 0){
        for(var i = 0; i < level.symbols.length; i++){
            if(id == level.symbols[i].getKind()){
                return true;
            }
        }
    }
    
    if(level.parent != undefined || level.parent != null){
        return alreadyHere(id, level.parent);
    }
    return false;
}

function checkFor(str, num){
    if(analyzerTokens[num].kind == str){
        return true;
    }else if(analyzerTokens[num].kind == "R_Paren"){
        return false;
    }else if(analyzerTokens[num].kind == "L_Paren"){
        return false;
    }else{
        return checkFor(str, (num+1));
    }
}

//Reset all null values
function resetTemporaryVariables(){
    addition = false;
    temporaryId = null;
    temporaryType = null;
    temporaryValue = null;
}

function isUtilized(level){
    if((level.parent != undefined || level.parent != null) && level.symbols.length > 0){
        for(var i = 0; i < level.symbols.length; i++){
            if(level.symbols[i].utilized == false){
                numAnalyzerWarnings++;
                outputMessage("Warning id " + level.symbols[i].getKind() + " was never utilized");
            }
        }
    }
    if(level.parent != undefined || level.parent != null){
        isUtilized(level.parent);
    }
}

//Start analying
function analyzerStart(userInput){
    analyzerInit();
    analyzerTokens = userInput;
    
    //Start at program
    analyzeProgram();
    
    //If any errors notify user
    //Check for warnings
    isUtilized(st.cur);
    if(numAnalyzerErrors != 0){
        outputMessage("Analyzer failed with " + numAnalyzerErrors + " errors and " + numAnalyzerWarnings + " warnings");
    }
    
    //Return errors
    return numAnalyzerErrors;
}


function analyzeProgram(){
    //Add program to ast
    ast.addNode("Program", "branch", "Program", scope);
    outputMessage("Analyze program");
    //Get next token
    getNextAnalyzerToken();
    //Can only go to block
    analyzeBlock();
    
    //If we get to a $ just go to the next
    if(analyzerCurrentToken.kind == "EOF"){
        getNextAnalyzerToken();
    }
    //Climb the tree
    ast.endChildren();
}

function analyzeBlock(){
    //Output where we are in the tree
    outputMessage("Analyze Block");
    //Increment scope
    scopeLevel++;
    scopeCounter++;
    analyzerScopeArray.push(scope);
    scope = scopeCounter;
    
    //Add block to the ast and st
    ast.addNode("Block", "branch", "Block", scope);
    st.addNode("Scope: " + scope, "branch", scope);
    //Check if we got {
    if(matchToken(analyzerCurrentToken, "L_Brace")){
        getNextAnalyzerToken();
    }
    //Go to statement List
    analyzeStatementList();
    //Check if were at end of block
    if(matchToken(analyzerCurrentToken, "R_Brace")){
        getNextAnalyzerToken();
    }
    
    //Reduce current scope
    scopeLevel--;
    scope = analyzerScopeArray.pop();
    //Climb both trees
    st.endChildren();
    ast.endChildren();
}

function analyzeStatementList(){
    //Out where we are
    outputMessage("Analyze Statement List");
    
    //Epsilon product we are done
    if(matchToken(analyzerCurrentToken, "R_Brace")){
        //Epsilon
    }else if(matchToken(analyzerCurrentToken, "print") || matchToken(analyzerCurrentToken, "id")
        || matchToken(analyzerCurrentToken, "int") || matchToken(analyzerCurrentToken, "string")
        || matchToken(analyzerCurrentToken, "boolean") || matchToken(analyzerCurrentToken, "while")
        || matchToken(analyzerCurrentToken, "if") || matchToken(analyzerCurrentToken, "L_Brace")){
        //If anything else user did good
        analyzeStatement();
        analyzeStatementList();
    }
}

function analyzeStatement(){
    //Output where we are
    outputMessage("Analyze Statement");
        //Since a statement can be many things in our grammar check what it starts with
        //If it starts with the token PRINT its a print statement
    if(matchToken(analyzerCurrentToken, "print")){
        //Go to print statement
        analyzePrintStatement();
        //If its an id it goes to assignment 
    }else if(matchToken(analyzerCurrentToken, "id")){
        //Go to assignment statement
        analyzeAssignmentStatement();
        //If it starts with int string or boolean it is a variable declaration
    }else if(matchToken(analyzerCurrentToken, "int") || matchToken(analyzerCurrentToken, "string") || 
             matchToken(analyzerCurrentToken, "boolean")){
        //Go to variable declaration
        analyzeVarDecl();
        //If it is while it is the start of a while statement
    }else if(matchToken(analyzerCurrentToken, "while")){
        //Go to while statement
        analyzeWhileStatement();
        //If it is if it is the start of an if statement
    }else if(matchToken(analyzerCurrentToken, "if")){
        //Go to if statement
        analyzeIfStatement();
        //If anything else, parse as a block statment
    }else if(matchToken(analyzerCurrentToken, "L_Brace")){
        analyzeBlock();
    }
}

function analyzePrintStatement(){
    //Output where we are and add print to ast
    outputMessage("Analyze print statement");
    ast.addNode("Print Statement", "branch", "Print Statement", scope);
    //Get next token
    getNextAnalyzerToken();
    
    //Check if we got what we ned
    if(matchToken(analyzerCurrentToken, "L_Paren")){
        getNextAnalyzerToken();
    }
    
    //Go to expr
    analyzeExpr();
    
    //Check if at end of statement
    if(matchToken(analyzerCurrentToken, "R_Paren")){
        getNextAnalyzerToken();
    }
    
    //Climb tree
    ast.endChildren();
}

function analyzeAssignmentStatement(){
    outputMessage("Analyze Assignment Statement");
    ast.addNode("Assignment Statement", "branch", "Assignment Statement", scope);
    if(matchToken(analyzerCurrentToken, "id")){
        var id = analyzerCurrentToken.value;
        var type = FindType(id, st.cur);
        if(type == undefined){
            numAnalyzerErrors++;
            outputMessage("Error, id " + id + " was not declared in scope " + scope);
        }
        if(!addition){
            temporaryId = id;
            try{
                temporaryType = type.toUpperCase();
            }catch(e){
                e.printstack;
                temporaryType = null;
            }
            addition = true;
            if(temporaryType == null || temporaryValue == undefined){
                temporaryValue = FindValue(id, st.cur);
            }else{
                temporaryValue = Number(temporaryValue) + Number(FindValue(id, st.cur));
            }
        }
        analyzeId();
    }
    if(matchToken(analyzerCurrentToken, "OP_Assignment")){
        getNextAnalyzerToken();
        if(addition){
            if(matchToken(analyzerCurrentToken, "digit")){
                if(temporaryType == "INT"){
                    if(analyzerLookAhead().kind != "intop"){
                        if(temporaryValue == 0){
                            temporaryValue = Number(analyzerCurrentToken.value);
                        }else{
                            temporaryValue = Number(temporaryValue) + Number(analyzerCurrentToken.value);
                        }
                        setValue(temporaryId, temporaryValue, st.cur);
                        resetTemporaryVariables()
                    }else{
                        resetTemporaryVariables()
                    }
                }else if(temporaryType == "BOOLEAN"){
                    if(Number(analyzerCurrentToken.value) > 0){
                        var t = true;
                    }else{
                        var t = false;
                    }
                    setValue(temporaryId, t, st.cur);
                    resetTemporaryVariables()
                }else{
                    numAnalyzerErrors++;
                    outputMessage("ERROR id " + temporaryId + " was given " + temporaryType + " but got int");
                }
            }else if(matchToken(analyzerCurrentToken, "id")){
                var cvType = FindType(analyzerCurrentToken.value, st.cur);
                if(temporaryType.toLowerCase() != cvType){
                    numAnalyzerErrors++;
                    outputMessage("ERROR mismatched types " + id + " is defined as " + temporaryType + " was given  " + cvType);
                }
                
                if(temporaryValue == 0){
                    temporaryValue = FindValue(analyzerCurrentToken.value, st.cur);
                }else{
                    temporaryValue = Number(temporaryValue) + Number(FindValue(analyzerCurrentToken.value, st.cur));
                }
                setValue(temporaryId, temporaryValue, st.cur);
                resetTemporaryVariables()
            }else if(matchToken(analyzerCurrentToken, "boolean")){
                if(temporaryType == "BOOLEAN"){
                    var val;
                    if(analyzerCurrentToken.value == "true"){
                        val = true;
                    }else if(analyzerCurrentToken.value == "false"){
                        val = false;
                    }
                    setValue(temporaryId, val, st.cur);
                    resetTemporaryVariables()
                }else{
                    numAnalyzerErrors++;
                    outputMessage("ERROR id " + temporaryId + " was expting type " + temporaryType + " but was given boolean");
                }
            }
        }
        analyzeExpr();
    }
    ast.endChildren();
}

function analyzeVarDecl(){
    //Output where we are and add vardecl to ast
    outputMessage("Analyze Var decl");
    ast.addNode("Var Decl", "branch", "Var Decl", scope);
    //Create variable to get what class a var is 
    var type = analyzerCurrentToken.kind.toLowerCase();
    //Grab next token
    getNextAnalyzerToken();
    //Did we get an id?
    if(matchToken(analyzerCurrentToken, "id")){
        //See if a variable of the same name is already in the symbol tree
        if(line = doesVariableExistAlready(analyzerCurrentToken.value)){
            //Increment error count and output error
            numAnalyzerErrors++;
            outputMessage("ERROR id " + analyzerCurrentToken.value + " was previously declared" );
        }else{
            //Create new symbol and push 
            var symbol = new Symbol(analyzerCurrentToken.value, type, analyzerCurrentToken.currentLine, 
                                    scope, scopeLevel, currentProgram, 
                                    false, false, false);
            st.cur.symbols.push(symbol);
            allSymbols.push(symbol);
        }
        //Go to ID
        analyzeId();
    }
    //Climb the tree
    ast.endChildren();
}

function analyzeWhileStatement(){
    //Output where we are and add to ast
    outputMessage("Analyze While Statement");
    ast.addNode("While Statement", "branch", "While Statement", scope);
    
    //Grab next token
    getNextAnalyzerToken();
    
    //Same as Parser zzz
    if(matchToken(analyzerCurrentToken, "L_Paren") || matchToken(analyzerCurrentToken, "boolean")){
        analyzeBooleanExpr();
        getNextAnalyzerToken();
        analyzeBlock();
    }
    //Climb the tree
    ast.endChildren();
}

function analyzeIfStatement(){
    //Out where we are and at to ast
    outputMessage("Analyze If Statement");
    ast.addNode("If Statement", "branch", "If Statement", scope);
    //Grab next token
    getNextAnalyzerToken();
    
    //Check if we got what we expected, same as parser
    if(matchToken(analyzerCurrentToken, "L_Paren") || matchToken(analyzerCurrentToken, "boolean")){
        analyzeBooleanExpr();
        getNextAnalyzerToken();
        analyzeBlock();
    }
    //Climb the tree
    ast.endChildren();
}

function analyzeExpr(){
    //Output where we are 
    outputMessage("Analyze Expr");
    if(matchToken(analyzerCurrentToken, "digit")){
        //If int then go to int expr
        analyzeIntExpr();
    }else if(matchToken(analyzerCurrentToken, '"')){
        //If quote then go to string expr
        analyzeStringExpr();
    }else if(matchToken(analyzerCurrentToken, "L_Paren") || 
             matchToken(analyzerCurrentToken, "boolean")){
        //If boolean go to boolean expr
        analyzeBooleanExpr();
    }else if(matchToken(analyzerCurrentToken, "id")){
        //If its an id it requires work
        if(addition){
            //If were adding to symbol do this
            if(temporaryValue == 0){
                //Set temp variable to the value of the current token
                temporaryValue = Number(FindValue(analyzerCurrentToken.value, st.cur));
            }else{
                //Set temp variable to value of the variable and the current token
                temporaryValue = Number(temporaryValue) + Number(FindValue(analyzerCurrentToken.value, st.cur));
            }
            //Set value of the sum and reset temps
            setValue(temporaryId, temporaryValue, st.cur);
            resetTemporaryVariables()
        }else{
            //Set the current token as used
            setUsed(analyzerCurrentToken.value, st.cur);
        }
        //Go back to id
        analyzeId();
    }
}

function analyzeIntExpr(){
    //Output where we are 
    outputMessage("Analyze Int Expr");
    //If we see a plus then were adding something
    if(analyzerLookAhead().kind == "intop"){
        //Add the plus to the ast
        ast.addNode("Addition", "branch", "Addition", scope);
    }
    
    if(addition){
        if(temporaryValue == null){
            temporaryValue = Number(analyzerCurrentToken.value);
        }else{
            temporaryValue = Number(temporaryValue) + Number(analyzerCurrentToken.value);
        }
    }
    //Go to ID
    analyzeId();
    
    if(matchToken(analyzerCurrentToken, "intop")){
        getNextAnalyzerToken();
        analyzeExpr();
        ast.endChildren();
    }
    
    if(addition){
        temporaryValue == Number(temporaryValue) + Number(analyzerCurrentToken.value);
    }
}

function analyzeStringExpr(){
    //Output where we are
    outputMessage("Analyze String Expr");
    //Check if we got what we need
    if(matchToken(analyzerCurrentToken, '"')){
        getNextAnalyzerToken();
    }
    
    //Create variable to store the string
    var charList = analyzeCharList();
    
    //Add the variable to the ast
    ast.addNode(charList, "leaf", "Charlist", scope);
    
    //If at the start of a string
    if(matchToken(analyzerCurrentToken, '"')){
        //Are we adding to 
        if(addition){
            //If were in a string
            if(temporaryType == "STRING"){
                //Set new value of the id and reset temps 
                setValue(temporaryId, charList, st.cur);
                resetTemporaryVariables()
            }else if(temporaryType == "BOOLEAN"){
                //Create boolean variable 
                if(charList.length > 0){
                    var t = true;
                }else{
                    t = false;
                }
                //Set new value of the id and reset temps
                setValue(temporaryId, t, st.cur);
                resetTemporaryVariables()
            }else{
                //Increment error count
                numAnalyzerErrors++;
                //Output error
                outputMessage("ERROR id " + temporaryId + " was expecting " + temporaryType + " but was given String");
            }
        }
        //Get next token
        getNextAnalyzerToken();
    }
}

function analyzeId(){
    //Check if we got an id
    if(matchToken(analyzerCurrentToken, "id")){
        //Check if id was declared
        if(!alreadyHere(analyzerCurrentToken.value, st.cur)){
            //Increment error count and output error
            numAnalyzerErrors++;
            outputMessage("ERROR id " + analyzerCurrentToken.value + " was used before it was declared");
        }
    }
    //Add the id to the ast
    ast.addNode(analyzerCurrentToken.value, "leaf", "id", scope);
    //Get next token
    getNextAnalyzerToken();
}

function analyzeCharList(){
    //Output where we are 
    outputMessage("Analyze Char List");
    //If we got a quote its a new string
    if(matchToken(analyzerCurrentToken, '"')){
        return "";
    }
    
    //Make new variable to store chars
    var chars = analyzerCurrentToken.value;
    
    //Get next token
    getNextAnalyzerToken();
    
    //Recursively go through charlist until we dont see a char
    if(matchToken(analyzerCurrentToken, "char")){
        return (chars + analyzeCharList());
    }else {
        //Return the list of chars
        return chars;
    }
}

function analyzeBooleanExpr(){
    //Output where we are
    outputMessage("Analyze Boolean Expr");
    
    //Check if we got a boolean
    if(matchToken(analyzerCurrentToken, "boolean")){
        //Go to parse an id
        analyzeId();
    }
    
    //Check if were at the start of a boolean expr
    if(matchToken(analyzerCurrentToken, "L_Paren")){
        //Grab next token
        getNextAnalyzerToken();
        //Create variable to track when were done with this part
        var closeOut = false;
        //Check if == or !=
        if(checkFor("OP_Equality", 0)){
            //Add to ast
            ast.addNode("Equality", "branch", "Equality", scope);
            //Were done here
            closeOut = true;
        }else if(checkFor("Not_Equal", 0)){
            //Add to ast
            ast.addNode("Not_Equal", "branch", "Not_Equal", scope);
            //Were done here
            closeOut = true;
        }
        //Go to expr
        analyzeExpr();
        
        //If == or != go to expr
        if(matchToken(analyzerCurrentToken, "OP_Equality") || 
           matchToken(analyzerCurrentToken, "Not_Equal")){
            getNextAnalyzerToken();
            analyzeExpr();
        }
        
        //Check if we have two kids
        if(ast.cur.children.length >= 2){
            //Check em 
            for(var i = 0; i <(ast.cur.children.length - 1); i++){
                if(ast.cur.children[i].kind == "id"){
                    //Get the type of the first kid
                    var typeOne = FindType(ast.cur.children[i].name, st.cur);
                    if(typeOne == "boolean"){
                        typeOne = "BOOL";
                    }else if(typeOne == "int"){
                        typeOne = "DIGIT";
                    }else if(typeOne == "string"){
                        typeOne = "CHARLIST";
                    }
                }else{
                    var typeOne = ast.cur.children[i].type;
                }
                
                //Get the type of the second kid
                if(ast.cur.children[i + 1].kind == "id"){
                    var typeTwo = FindType(ast.cur.children[i + 1].name, st.cur);
                    if(typeTwo == "boolean"){
                        typeTwo = "BOOLEAN";
                    }else if(typeTwo == "int"){
                        typeTwo = "DIGIT";
                    }else if(typeTwo == "string"){
                        typeTwo = "CHARLIST";
                    }
                }else{
                    var typeTwo = ast.cur.children[i+1].type;
                }
                
                //Compare them
                if(ast.cur.children[i].type == "id" && ast.cur.children[i + 1].type == "id"){
                    if(FindType(ast.cur.children[i].name, st.cur) != FindType(ast.cur.children[i+1].name, st.cur)){
                        numAnalyzerErrors++;
                        outputMessage("ERROR, can not compare id " + ast.cur.children[i].name + " to type " + FindType(ast.cur.children[i+1].name));
                    }
                }
                if(ast.cur.children[i+1].type != "OP_Equality" && ast.cur.children[i+1] != "Not_Equal"){
                    if(typeOne != typeTwo){
                        numAnalyzerErrors++;
                        outputMessage("ERROR, id " + ast.cur.children[i].name + " can not be compared with " + typeTwo);
                    }
                }
            }
        }
        //If at ) then were done
        if(matchToken(analyzerCurrentToken, "R_Paren")){
            getNextAnalyzerToken();
        }
        
        //Check if weve closed the boolean
        if(closeOut){
            ast.endChildren();
        }
    }
}