function stringTable(){
    this.variables = {};
}

stringTable.prototype.add = function(address, string){
    this.variables["'" + string + "'"] = new identifierString(address, string);
};

stringTable.prototype.get = function(string){
    try{
        return this.variables["'" + string + "'"].address;
    }catch(e){
        return false;
    }
}


function identifierString(address, string){
    this.address = address;
    this.string = string;
}