//Declare global variables
var tokens = [];
var numErrors = 0;
var EOF; //End of program operator
var program = 1;
var completedPrograms = 0;
var numWarnings = 0;

function lex(userInput){
    tokens = [];
    numErrors = 0;
    numWarnings = 0;
    var currentToken;   //Track what token we are currently handling
    var stillInString;
    var stillInComment;
    //First we look to see if the user submitted anything into the first textfield
    if(trims(userInput) == ""){
        //if they did not we output that there isnt any source code
        outputMessage("Nothing to Lex");
        //Increase the number of errors found
        numErrors++;
        //Return the function as false to stop lexing
        return false;
    }

    /*If the user did not end their input with an End of Program operator
    inform them. First check to see if the very last character of the 
    users input is "$" (End of Program operator) if it is then we dont
    need to display an error message. If not add it to the end
    */
    if(userInput.slice(-1) != EOF){
        //Inform them of the error
        outputMessage( "Warning detected, no end of program operator ($) found");
        //Correct error
        outputMessage("Adding one to the end of your input");
        userInput += EOF;
        //Increase number of errors
        numWarnings++;
    }

    //Create a variable that separates the users input
    //Get the total number of numLines that the user submitted and separate by commas
    //The .replace function removes all comments, will change at a later date how I handle those
    //Found the regular expression used on stackoverflow
    //https://stackoverflow.com/questions/5989315/regex-for-match-replacing-javascript-comments-both-multiline-and-inline
    //Band aid fix while I figure out how to do comments
    //Total number of lines gotten by separting with commas
    //var numLines = userInput.toString().replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '').split("\n");
    var numLines = userInput.toString().split("\n");
    //Line variable is a section of numLines if numLines is printintboolean,intbool,print
    //line would be equal to either 'printintboolean' or 'intbool' or 'print depending on iteration
    var line;
    
    //Search through each line
    for(var currentLine = 0; currentLine < numLines.length; currentLine++){

        //Track what line we are currently on
        line = numLines[currentLine];
        
        if(stillInString){
            outputMessage("ERROR, unterminated string at " + currentLine);
            numErrors++;
            stillInString = false;
        }

        //Search through each column
        for(var currentColumn = 0; currentColumn < line.length; currentColumn++){

            /*If the current program we are lexing is less than 
            the amount of programs that have been completed this pass,
            output that a new program is being lexed now
            */
            if(program != completedPrograms){
                outputMessage("Lexing program " + program + "...");
                completedPrograms++;
            }
            
            /* Track what token we are currently operating on.
            Do this by looking at the current line that is being worked on
            and go to the index of the current column that is being worked on
            */
            //Looking at the nth spot in the line
            currentToken = line[currentColumn];
            
            
            
            if(currentToken == "/" && line[currentColumn + 1] == "*" && !stillInString){
                if(stillInComment){
                    stillInComment = false;
                }else{
                    stillInComment = true;
                }
                currentColumn++;
                continue;
            }
            
            if(currentToken == "*" && line[currentColumn + 1] == "/" && !stillInString){
                if(stillInComment){
                    stillInComment = false;
                }else{
                    stillInComment = true;
                }
                currentColumn++;
                continue;
            }
            
            if(stillInComment){
                continue;
            }

            if(currentToken == '"'){
                addToken('"','"', currentLine, currentColumn);
                if(stillInString){
                    stillInString = false;
                }else{
                    stillInString = true;
                }
                continue;
            }
            
            if(stillInString){
                if(" abcdefghijklmnopqrstuvwxyz".indexOf(currentToken) != -1){
                    addToken("char", currentToken, currentLine, currentColumn);
                    continue;
                }else{
                    outputMessage("ERROR, invalid character at " + currentLine + "," + currentColumn +
                                 " expected a lowercase alphabetic character and received " + currentToken);
                    numErrors++;
                    continue;
                }
                
            }
            
            /*Used method shown in class on what not to do as a baseline
            Then improved it a bit by just looking for the rest of the 
            keyword after the start of a keyword was found

            */
            /*If the current token is 'p' we know 
            we are looking for either 'PRINT' or a 'p' id
            */
            if(currentToken == "p"){
                //Look ahead 1-4 spaces ahead for the remaining letters of PRINT
                if(line[currentColumn + 1] == "r" && line[currentColumn + 2] == "i" 
                   && line[currentColumn + 3 ] == "n" && line[currentColumn + 4] == "t"){
                    //If found add the token print
                    addToken("print", "print", currentLine, currentColumn);
                    //Advance 4 columns to acount for already lexed letters of PRINT
                    currentColumn += 4;
                    //Continue lexing
                    continue;
                }else{
                    //Else add the id p token and continue lexing
                    addToken("id", "p", currentLine, currentColumn);
                    continue;
                }
            }

            /*
            If the current token is 'i' we know 
            we are looking for either 'int' or 'if'
            if we dont find either it is id 'i'
            */
            if(currentToken == "i"){
                if(line[currentColumn + 1] == "n" && line[currentColumn + 2] == "t"){
                    //Add int token
                    addToken("int", "int", currentLine, currentColumn);
                    //Advance two columns to account for 'n' and 't'
                    currentColumn += 2;
                    //Continue lexing
                    continue;
                }else if(line[currentColumn + 1] == "f"){
                    //If the next character is an f we can add the 'if' token
                    addToken("if", "if", currentLine, currentColumn);
                    //Advance 1 currentColumn
                    currentColumn += 1;
                    //continue lexing
                    continue;
                }else{
                    //Else add the 'i' id
                    addToken("id", "i", currentLine, currentColumn);
                    //continue lexing
                    continue;
                }
            }

            /*If the current character being lexed is a 'b',
            we know we are either looking for 'boolean'
            or the id 'b'
            */
            if(currentToken == "b"){
                if(line[currentColumn + 1] == "o" && line[currentColumn + 2] == "o" && line[currentColumn + 3] == "l"
                  && line[currentColumn + 4] == "e" && line[currentColumn + 5] == "a" && line[currentColumn + 6] == "n"){
                    //Add the boolean token to the array
                    addToken("boolean", "boolean", currentLine, currentColumn);
                    //Advance 6 columns to account for already lexed characters
                    currentColumn += 6;
                    //Continue lexing
                    continue;
                }else{
                    //Add 'b' id to the array
                    addToken("id", "b", currentLine, currentColumn);
                    //Continue lexing
                    continue;
                }
            }

            /*If the current character we are lexing is an 'f'
            we know we are either looking for 'false' or the id 'f'
            */
            if(currentToken == "f"){
                if(line[currentColumn + 1] == "a" && line[currentColumn + 2] == "l" 
                   && line[currentColumn + 3] == "s" && line[currentColumn + 4] == "e"){
                    //Add the 'False' token to the array
                    addToken("boolean", "false", currentLine, currentColumn);
                    //Advance 4 columns
                    currentColumn += 4;
                    //Continue lexing
                    continue;
                }else{
                    //Add 'f' id to the array
                    addToken("id", "f", currentLine, currentColumn);
                    //Continue lexing
                    continue;
                }
            }
            //If the current token is 's' we know we are looking for either
            //the keyword 'string' or the 's' id
            if(currentToken == "s"){
                if(line[currentColumn + 1] == "t" && line[currentColumn + 2] == "r" &&
                   line[currentColumn + 3] == "i" && line[currentColumn + 4] == "n" &&
                   line[currentColumn + 5] == "g"){
                    //Add String token
                    addToken("string", "string", currentLine, currentColumn);
                    //Advance 5 columns
                    currentColumn +=5;
                    //Continue lexing
                    continue;
                }else{
                    //Add 's' id
                    addToken("id", "s", currentLine, currentColumn);
                    //Continue lexing
                    continue;
                }
            }

            /* If the current token we are looking at is a 'w'
            we know we are looking for the 'while' keyword or
            the 'w' id
            */
            if(currentToken == "w"){
                if(line[currentColumn + 1] == "h" && line[currentColumn + 2] == "i" && 
                  line[currentColumn + 3] == "l" && line[currentColumn + 4] == "e"){
                    //Add the 'while' token to the array
                    addToken("while", "while", currentLine, currentColumn);
                    //Advance 4 columns
                    currentColumn += 4;
                    //Continue lexing
                    continue;
                }else{
                    //Add the 'w' id to the array
                    addToken("id", "w", currentLine, currentColumn);
                    //Continue lexing
                    continue;
                }
            }

            //If the current token is a bracket, add it as an id
            if(currentToken == "{"){
                addToken("L_Brace", "{", currentLine, currentColumn);
                //Continue lexing
                continue;
            }

            //if the current token is a bracket, add it as an id
            if(currentToken == "}"){
                addToken("R_Brace", "}", currentLine, currentColumn);
                //Continue
                continue;
            }

            //If the current token is a parenthesis, add it as an id
            if(currentToken == "("){
                addToken("L_Paren", "(", currentLine, currentColumn);
                //Continue lexing
                continue;
            }

            //If the current token is a parenthesis, add it as an id
            if(currentToken == ")"){
                addToken("R_Paren", ")", currentLine, currentColumn);
                //Continue lexing
                continue;
            }

            /*If the current token is a digit that is greater than or 
            equal to 0 and less than or equal to 9, push it to the
            arrray
            */
            if(currentToken >= "0" && currentToken <= "9"){
                addToken("digit", currentToken, currentLine, currentColumn);
                //continue
                continue;
            }

            /*If the current token is a '!' we know we are either 
            looking for a not equal operator or just a factorial
            */
            if(currentToken == "!"){
                if(line[currentColumn + 1] == "="){
                    /*If the next column is an equal sign
                    Add the "not equal" token to the array
                    */
                    addToken("Not_Equal", "!=", currentLine, currentColumn);
                    //Advance 1 column for '='
                    currentColumn++;
                    //Continue lexing
                    continue;
                }else{
                    //Add '!' alone
                    //Not sure if this should be an error or not
                    addToken("Factorial", "!", currentLine, currentColumn);
                    //Continue lexing
                    continue;
                }
            }

            /* If the current token is a 't' we know we
            are looking for either the keyword 'true'
            or the id 't'
            */
            if(currentToken == "t"){
                if(line[currentColumn + 1] == "r" && line[currentColumn + 2] == "u" && line[currentColumn + 3] == "e"){
                    //Add "True token to the array
                    addToken("boolean", "true", currentLine, currentColumn);
                    //Advance 3 columns
                    currentColumn += 3;
                    //Continue lexing
                    continue;
                }else{
                    //Add 't' id to the array
                    addToken("id", "t", currentLine, currentColumn);
                    //Continue lexing
                    continue;
                }
            }
      
            if(currentToken == " "){
                //If space continue
                continue;
            }
            if(currentToken == "\n"){
                //If new line go to the next line
                line++;
                continue;
            }
            if(currentToken == "\t"){
                continue;
            }
            if(currentToken == "'"){
                //If single quote add ''' to the array
                addToken("'", "'", currentLine, currentColumn);
                //Continue lexing
                continue;
            }

            /*if we see a single equals sign we know
            we are either looking at an equality or an assignment operator
            If another equals sign follows it is for equality
            If there isnt then it is for assignment
            */
            if(currentToken == "="){
                if(line[currentColumn + 1] == "="){
                    //Add Equality operator to the array
                    addToken("OP_Equality", "==", currentLine, currentColumn);
                    //Advance 1 column
                    currentColumn++;
                    //Continue lexing
                    continue;
                }else{
                    //Add assignment operator to the array
                    addToken("OP_Assignment", "=", currentLine, currentColumn);
                    //Continue lexing
                    continue;
                }
            }

            /*If we see a single plus sign then we know 
            we are either looking at an increment or addition operator
            */
            if(currentToken == "+"){
                if(line[currentColumn + 1] == "+"){
                    //If the next character is another '+' we add
                    //Increment to the array
                    addToken("Increment", "++", currentLine, currentColumn);
                    //Advance 1 column
                    currentColumn++;
                    //Continue lexing
                    continue;
                }else{
                    //Add addition operator to the array
                    addToken("intop", "+", currentLine, currentColumn);
                    //Continue lexing
                    continue;
                }
            }




            //If the current token is the End of Program operator
            if(currentToken == "$"){
                //Add the '$' token to the array
                addToken("EOF", "$", currentLine, currentColumn);
                //Output errors and warnings
      //          outputMessage("Lexing Program " + program + " done \n");
     //           outputMessage("Lexer found " + numErrors + " error(s) & " + numWarnings + " warning(s)");
                //Reset errors and warnings
      //          numErrors = 0;
     //           numWarnings = 0;
                //Output a new line for clarity
                outputMessage("\n");
                //Increment which program is currently being lexed
                program++;
                //Continue with the next program
                continue;
            }

            //Search for every other letter that is not a part
            //of a keyword and make it into an id
            if("acdeghjklmnoqruvxyz".indexOf(currentToken) != -1){
                //Add the id to the array
                addToken("id", currentToken, currentLine, currentColumn);
                //Continue lexing
                continue;
            }
            /*If the character was not found then it was not
            a part of the grammar for the compiler and an error occured
            */
            //Output an error message
            outputMessage("ERROR TOKEN " + currentToken  + " NOT FOUND");
            //Increment the number of errors found so far
            numErrors++;
            //Continue lexing
            continue;
        }
    }
    if(stillInString){
        outputMessage("ERROR, unterminated string");
        numErrors++;
    }
    
    if(numErrors){
        tokens = false;
    }
    
    return tokens;
}