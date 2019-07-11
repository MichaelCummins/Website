//-----------------------------------------
// Based on symbol.js
//
// By Tien
// work by Christopher Siena
//-----------------------------------------
// Creates Symbol class for Symbol Table
class Symbol{
	constructor(kind, type, line, scope, scopeLevel, programNumber, initialized, utilized, value){
		this.kind = kind;
		this.type = type;
		this.line = line;
		this.scope = scope;
		this.scopeLevel = scopeLevel;
		this.programNumber = programNumber;
		this.initialized = initialized;
		this.utilized = utilized;
		this.value = value;
	}

	getKind(){
		return this.kind;
	}

	getType(){
		return this.type;
	}

	getLine(){
		return this.line;
	}

	getScope(){
		return this.scope;
	}

	getDetails(){
		var details = {
			type: this.type,
			line: this.line,
			initialized: this.initialized,
			utilized: this.utilized
		};
		return details;
	}
}