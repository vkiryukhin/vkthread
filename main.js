
$(document).ready(function()
{
	if( typeof Worker == 'undefined'){
		document.getElementById('notsupported').innerHTML = "Sorry, this browser doesn't support Worker.";
	}
	$('#leftpanel').hide();
	$('#rightpanel').empty().load('html/overview.html',function(){Rainbow.color();});
	notsupported


});

function foo(str) {
	var ret;
	for(var ix=0; ix<1e7; ix++){
		ret = str.split(',').join('-');
	}
	return ret;
}

function run_foo_in_thread(){
	var param = {
		fn: foo,
		args: ['a,b,c']
	};

	vkthread.exec(param)
	.then(
		function(data){
			document.getElementById('demo_result_thread').innerHTML = data;
		},
		function(err){
			alert(err);
		}
	);

}

function fooCb (data) {
	document.getElementById('demo_result_thread').innerHTML = data.toUpperCase();
}

function run_foo_in_thread_cb(){
	var param = {
		fn: foo,
		args: ['a,b,c'],
		cb:fooCb
		//cb: (data) => alert(data)
	};

	vkthread.exec(param);
}
//-------------------- Context --------------------------------//
function Demo(str, max){
	this.str = str;
	this.max = max;
}

Demo.prototype.foo = function(){
	var ret, ix;

	for(ix=0;ix<this.max;ix++){
		ret = this.str.split(',').join('-');
	}
	return ret;
};


function run_demo_in_thread_promise(){
	var myDemo = new Demo('aaa,bbb,ccc',7e5),
		param = {
			fn: myDemo.foo,
			context: myDemo
		};

	vkthread.exec(param).then(
		function(data){
			document.getElementById('demo_result_thread').innerHTML = data;
		}
	);
}

function run_demo_in_thread_promise_cb(){
	var myDemo = new Demo('aaa,bbb,ccc',7e5),
		param = {
			fn: myDemo.foo,
			context: myDemo,
			cb:function(data){document.getElementById('demo_result_thread').innerHTML = data;}
		};

	vkthread.exec(param);
}

//-------------------- Dependency --------------------------------//
function bar(arr1,arr2){
	return _.union(arr1,arr2);
}

function run_bar_in_thread_promise(){

	var param = {
			fn:bar,
			args: [[1,2,3],[2,3,4]],
			importFiles: ['https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js']
		};

	vkthread.exec(param).then(
		function(data){
			document.getElementById('demo_result_thread').innerHTML = data;
		}
	);
}

function run_bar_in_thread_promise_cb(){

	var param = {
			fn:bar,
			args: [[1,2,3],[2,3,4]],
			importFiles: ['https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'],
			cb: function(data){document.getElementById('demo_result_thread').innerHTML = data;}
		};

	vkthread.exec(param);
}

//----------------------------------------------------//
function Foobar(arr1,arr2){
	this.arr1 = arr1;
	this.arr2 = arr2;
}

Foobar.prototype.union = function(){
	return _.union(this.arr1,this.arr2);
}

function run_foobar_in_thread(){
	var myFoobar = new Foobar([1,2,3], [2,3,4]);

	var param = {
			fn: myFoobar.union,
			context: myFoobar,
			importFiles: ['https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js']
		};

	vkthread.exec(param).then(
		function(data){
			document.getElementById('demo_result_thread').innerHTML = data;
		}
	);
}

function run_foobar_in_thread_cb(){
	var myFoobar = new Foobar([1,2,3], [2,3,4]);

	var param = {
			fn: myFoobar.union,
			context: myFoobar,
			importFiles: ['https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'],
			cb: function(data){
				document.getElementById('demo_result_thread').innerHTML = data;
			}
		};

	vkthread.exec(param);
}

//----------------------------------------------------//

function run_anonim_in_thread(){

	var param = {
		//fn: (arr) => arr.map(Math.sqrt),
		fn: function(arr){
				return arr.map(Math.sqrt)
			},
		args: [[1, 4, 9]]
	}

	vkthread.exec(param).then(
		function(data){
			document.getElementById('demo_result_thread').innerHTML = data;
		}
	);

}

function run_anonim_in_thread_cb(){

	function display(data){
		document.getElementById('demo_result_thread').innerHTML = data;
	}

	var param = {
		fn: function(arr){
				return arr.map(Math.sqrt)
			},
		args: [[1, 4, 9]],
		cb: display
	}

	vkthread.exec(param);
}

//----------------------------------------------------//

function greetLambda(arg) {
	var displayMessage = (function(msg1){
		//return (msg2) => msg1 + msg2;
		return function(msg2){ return msg1 + msg2}
	}(arg));
	return displayMessage("Lambda World!");
}

function run_greetLambda_in_thread(){

	var param = {
		fn: greetLambda,
		args: ['Hello, ']
	}

	vkthread.exec(param).then(
		function(data){
			document.getElementById('demo_result_thread').innerHTML = data;
		}
	);
}

function run_greetLambda_in_thread_cb(){

	function print(data){
		document.getElementById('demo_result_thread').innerHTML = data;
	}
	var param = {
		fn: greetLambda,
		args: ['Hello, '],
		cb:print
	}

	vkthread.exec(param);
}


//----------------------------------------------------//
//External
function run_external_in_thread(){
	var param = {
	    fn:'makeNamesUpper',
	    args: [['one', 'two', 'three']],
	    importFiles:[location.href + 'js/my_utils.js']
	 };

	vkthread.exec(param).then(
       function (data) {
          document.getElementById('demo_result_thread').innerHTML = data;
        }
   );
}


function run_external_in_thread_cb(){
	var param = {
	    fn:'makeNamesUpper',
	    args: [['one', 'two', 'three']],
	    importFiles:[location.href + 'js/my_utils.js'],
	    //url:location.href+'html/http_post.php'
	    cb:function(data){
	    	document.getElementById('demo_result_thread').innerHTML = data;
	    }
	 };

	vkthread.exec(param);
}

function normalize(arr){
	return arr.map(function(elm){
		return elm.trim().toLowerCase();
	});
}


function execAll_normalize(){

	var arr = ['ONE ', ' TWo ', 'ThReE', 'FouR ', ' Five ', 'sIX', '      SEVEn'],

		param1 = {
			fn: normalize,
			args: [arr.slice(0,3)]
		},
		param2 = {
			fn: normalize,
			args: [arr.slice(3, arr.length)]
		};

	vkthread.execAll([param1,param2]).then(
      function (data) {
        document.getElementById('demo_result').innerHTML = data[0].concat(data[1]);
      }
  );


}

function dummySum(start,end){
	var sum = 0;

	for(var ix=start; ix<end; ix++){
		sum = sum+ix;
	}
	return sum;
}

function run_dummySum(){

	var param = {
		fn: dummySum,
		args:[[0,8e4]]
	}
	vkthread.exec(param).then(
		function (data) {
			document.getElementById('demo_result')
					.innerHTML = data;
		},
		function(err) {
			document.getElementById('demo_result')
					.innerHTML = err;
		}
	)
}

function run_dummySum_time(){
	var param = {
		fn: dummySum,
		args: [0, 1e7]
	},
	d1= +(new Date());

	vkthread.run(param)
			.then(
				function (data) {
					var timeSpan = (+(new Date())-d1)/1000;
					document.getElementById('demo_result')
							.innerHTML = data + ' : ' + timeSpan + ' sec';
				},
				function(err) {
					document.getElementById('demo_result').innerHTML = err;
				}
			)
}

function runAll_dummySum(){
	var param1 = {
		fn: dummySum,
		args: [0, 5]
	},
	param2 = {
		fn: dummySum,
		args: [5, 10]
	};

	vkthread.exec([ param1, param2]).then(
		function (data) {
			document.getElementById('demo_result').innerHTML = data[0] + data[1];
		},
		function(err) {
			document.getElementById('demo_result').innerHTML = err;
		}
	)
}

function runAll_dummySum_time(){

	var param1 = {
		fn: dummySum,
		args: [0, 5e6]
	},
	param2 = {
		fn: dummySum,
		args: [5e6, 1e7]
	},
	d1= +(new Date());

	vkthread.runAll([param1,param2]).then(
				function (data) {
					var timeSpan = (+(new Date())-d1)/1000;
					document.getElementById('demo_result_thread')
							.innerHTML = data[0]+data[1] + ' : ' + timeSpan + ' sec';
				},
				function(err) {
					document.getElementById('demo_result_thread').innerHTML = err;
				}
			)
}

function run_ajax(){

  function foo(url) {
    var httpRequest,
         ret;

    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          ret = httpRequest.responseText;
        } else {
          ret = 'There was a problem with the request.';
        }
      }
    };

    // IMPORTANT: ajax must perform the operation synchronously
    // (the 3-rd arg is false); as ajax is executed in a thread, it's OK.
    httpRequest.open('GET', url, false);
    httpRequest.send();

    return ret;
  }

  function bar() {
    var httpRequest,
        ret;

    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          var url = httpRequest.responseText;
          vkthread.exec(foo, [url],
              function(data){
                document.getElementById('demo_result').innerHTML = data;
              });
        } else {
          ret = 'There was a problem with the request.';
        }
      }
    };

    httpRequest.open('GET', 'examples/geturl.txt');
    httpRequest.send();

    return ret;
  }

  bar();
}

//----------  Promise --------------------------------//
/*
function promiseTest(){
		var promise = new Promise(function(resolve, reject){
			setTimeout( function(){
				resolve('I am success');
				//reject('I am rejected');
			}, 1000);
		});
		return promise;
}
*/

//-----------------
/*
function promiseTestGET(url){

	return vkhttp(url).get().then(function(data){

        var obj = JSON.parse(data)
        			  .sort( (a,b) => b.stargazers_count - a.stargazers_count )[0];

		return obj.name + ' : ' + obj.stargazers_count + ' stars';
	});
}

function run_promiseTestGET_in_thread(){
	var param = {
		fn: promiseTestGET,
		args:['https://api.github.com/users/vkiryukhin/repos']
	};

	vkthread.exec(param)
	.then(
		function(data){
			document.getElementById('demo_result_thread').innerHTML = data;
		},
		function(err){
			alert(err);
		}
	);
}
*/

function getTop(config, suffix){

	function doSort(a,b){
		return  b.stargazers_count - a.stargazers_count;
	}

	var data = vkhttp(config),
        obj = JSON.parse(data).sort(doSort)[0];

	return obj.name + ' : ' + obj.stargazers_count + ' stars' + '  ' + suffix;
}

function run_promiseTestGET_in_thread(){

	var param = {
		fn: getTop,
		args:[
				{ url:'https://api.github.com/users/vkiryukhin/repos'},
				'WOW!'
			]
	};

	vkthread.exec(param)
	.then(
		function(data){
			document.getElementById('demo_result_thread').innerHTML = data;
		},
		function(err){
			alert(err);
		}
	);
}

function run_callbackTestGET_in_thread(){
	var param = {
		fn: getTop,
		args:[
				{ url:'https://api.github.com/users/vkiryukhin/repos'},
				'Good!'
			],
		cb: function(data){document.getElementById('demo_result_thread').innerHTML = data;}
	};

	vkthread.exec(param);
}

//--------------
/*
function promiseTestPOST(url, args){

	return vkhttp(url, args).post().then(
		function(data){
			var str = data.toUpperCase() + '!';
			return str;
		});
}

function run_promiseTestPOST_in_thread(){

	var param = {
		fn: promiseTestPOST,
		args:[ location.href+'html/http_post.php',
			  {firstname:'John', lastname:'Dow'}
			 ]
	};

	vkthread.exec(param)
	.then(
		function(data){
			document.getElementById('demo_result_thread_2').innerHTML = data;
		},
		function(err){
			alert(err);
		}
	);
}
*/
//----------------------------------------------------//

function toUpper(config, prefix){
	var data = vkhttp(config);
	return prefix + ' ' + data.toUpperCase() + '!';
}

function run_promiseTestPOST_in_thread(){
	var param = {
		fn: toUpper,
		args:[
				{ url:location.href+'html/http_post.php',
				  method:'POST',
				  body: {firstname:'John', lastname:'Dow'}
				},
				'server says: '
			]
	};

	vkthread.exec(param)
	.then(
		function(data){
			document.getElementById('demo_result_thread_2').innerHTML = data;
		},
		function(err){
			alert(err);
		}
	);

}

function run_callbackTestPOST_in_thread(){

var param = {
		fn: toUpper,
		args:[
				{ url:location.href+'html/http_post.php',
				  method:'POST',
				  body: {firstname:'John', lastname:'Dow'}
				},
				'server says: ',
			],
		cb: function(data){
			document.getElementById('demo_result_thread_2').innerHTML = data;
		}
	};

vkthread.exec(param);
}


//----------------------------------------------------//
function loadTemplate(name)
{
	switch(name) {

		case 'overview':
			$('#leftpanel').hide();
			$('#rightpanel').empty().load('html/overview.html',function(){Rainbow.color();});
			break;

		case 'function':
			$('#leftpanel').hide();
			$('#rightpanel').empty().load('html/function.html',function(){Rainbow.color();});
			break;

		case 'context':
			$('#leftpanel').hide();
			$('#rightpanel').empty().load('html/context.html',function(){Rainbow.color();});
			break;

		case 'dependency':
			$('#leftpanel').hide();
			$('#rightpanel').empty().load('html/dependency.html',function(){Rainbow.color();});
			break;

		case 'cntx_depend':
			$('#leftpanel').hide();
			$('#rightpanel').empty().load('html/context_depend.html',function(){Rainbow.color();});
			break;

		case 'anonym':
			$('#leftpanel').hide();
			$('#rightpanel').empty().load('html/anonymous.html',function(){Rainbow.color();});
			break;

		case 'lambda':
			$('#leftpanel').hide();
			$('#rightpanel').empty().load('html/lambda.html',function(){Rainbow.color();});
			break;

		case 'remote':
			$('#leftpanel').hide();
			$('#rightpanel').empty().load('html/external.html',function(){Rainbow.color();});
			break;

    case 'ajax':
			$('#leftpanel').hide();
			$('#rightpanel').empty().load('html/http.html',function(){Rainbow.color();});
			break;

		case 'run':
			$('#leftpanel').hide();
			$('#rightpanel').empty().load('html/run.html',function(){Rainbow.color();});
			break;

		case 'run_all':
			$('#leftpanel').hide();
			$('#rightpanel').empty().load('html/run_all.html',function(){Rainbow.color();});
			break;

		case 'multicore_demo':
			$('#leftpanel').hide();
			$('#rightpanel').empty().load('html/multicore_demo.html',function(){Rainbow.color();});
			break;

		case 'doc':
			$('#leftpanel').hide();
			$('#rightpanel').load('html/doc.html',function(){
								Rainbow.color();
								$(function() {
									$( "#accordion" ).accordion({collapsible: true,
																 active:false,
																 heightStyle: "content"});
								});
							});
			break;

	}

}
