/**
 * vkThread - javascript plugin to execute javascript function(s) in a thread.  
 * http://www.eslinstructor.net/vkthread/
 *
 * @version: 0.40.00.alpha; 08/2013
 *
 * @author: Vadim Kiryukhin ( vkiryukhin @ gmail.com )
 * Copyright (c) 2013 Vadim Kiryukhin 
 *
 * Licensed under the MIT License.
 */
 
(function(){

/**
* JSONfn - javascript plugin to stringify/parse objects with function(s)
*          http://www.eslinstructor.net/jsonfn/
*/

var JSONfn;
if (!JSONfn) {
    JSONfn = {};
}

(function () {

	JSONfn.stringify = function(obj) {
		return JSON.stringify(obj,function(key, value){
				return (typeof value === 'function' ) ? value.toString() : value;
			});
	};

	JSONfn.parse = function(str) {
		return JSON.parse(str,function(key, value){
			if(typeof value != 'string') {
				return value;
			}
			return ( value.substring(0,8) === 'function') ? eval('('+value+')') : value;
		});
	};
}()); 


function Vkthread(){

	/* 
	 * Set a path to the "worker.js" file, which should be 
	 * located in the same folder with vkthread.js (this one). 
	 * User also can provide the path directly with vkthread.setPath() method. 
	 */
	var err;
	try { 
		throw new Error();
	} 
	catch(e){ 
		err = e.stack;
	}
	
	if (err === 'undefined') {
		this.path = '';
	} else {
		this.path = 'http'+ err.split('http')[1].split('vkthread.js').slice(0,-1) + 'worker.js';
	}
}

/*
 * API function to open a new thread and execute a user's function in the thread. 
 * Process the result in a callback function, provided by user.
 */
 
 Vkthread.prototype.exec = function(fn, args, cb, context, importFiles){

	var worker = new Worker(this.path),
		obj = {fn:fn, args:args, cntx:false, imprt:false};

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
 	  cb(null, error.message);
	  worker.terminate();
    };
	
	worker.postMessage(JSONfn.stringify(obj));
};

/*
 * API function to open a new threade and execute a user's function 
 * in the thread. Returns deferred object.
 */
 
Vkthread.prototype.run = function(fn, args,  context, importFiles){
	
	var dfr = when.defer(),
		worker = new Worker(this.path),
		obj = {fn:fn, args:args, cntx:false, imprt:false};

	if(Array.isArray(context)) {
		/* "context" object is not provided.*/
		obj.imprt = context;
	} else 
	if(context) {
		obj.cntx = context;
	}
	
	if(importFiles) {
		obj.imprt = importFiles;
	}
	
	worker.onmessage = function (oEvent) {
		dfr.resolve(oEvent.data);
		worker.terminate();
	};
	
	worker.onerror = function(error) {
	  dfr.reject(new Error('Worker error: ' + error.message));
	  worker.terminate();
    };
	
	worker.postMessage(JSONfn.stringify(obj));
	
	return dfr.promise;
};

/*
 * API function to execute a multiple user's function 
 * and return array of deferred objects
 */
Vkthread.prototype.runAll = function(args){

	var dfrs = [],
		len = args.length,
		ix; 
	
	for(ix=0; ix<len; ix++){
		dfrs.push( this.run.apply(this,args[ix]));
	}

	return when.all(dfrs);
};

/* 
 * API function to set a path to worker.js 
 * It overwrites default setting.
 */
Vkthread.prototype.setPath = function(path){ 
	this.path = path;
};

window.vkthread = new Vkthread();

}());
 
