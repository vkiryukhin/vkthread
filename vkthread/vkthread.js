/**
 * vkThread - javascript plugin to execute javascript function(s) in a thread.  
 * https://github.com/vkiryukhin/vkthread
 * http://www.eslinstructor.net/vkthread/
 *
 * @version: 0.57.00 ( February 2014 )
 *
 * @author: Vadim Kiryukhin ( vkiryukhin @ gmail.com )
 * Copyright (c) 2013 Vadim Kiryukhin 
 *
 * Licensed under the MIT License.
 *
 * Function vkthread.exec() can be used with no dependancies;
 * Promise-style functions vkthread.run() and vkthread.runAll() require jQuery library.
 */
 
(function(){
"use strict";

  var JSONfn = {

/* this is a fragment of JSONfn plugin ( https://github.com/vkiryukhin/jsonfn ) */

    stringify:function (obj) {
      return JSON.stringify(obj, function (key, value) {
        if (value instanceof Function || typeof value == 'function') {
          return value.toString();
        }
        if (value instanceof RegExp) {
          return '_PxEgEr_' + value;
        }
        return value;
      });
    }
  };


  function Vkthread(){
/* 
 * Set a path to the "worker.js" file, which should be located in the same 
 * folder with vkthread.js (this one.) To find out the path ee throw "Error" 
 * object and then parse it ( path is a part of the object.)
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

  function _buildObj(obj, fn, args, context, importFiles){

    if(Array.isArray(context)) {
      // the 4-th argument exist, but it is Array, which means 
      // that this is a list of imported files.
      obj.imprt = context;
    } else 
    if(context) {
      obj.cntx = context;
    }
    
    if(importFiles) {
      obj.imprt = importFiles;
    }
  }

/**
 *   vkthread.exec() - Callback-style API function ( no dependency )
 *
 *   Execute function in the thread and process result in callback function.
 *
 *    @fn          - Function;  function to open in a thread;
 *    @args        - Array;     array of arguments for @fn;
 *    @cb          - Function;  callback function to process returned data;
 *    @context     - Object;    object which will be 'this' for @fn.
 *    @importFiles - Array of Strings;  list of files (with path), which @fn depends on. 
 */
 
   Vkthread.prototype.exec = function(fn, args, cb, context, importFiles){

    var worker = new Worker(this.path),
      obj = {fn:fn, args:args, cntx:false, imprt:false};
      
    _buildObj(obj, fn, args, context, importFiles);
    
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


/**
 *   vkthread.run() - Promise-style API function ( jQuery-dependent )
 *
 *   Execute a single function in a thread. 
 *
 *   @fn          - Function;  function to execute in a thread;
 *   @args        - Array;     array of arguments for @fn;
 *   @context     - Object;    object which will be 'this' for @fn.
 *   @importFiles - Array of Strings;  list of files (with path), which @fn depends on. 
 */
  Vkthread.prototype.run = function(fn, args,  context, importFiles){

    var dfr = $.Deferred(),
      worker = new Worker(this.path),
      obj = {fn:fn, args:args, cntx:false, imprt:false};
    
    _buildObj(obj, fn, args, context, importFiles);
    
    worker.onmessage = function (oEvent) {
      dfr.resolve(oEvent.data);
      worker.terminate();
    };
    
    worker.onerror = function(error) {
      dfr.reject(new Error('Worker error: ' + error.message));
      worker.terminate();
    };
    
    worker.postMessage(JSONfn.stringify(obj));
    
    return dfr;
  };

  
/**
 * vkthread.runAll() - Promise-style API function ( jQuery-dependent )
 *
 * Execute multiple functions in a thread(s).
 *
 *   @args - Array of Arrays;  In fact, vkthread.runAll() executes multiple vkthread.run(). 
 *           So, we need to provide arguments for each of them. Each element of the array is 
 *           array of arguments for correspondent vkthread.run() function.  
 */
 
  Vkthread.prototype.runAll = function(args){

    var dfrs = [],
      len = args.length,
      ix; 
    
    for(ix=0; ix<len; ix++){
      dfrs.push( this.run.apply(this,args[ix]));
    }

    return $.when.apply($,dfrs).then(
          function(){
            return Array.prototype.slice.call(arguments);
          }
        );
  };

/** 
 * vkthread.setPath() - API utility to explicitly set path to worker.js. 
 */
 
  Vkthread.prototype.setPath = function(path){ 
    this.path = path;
  };

  window.vkthread = new Vkthread();

}());
 
