/**
 * utils contains the wjs utility object
 * cwd is the directory the task is running in
 * args is the command line arguments converted to an object e.g the arguments of
 * wjs run <your-task> --print --text="Hello World" will be {print:true,text:"Hello World"}
 */
module.exports = function(utils,cwd,args){
    console.log("Hi i am running in "+cwd+" and the option print is "+args.print+" with text as "+args.text);
}