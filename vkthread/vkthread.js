/**
 * vkThread - javascript plugin to execute javascript function(s) in a thread.
 *
 * https://github.com/vkiryukhin/vkthread
 *
 * @version: 2.0.2
 *
 * @author: Vadim Kiryukhin ( vkiryukhin @ gmail.com )
 *
 * Copyright (c) 2016 Vadim Kiryukhin
 *
 * Licensed under the MIT License.
 *
 */

/* jshint maxlen:false */
/* global Promise */

(function(){
'use strict';

/* fragment of JSONfn plugin ( https://github.com/vkiryukhin/jsonfn ) */

  var JSONfn = {
    stringify:function (obj) {
      return JSON.stringify(obj, function (key, value) {
        if (value instanceof Function || typeof value === 'function') {
          return value.toString();
        }
        if (value instanceof RegExp) {
          return '_PxEgEr_' + value;
        }
        return value;
      });
    }
  };


  /* generic worker */

  var workerJs = '(function(){var JSONfn={parse:function(str,date2obj){var iso8061=date2obj?/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/:false;return JSON.parse(str,function(key,value){if(typeof value!="string")return value;if(value.length<8)return value;if(iso8061&&value.match(iso8061))return new Date(value);if(value.substring(0,8)==="function")return eval("("+value+")");if(value.substring(0,8)==="_PxEgEr_")return eval(value.slice(8));return value})}};onmessage=function(e){var obj=JSONfn.parse(e.data,true),cntx=obj.context||self;if(obj.importFiles)importScripts.apply(null,obj.importFiles);if(typeof obj.fn==="function")postMessage(obj.fn.apply(cntx,obj.args));else postMessage(self[obj.fn].apply(cntx,obj.args))}})();';
  var workerBlob = new Blob([workerJs], {type: 'application/javascript'});

  /* constructor */

  function Vkthread(){
      this.getVersion = function(){
          return '2.0.2';
      };
  }

  /**
   *   Execute function in a thread.
   *
   *    @return -- promise object;
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

  Vkthread.prototype.exec = function(param){

    var worker = new Worker(window.URL.createObjectURL(workerBlob)),

        paramObj = {
            fn: param.fn,
            args: param.args,
            context: param.context,
            importFiles:param.importFiles
          },

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

  /**
   *  Execute multiple functions in multiple threads
   *
   *  @return -- promise object;
   *  @args -- array of param objects (see above)
   *
   *  example: vkthread.execAll([param1, param2 ])
   */

  Vkthread.prototype.execAll = function(args){

    var promises = [];

    for(var ix=0; ix<args.length; ix++){
      promises.push( this.exec(args[ix]));
    }

    return Promise.all(promises).then(
      function(values){
        return values;
      }
    );
  };

  window.vkthread = new Vkthread();

}());

