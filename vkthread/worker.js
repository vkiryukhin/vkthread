/**
 * worker.js - component of vkThread plugin.  
 * it doesn't have public interface; used implicitely by vkthread.js 
 */

var JSONfn;
if (!JSONfn) {
    JSONfn = {};
}
(function () {

	JSONfn.parse = function(str) {
		return JSON.parse(str,function(key, value){
			if(typeof value != 'string') return value;
			return ( value.substring(0,8) == 'function') ? eval('('+value+')') : value;
		});
	};
}());

self.onmessage = function(e) {

	var obj = JSONfn.parse(e.data),
		cntx = obj.cntx ? obj.cntx : self;
	
	if(obj.imprt){
		importScripts(obj.imprt); 
	}

	postMessage(obj.fn.apply(cntx,obj.args));

	self.close();
	
};


