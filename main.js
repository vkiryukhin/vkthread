
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
	var ret, ix;
	for(ix=0;ix<1e3;ix++){
		ret = str.split(',').join('-');
	}
	return ret;
}

function run_foo(){
	//document.getElementById('demo_result').innerHTML = foo('a,b,c');
	var param = {
		fn: foo,
		args: ['a,b,c'],
		cb: function(data, err){
			if(err) {
				alert(err)
			} else {
				console.log(data);
			}
		}
	};

	vkthread.exec(param);

}
function run_foo_in_thread(){
	var param = {
		fn: foo,
		args: ['a,b,c']
	};

	//vkthread.exec(foo,['a,b,c'], function(data){
	//	document.getElementById('demo_result_thread').innerHTML = data;
	//});
	//vkthread.run(param)
	vkthread.exec(param)
	.then(
		function(data){
			console.log(data);
		},
		function(err){
			alert(err);
		}
	);

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


function run_demo_in_thread(){
	var myDemo = new Demo('aaa,bbb,ccc',7e5),
		param = {
			fn: myDemo.foo,
			context: myDemo,
			cb: function(data){
				document.getElementById('demo_result').innerHTML = data;
			}
		};

	vkthread.exec(param);
}

function run_demo_in_thread_promise(){
	var myDemo = new Demo('aaa,bbb,ccc',7e5),
		param = {
			fn: myDemo.foo,
			context: myDemo
		};

	vkthread.run(param).then(
		function(data){
			document.getElementById('demo_result_thread').innerHTML = data;
		}
	);
}

//-------------------- Dependency --------------------------------//
function bar(arr1,arr2){
	return _.union(arr1,arr2);
}
//function run_bar(){
//	document.getElementById('demo_result').innerHTML = bar([1,2,3],[2,3,4]);
//}
function run_bar_in_thread(){

	var param = {
			fn:bar,
			args: [[1,2,3],[2,3,4]],
			importFiles: ['https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'],
			cb: function(data, err){
				if(err){
					console.log(err);
					return;
				}
				document.getElementById('demo_result').innerHTML = data;
			}
		};

	vkthread.exec(param);
}

function run_bar_in_thread_promise(){

	var param = {
			fn:bar,
			args: [[1,2,3],[2,3,4]],
			importFiles: ['https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js']
		};

	vkthread.run(param).then(
		function(data){
			document.getElementById('demo_result_thread').innerHTML = data;
		},
		function(err){
			console.log(err);
		}
	);
}
//----------------------------------------------------//
function Foobar(arr1,arr2){
	this.arr1 = arr1;
	this.arr2 = arr2;
}
Foobar.prototype.union = function(){
	return _.union(this.arr1,this.arr2);
}
function run_foobar(){
	var myFoobar = new Foobar([1,2,3],[2,3,4]);
	document.getElementById('demo_result').innerHTML = myFoobar.union();
}
function run_foobar_in_thread(){
	var myFoobar = new Foobar([1,2,3],[2,3,4]);
	vkthread.exec(myFoobar.union,[],function(data){
		document.getElementById('demo_result_thread').innerHTML = data;
	},myFoobar,['../js/underscore-min.js']);
}
//----------------------------------------------------//
function run_anonim(){
	document.getElementById('demo_result').innerHTML = (function(ar1,ar2){
									return _.union(ar1,ar2);
								})([1,2,3],[3,4,5]);
}
function run_anonim_in_thread(){
	vkthread.exec(function(ar1,ar2){return _.union(ar1,ar2)},
			[[1,2,3],[3,4,5]],
			function(data){
				document.getElementById('demo_result_thread').innerHTML = data;
			},
			['../js/underscore-min.js']
	);
}
//----------------------------------------------------//
function greetLambda(param) {
	var displayMessage = (function(msg1){
		return function(msg2){
			return msg1 + msg2;
	   }
	}(param));
	return displayMessage("Lambda World!");
}

function run_greetLambda(){
	document.getElementById('demo_result').innerHTML = greetLambda('Hello, ');
}

function run_greetLambda_in_thread(){
	vkthread.exec(greetLambda, ['Hello, '], function(data){
		document.getElementById('demo_result_thread').innerHTML = data;
	});
}
//----------------------------------------------------//
/*
function dummySum(start,end){
	var sum =0,
		ix,
		dummy = 'a,b,c,d,e,f,g';

	for(ix=start; ix<end; ix++){
		dummy.split(',').join('-');
		sum = sum+ix;
	}
	return sum;
}
*/
function dummySum(start,end){
	var sum = 0,
		dummy = 'a,b,c,d,e';

	for(var ix=start; ix<end; ix++){
		dummy.split(',').join('-');
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

    case 'ajax':
			$('#leftpanel').hide();
			$('#rightpanel').empty().load('html/ajax.html',function(){Rainbow.color();});
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

		//case 'function':
		//	$('#leftpanel').show().load('html/basic.html',function(){Rainbow.color();});
		//	$('#rightpanel').empty().load('html/demo.html',function(){Rainbow.color();});
		//	break;

	}

}
