export const modules = {};
export const $ = window.$;
export var body = document.body;
export function styleSheet(location){
    $("head").append("<link rel='stylesheet' type='text/css' href="+location+">");
}
export function build(path){
    $("head").append("<script src='"+path+".js'></script>");
}
export function use(id){
    build("WTS/"+id);

    return modules[id]
}

export function print(...args){
    document.write(...args);
}

export function entry(func){
    // document.addEventListener('deviceready', func, false);
    var app = new func()

    app.main()

    console.log(app)
}

export class WEBJS{
    /**
     * @property {HTMLElement} element
     * @param {Object} options 
     */
    constructor(options){
        this.isRendering = false;
        var element = options.element;
        var data    = options.data;

        var $el     = options.el;

        $el.WJSNamespace = {};

        var $ns = $el.WJSNamespace;

        $ns.data = data;

        // var $elA = $el.getAttribute;

        // console.log($el.getAttribute("wjs-for"))

        var c = this;

        Object.defineProperty($el,"innerText",{
            set: function(v){
                // console.log(v);
                this.innerHTML = v;
            },
            get: function(){
                return this.innerHTML;
            }
        })

        if($el.getAttribute("wjs-for")){
            var item = $el.getAttribute("wjs-for").split("in")[0].trim();
            var items = $el.getAttribute("wjs-for").split("in")[1].trim();

            // console.log($ns.data[items])

            if($ns.data[items]){
                this.$render($el,$ns,$ns.data[items],"fl");
            }
        }
    }

    /**
     * 
     * @param {HTMLElement} el 
     */

    $render(el,namespace,d,o){
        this.isRendering = true;
        // console.log(el.innerHTML);
        var rxp = /{{([^}]+)}}/g;
        var ins = el.innerText;
        var iterable = el.innerHTML.match(rxp);
        // var t = el.cloneNode(true);

        console.log(iterable);

        if(o == "fl"){
            var div = document.createElement("div");
            document.body.appendChild(div);
            d.forEach((v,j)=>{
                
                var c = el.cloneNode(true);

                if(j==0){
                    var inside = ins;
                    iterable.forEach((t,i)=>{
                        t = t.slice(2,-2);
                        var list  = t.split(".");
                        // console.log(list);
                        var modules ;
                        if(list.length > 0){
                            modules = d[j][list[1]];
                        }else{
                            modules = d[j][list[0]]
                        }
                        for(var k = 2;k<list.length;k++){
                            modules = modules[list[k]];
                        }

                        if(!modules){
                            modules = v;
                        }

                        inside = inside.replace(iterable[i],modules);
                        console.log(modules,t,inside)
                    })
                    el.innerText = inside;
                    div.appendChild(el)
                }else{
                    var inside = ins;
                    iterable.forEach((t,i)=>{
                        t = t.slice(2,-2);
                        var list  = t.split(".");
                        // console.log(list);
                        var modules ;
                        if(list.length > 0){
                            modules = d[j][list[1]];
                        }else{
                            modules = d[j][list[0]]
                        }
                        for(var k = 2;k<list.length;k++){
                            modules = modules[list[k]];
                        }

                        if(!modules){
                            modules = v;
                        }

                        // console.log(d[j])
                        inside = inside.replace("{{"+t+"}}",modules);
                    })
                    c.innerText = inside;
                    // console.log(c);
                    div.appendChild(c)
                    // document.body.appendChild(c);
                }
            })
        }
        this.isRendering = false;
    }
}