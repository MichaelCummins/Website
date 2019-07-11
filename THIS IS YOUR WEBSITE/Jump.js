//Contains jump attrobutes
function jump(){
    this.address = 0;
    this.variables = {};
}

//Add address to the jump table
jump.prototype.add = function (initialAddress){
    var temporaryAddress = "J" + this.address++;
    this.variables[temporaryAddress] = new jumpVariable(initialAddress);
    return temporaryAddress;
}

//Get address from the table
jump.prototype.get = function(address){
    return this.variables[address];
}

//Contains starting and ending address of a jump
function jumpVariable(initialAddress){
    this.initialAddress = initialAddress;
    this.endingAddress = null;
}