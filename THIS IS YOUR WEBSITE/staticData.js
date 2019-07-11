

//Define static data table
//Based on Sveg
function StaticData(){
    this.currentAddress = 0;
    this.offset = 0;
    this.variables = {};
};

//Adds to the table
StaticData.prototype.add = function (node, scope){
    //TX Defines address
    var adjustedAddress = 'T' + this.currentAddress++;
    //Set Variable value
    this.variables[this.getKey(node, scope)] = new IdentifierVariable(adjustedAddress, this.offset++);
    //Return new address
    return adjustedAddress;
};

//Fetch data from table
StaticData.prototype.get = function (node, scope){
    var identifier = this.variables[this.getKey(node, scope)];
    for (; !identifier;) {
        scope = this.pScope(node.parent, scope);
        identifier = this.variables[node.name + "@" + scope];
    }

    return identifier.address;
};

//Get Where a node is
StaticData.prototype.getKey = function (node, scope){
    var key = node.name + "@" + scope;
    return key;
};

//Get address
StaticData.prototype.length = function (){
    return this.currentAddress;
};

//Get the parent scope
StaticData.prototype.pScope = function (node, scope){
    if (node.scope >= scope) {
        return this.pScope(node.parent, scope);
    } else {
        if (node.scope == undefined){
            numCodeGenErrors++;
            return node.scope;
        } else {
            return node.scope;
        }
    }
};


function IdentifierVariable(address, offset){
    this.address = address;
    this.offset = offset;
};