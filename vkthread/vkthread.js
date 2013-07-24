/**
 * vkThread - javascript plugin, which allows to execute any function of javascript code in a thread.  
 *
 * Version - 0.2.00.beta 
 * Copyright (c) 2013 Vadim Kiryukhin; 
 * vkiryukhin @ gmail.com
 * http://www.eslinstructor.net/vkthread/
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 *  USAGE:
 * 
 *  vkthread.exec(fn, args, callback[, context][, dependencies]);
 *  @fn == Function to execute;
 *  @args == Array; function's arguments. If no arguments, provide empty attay [].
 *  @callback == Function;
 *  @dependencies == String; comma-separated list of files, @fn dependents on.
 *
 *	Example:
 *
 *  vkthread.exec( foo,          // function to execute
 *				  ['abc','xyz'],  // function's arguments
 *				  function(data){alert( data)}, //callback function
 *			  	  {bar:123},      // context object
 *			  	  'js/helper.js'  // files, which function depends on.
 *			  )
 */

(function(){

function vkthread(){

	/* Set a path to the "worker.js" file, which should be located in the same folder with 
	 * vkthread.js (this one). To get path we make a trick by throwing error and parsing 
	 * "Error.stack" property. User also can provide path explicitly with vkthread.setPath() method. 
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

window.vkthread = new vkthread();

})();



