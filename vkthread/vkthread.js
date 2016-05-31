/**
 * vkThread - javascript plugin to execute javascript function(s) in a thread.
 * https://github.com/vkiryukhin/vkthread
 * http://www.eslinstructor.net/vkthread/
 *
 * @version: 2.00.01
 *
 * @author: Vadim Kiryukhin ( vkiryukhin @ gmail.com )
 * Copyright (c) 2016 Vadim Kiryukhin
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
      this.version = '2.00.01';
      this.getVersion = function(){
          return this.version;
      };
  };



  var workerJs = '(function(){var JSONfn={parse:function(str,date2obj){var iso8061=date2obj?/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/:false;return JSON.parse(str,function(key,value){if(typeof value!="string")return value;if(value.length<8)return value;if(iso8061&&value.match(iso8061))return new Date(value);if(value.substring(0,8)==="function")return eval("("+value+")");if(value.substring(0,8)==="_PxEgEr_")return eval(value.slice(8));return value})}};onmessage=function(e){var obj=JSONfn.parse(e.data,true),cntx=obj.context||self;if(obj.importFiles)importScripts.apply(null,obj.importFiles);if(typeof obj.fn==="function")postMessage(obj.fn.apply(cntx,obj.args));else postMessage(self[obj.fn].apply(cntx,obj.args))}})();';
  var workerBlob = new Blob([workerJs], {type: 'application/javascript'});

  /**
   *   Execute function in a thread.
   *
   *    @param -- object;
   *
   *    @param object has following attributes
   *
   *      @fn          - function to execute                (mandatory)
   *      @args        - array of arguments for @fn          (optional)
   *      @context     - object which will be 'this' for @fn (optional)
   *      @importFiles - array of strings                    (optional)
   *                     each string is a path to a file, which @fn depends on.
   */
/*
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
*/
/////////////////////////////////////////

Vkthread.prototype.exec = function(param){

    var worker = new Worker(window.URL.createObjectURL(workerBlob)),
        _param = {
          fn: param.fn,
          args: param.args,
          context: param.context,
          importFiles:param.importFiles
        },
        cb = param.cb;

    worker.onmessage = function (oEvent) {
      cb(oEvent.data);
      worker.terminate();
    };

    worker.onerror = function(error) {
      cb(null, error.message);
      worker.terminate();
    };

    worker.postMessage(JSONfn.stringify(_param));
  };
////////////////////////////////////////

Vkthread.prototype.run = function(param){

      var worker = new Worker(window.URL.createObjectURL(workerBlob)),
          promise = new Promise(
              function(resolve, reject){

                worker.onmessage = function (oEvent) {
                    resolve(oEvent.data);
                    worker.terminate();
                };

                worker.onerror = function(error) {
                    reject(error.message);
                    worker.terminate();
                };
              }
          );

      worker.postMessage(JSONfn.stringify(param));
      return promise;
  };

/*
  VkThread.prototype.exec = function(param){

      var worker = new Worker(window.URL.createObjectURL(workerBlob)),
          dfr = $q.defer();

      worker.onmessage = function (oEvent) {
          dfr.resolve(oEvent.data);
          worker.terminate();
      };

      worker.onerror = function(error) {
          dfr.reject(new Error('Worker error: ' + error.message));
          worker.terminate();
      };

      worker.postMessage(JSONfn.stringify(param));
      return dfr.promise;
  };

*/

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

/*
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
*/

/**
 * vkthread.runAll() - Promise-style API function ( jQuery-dependent )
 *
 * Execute multiple functions in a thread(s).
 *
 *   @args - Array of Arrays;  In fact, vkthread.runAll() executes multiple vkthread.run().
 *           So, we need to provide arguments for each of them. Each element of the array is
 *           array of arguments for correspondent vkthread.run() function.
 */
/*
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
*/

Vkthread.prototype.runAll = function(args){

    var promises = [];

    for(var ix=0; ix<args.length; ix++){
      promises.push( this.run(args[ix]));
    }

    return Promise.all(promises).then(
          function(values){
            return values;
          }
        );
  };



  window.vkthread = new Vkthread();

}());

