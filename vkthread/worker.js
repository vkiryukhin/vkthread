/**
 * worker.js - component of vkThread plugin.
 *
 * Copyright (c) 2013 - 2016 Vadim Kiryukhin ( vkiryukhin @ gmail.com )
 * https://github.com/vkiryukhin/vkthread
 * http://www.eslinstructor.net/vkthread/
 *
 */

(function() {
  'use strict';

  var JSONfn = {
    parse:function (str, date2obj) {
          var iso8061 = date2obj ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/ : false;

      return JSON.parse(str, function (key, value) {
        var prefix,
            func, fnArgs, fnBody ;

        if (typeof value !== 'string') {
          return value;
        }
        if (value.length < 8) {
          return value;
        }

        prefix = value.substring(0, 8);

        if (iso8061 && value.match(iso8061)) {
          return new Date(value);
        }
        if (prefix === 'function') {
          return eval('(' + value + ')');
        }
        if (prefix === '_PxEgEr_') {
          return eval(value.slice(8));
        }
        if (prefix === '_NuFrRa_') {
          func = value.slice(8).trim().split('=>');
          fnArgs = func[0].trim();
          fnBody = func[1].trim();
          if(fnArgs.indexOf('(') < 0) {
            fnArgs = '('+ fnArgs +')';
          }
          if(fnBody.indexOf('{') < 0) {
            fnBody = '{ return '+ fnBody +'}';
          }
          return eval('(' + 'function' + fnArgs + fnBody +')');
        }

        return value;
      });
    }
  };

  onmessage = function(e) {
    var obj = JSONfn.parse(e.data, true),
        cntx = obj.context || self;

    if (obj.importFiles) {
      importScripts.apply(null, obj.importFiles);
    }

    if (typeof obj.fn === "function") {
      Promise.resolve(obj.fn.apply(cntx, obj.args))
             .then(function(data){postMessage(data)})
             .catch(function(reason){postMessage(reason)});

    }
    else {
      postMessage(self[obj.fn].apply(cntx, obj.args));
    }
  }

}());

/**
 * XMLHttpRequest using Promise
 * taken from
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * Customized by Vadim Kiryukhin
 */

 function $http(url, _args){

  var args = _args || '';
  // A small example of object
  var core = {

    // Method that performs the ajax request
    ajax: function (method, url, args) {

      // Creating a promise
      var promise = new Promise( function (resolve, reject) {

        // Instantiates the XMLHttpRequest
        var client = new XMLHttpRequest();
        var uri = '';

        if (args && (method === 'POST' || method === 'PUT')) {
          var argcount = 0;
          for (var key in args) {
            if (args.hasOwnProperty(key)) {
              if (argcount++) {
                uri += '&';
              }
              uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
            }
          }
        }

        client.open(method, url);
        client.send(uri);

        client.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            // Performs the function "resolve" when this.status is equal to 2xx
            resolve(this.response);
          } else {
            // Performs the function "reject" when this.status is different than 2xx
            reject(this.statusText);
          }
        };
        client.onerror = function () {
          reject(this.statusText);
        };
      });

      // Return the promise
      return promise;
    }
  };

  // Adapter pattern
  return {
    'get': function() {
      return core.ajax('GET', url, args);
    },
    'post': function() {
      return core.ajax('POST', url, args);
    },
    'put': function() {
      return core.ajax('PUT', url, args);
    },
    'delete': function() {
      return core.ajax('DELETE', url, args);
    }
  };
};
