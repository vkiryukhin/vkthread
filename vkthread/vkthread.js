/**
 *  vkThread
 *  is a javascript plugin, which allows you to execute any function of javascript code in a thread.  
 */

(function(){

function vkthread(){

	/* Set a path to the "worker.js" file, which should be located in the same folder with 
	 * vkthread.js (this one). To get path we make a trick by throwing error and parsing 
	 * "Error.stack" property. User also can provide path explicetely with vkthread.setPath() method. 
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



