/**
 * function vkthread() 
 */

(function(){

function vkthread(){
	/* In this constructor we want to find a peth to the file. We use Error.stack property,
	 * which is available in modern browsers, but IE9 doesn't support it (IE10 does). If we 
	 * are not able to find it (IE9), user must provide path with vkthread.setPath() method. 
	 */
	var err;
	try { throw new Error()} 
	catch(e){ err = e.stack}
	
	if (typeof err == 'undefined') {
		this.path = '';
	} else {
		this.path = 'http'+ err.split('\n')[1].split('http')[1].split('vkthread.js').slice(0,-1) + 'worker.js';
	}
}

vkthread.prototype.exec = function(fn, args, cb, context, importFiles){

	var myWorker = new Worker(this.path),
		obj = {fn:fn, args:args, cntx:false, imprt:false},
		JSONfn = {};
		
	JSONfn.stringify = function(obj) {
		return JSON.stringify(obj,function(key, value){
				return (typeof value === 'function' ) ? value.toString() : value;
			});
	};
	
	if(typeof context == 'string') {//'context' object is skept.
		obj.imprt = context;
	} else 
	if(context) {
		obj.cntx = context;
	}
	
	if(importFiles) {
		obj.imprt = importFiles;
	}
	
	myWorker.onmessage = function (oEvent) {
		cb(oEvent.data);
	};
	myWorker.postMessage(JSONfn.stringify(obj));
	
};

vkthread.prototype.setPath = function(path){ this.path = path};
vkthread.prototype.getPath = function(path){return this.path};

window.vkthread = new vkthread();

})();



