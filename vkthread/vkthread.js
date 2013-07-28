/**
 * vkThread - javascript plugin to execute javascript function in a thread.  
 *
 * http://www.eslinstructor.net/vkthread/
 *
 * Version - 0.30.00.beta; 07/2013
 *
 * Copyright (c) 2013 Vadim Kiryukhin ( vkiryukhin @ gmail.com )
 * 
 * Licensed under the MIT license.
 */

(function(){

function vkthread(){

	/* Set a path to the "worker.js" file, which should be 
	 * located in the same folder with vkthread.js (this one). 
	 * User also can provide the path directly with vkthread.setPath() method. 
	 */
	var err;
	try { throw new Error()} 
	catch(e){ err = e.stack}
	
	if (typeof err == 'undefined') {
		this.path = '';
	} else {
		this.path = 'http'+ err.split('http')[1].split('vkthread.js').slice(0,-1) + 'worker.js';
	}
}

/*
 * API function to execute a user's function in a new thread
 */
vkthread.prototype.exec = function(fn, args, cb, context, importFiles){

	var worker = new Worker(this.path),
		obj = {fn:fn, args:args, cntx:false, imprt:false},
		JSONfn = {};
		
	JSONfn.stringify = function(obj) {
		return JSON.stringify(obj,function(key, value){
				return (typeof value === 'function' ) ? value.toString() : value;
			});
	};
	
	if(Array.isArray(context)) {//'context' object is not provided.
		obj.imprt = context;
	} else 
	if(context) {
		obj.cntx = context;
	}
	
	if(importFiles) {
		obj.imprt = importFiles;
	}
	
	worker.onmessage = function (oEvent) {
		cb(oEvent.data);
		worker.terminate();
	};
	
	worker.onerror = function(error) {
      console.error("Worker error: " + error.message);
	  worker.terminate();
    };
	
	worker.postMessage(JSONfn.stringify(obj));
	
};

/* 
 * API function to set a path to worker.js. 
 * It overwrites default setting.
 */
vkthread.prototype.setPath = function(path){ 
	this.path = path
};

window.vkthread = new vkthread();

})();



