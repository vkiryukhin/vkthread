vkThread
========

is a javascript plugin, which allows you to execute any function of a your code in a thread.

**Standalone function**: simply pass it as an argument to the vkthread(), and get the result in a callback function. You don't need to create a separate file for each thread, like you normally do with a regular worker.

**Object's method**: vkthread accepts context as an optional parameter and executes function in its context. Simply pass the object as a context, that's it.

**Function with dependencies**: vkthread accepts a list of filenames as an optional argument and imports these files in the thread before the function is calling

Here is a basic example:
>
> function sum(num1, num2) {
>     return num1 + num2;
>}

in main thread you execute it this way: 

>
>var foo = sum(2,3);
>

now, let's open a new thread and execute function sum() in this thread.
>
>vkthread.exec(sum, [2,3], function(data){ var foo = data } );
>

See live examples at [http://eslinstructor.net/vkthread](http://eslinstructor.net/vkthread)

vkThread is built on HTML5 "Worker" technology. It also incorporates [JSONfn](http://www.eslinstructor.net/jsonfn/) code to implement the key tasks.
In spite of technical complexity, plugin is super compact. Development version (plain text with comments) is less than 2k. I don't care to minify it.



