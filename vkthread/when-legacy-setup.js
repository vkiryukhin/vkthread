/*
 * this code is needed to start running when() plugin in legacy environments
 */
window.define = function(factory) {
	try{ delete window.define; } catch(e){ window.define = void 0; } // IE
	window.when = factory();
};
window.define.amd = {};