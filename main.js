
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
	for(ix=0;ix<10e6;ix++){
		ret = str.split(',').join('-');
	}
	return ret;
}

function run_foo(){
	document.getElementById('demo_result').innerHTML = foo('a,b,c');
}
function run_foo_in_thread(){
	vkthread.exec(foo,['x,y,z'], function(data){
		document.getElementById('demo_result_thread').innerHTML = data;
	});
}
//----------------------------------------------------//
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

function run_demo(){
	var myDemo = new Demo('aaa,bbb,ccc',7e6);
	document.getElementById('demo_result').innerHTML = myDemo.foo();
}
function run_demo_in_thread(){
	var myDemo = new Demo('xxx,yyy,zzz',7e6);
	vkthread.exec(myDemo.foo,[], function(data){
		document.getElementById('demo_result_thread').innerHTML = data;
	},myDemo);
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
		
		case 'doc':
			$('#leftpanel').hide();
			$('#rightpanel').load('html/doc.html',function(){Rainbow.color();});
			break;
	
		//case 'function':
		//	$('#leftpanel').show().load('html/basic.html',function(){Rainbow.color();});
		//	$('#rightpanel').empty().load('html/demo.html',function(){Rainbow.color();});
		//	break;
			
	}
	
}
