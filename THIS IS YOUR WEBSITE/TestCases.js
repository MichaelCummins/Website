var project_1 = '{int b = @}$';

var invalidString = 
    "{\n" +
	"	\"two\n" +
	"	lines\"\n" +
	"}$";

var allInvalidCharacters = "{!@#$%^&*()}$";

var givenExamplesProjectOne = "{}$" + "\n"+
                            "{{{{{{}}}}}}$"	+ "\n" +
                            "{{{{{{}}}	/*	comments	are	ignored	*/	}}}}$" + "\n" +
                            "{	/*	comments	are	still	ignored	*/	int	@}$	" + "\n" +
                            "{" + "\n" +
                            "int a"	+ "\n" +
                            "a = a"	+ "\n" +
                            "string	b"	+ "\n" +
                            "a = b"	+ "\n" +
                            "}$";

var givenExamplesProjectThree = "{"	+ "\n"+
                                "int	a"	+ "\n"+
                                "boolean	b"	+ "\n"+
                                "{"	+ "\n"+
                                "string	c"	+ "\n"+
                                "a	=	5	"+ "\n"+
                                "b	=	true		/*	no	comment	*/"	+ "\n"+
                                "c	=	inta"	+ "\n"+
	 		 				    "print(c)"	+ "\n"+
                                "}"	+ "\n"+
                                "print(b)"	+ "\n"+
                                "print(a)"	+ "\n"+
                                "}$"	+ "\n"+
                                "{"	+ "\n"+
                                "int	a"	+ "\n"+
                                "{"	+ "\n"+
                                "boolean	b"	+ "\n"+
                                "a	=	1"	+ "\n"+
                                "}"	+ "\n"+
                                "print(b)"	+ "\n"+
	 		                    "}$" 

var printEOF = "{print($)}" + "\n";

var invalidStringDecl = "{string 3}$";

var noEOP = "{" + "\n" +
            "string b"  + "\n" +
            'b = "no end of program marker"'  + "\n" +
            "}"

var undeclaredVariable = "{" + "\n" +
                         "int a" + "\n" +
                         "a = 2" + "\n" +
                         "a = b" + "\n" +
                         "}$";
var stringEqualsInt = "{" + "\n" +
	"int a" + "\n" +
	"a = 1" + "\n" +
	'if("a"== 3) {' + "\n" +
		"a = 2" + "\n" +
	"}" + "\n" +
"}$"

var redeclaration = "{" + "\n" +
	"int a" + "\n" +
	"a = 9" + "\n" +
	"boolean a" + "\n" +
"}$";

var simple = "{}$";

var printString = "{" + "\n" +
    "string a " + "\n" +
    'a = "hello"'  + "\n" +
    "print(a)" + "\n" +
"}$";

var addThenPrint = "{" + "\n" +
    "int a " + "\n" +
    'a = 1'  + "\n" +
    'a = 1 + 2 + 3 + 4'  + "\n" +
    "print(a)" + "\n" +
"}$";

function fillTextArea(testCase){
    var text;
    switch(testCase){
        case "Select_Test_Case":
            text = "Enter a test case";
            break;
        
        case "Project_1":
            text = project_1;
            break;
            
        case "NeverEndingString":
            text = invalidString;
            break;
            
        case "AllInvalidCharacters":
            text = allInvalidCharacters;
            break;
        case "givenExamplesProjectOne":
            text = givenExamplesProjectOne;
            break;
            
        case "givenExamplesProjectOne":
            text = givenExamplesProjectOne;
            break;
        
        case "givenExamplesProjectThree":
            text = givenExamplesProjectThree;
            break;
        
        case "Print($)":
            text = printEOF;
            break;
        
        case "Invalid String Declaration":
            text = invalidStringDecl;
            break;
        
        case "No EOP marker":
            text = noEOP;
            break;
        
        case "Undeclared Variable":
            text = undeclaredVariable;
            break;
            
        case "String == int":
            text = stringEqualsInt;
            break;
        
        case "Variable Redeclaration":
            text = redeclaration;
            break;
            
        case "Simple":
            text = simple;
            break;
            
        case "Print String":
            text = printString;
            break;
            
        case "Addition then print":
            text = addThenPrint;
            break;
    }
    
    document.getElementById("SourceCodeInput").value = text;
}