/**
 * worker.js - component of vkThread plugin.  
 */

var JSONfn;
if (!JSONfn) {
    JSONfn = {};
}
(function () {

	JSONfn.parse = function(str) {
		return JSON.parse(str, function(key, value){
			if(typeof value != 'string') return value;
			return ( value.substring(0,8) == 'function') ? eval('('+value+')') : value;
		});
	};
}());

onmessage = function(e) {

	var obj = JSONfn.parse(e.data),
		cntx = obj.cntx ? obj.cntx : self;
	
	if(obj.imprt){
		importScripts.apply(null,obj.imprt);
	}
	
	postMessage(obj.fn.apply(cntx,obj.args));
};


