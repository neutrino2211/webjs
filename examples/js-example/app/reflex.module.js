import { parseHTML } from "wjs/app";
import { $ } from "core";

class component {
    /**
     * 
     * @param {String} html 
     */
    constructor(html){
        var self = this;
        this.__html = html;
        this.__parse = "";
    }

    render(tag,callback){
        this.__tag = tag;
        var self = this;
        var tags = document.getElementsByTagName(tag);        
        var d = this.__html.match(/{{([^}]+)}}/g);
        // console.log(d);
        d = d||[];
        // console.log(tags)
        // console.log(tags.length);
        for(var i=0;i<tags.length;i++){
            // console.log(i)
            // tags[i].innerHTML = "";
            d.forEach(function(t,l){
                var dd = t.slice(2,-2).trim();
                // if(dd.startsWith("?") && tags[i].getAttribute("@"+dd.slice(1))==null){
                //     if(l == 0){
                //         self.__parse = self.__html.replace(t,(tags[i].getAttribute("@"+dd)||""))
                //     }else{
                //         self.__parse = self.__parse.replace(t,(tags[i].getAttribute("@"+dd)||""))
                //     }
                // }
                // console.log(dd,tags[i].getAttribute("@"+dd))
                // if(tags[i].getAttribute("@"+dd) == null){
                //     var attrs = tags[i].attributes;

                //     for(var m=0;m<attrs.length;m++){
                //         if(attrs[m] == t){
                //             if(l == 0){
                //                 self.__parse = self.__html.replace(t,(tags[i].getAttribute("@"+dd)||""))
                //             }else{
                //                 self.__parse = self.__parse.replace(t,(tags[i].getAttribute("@"+dd)||""))
                //             }
                //         }
                //     }
                // }
                if(l == 0){
                    self.__parse = self.__html.replace(t,(tags[i].getAttribute("@"+dd)))
                }else{
                    self.__parse = self.__parse.replace(t,(tags[i].getAttribute("@"+dd)))
                }
                // console.log(e.getAttribute("reflex-"+dd),dd)
                // for(var k=0;k<e.attributes.length;k++){
                //     var a = e.attributes[k];
                //     var f = a.split("reflex-")[1];
    
                //     self.__html = self.__html.replace(t,obj[dd])
                // }
            })
            // console.log(tags[i])
            var b = parseHTML((self.__parse != "")?self.__parse:self.__html).body.children;
            console.log()
            for(var j=0;j<b.length;j++){
                // console.log(self.__parse);
                var attrs = b[j].attributes;
                // console.log(attrs.length)
                for(var m=0;m<attrs.length;m++){
                    // console.log(attrs[m].name)
                    if(attrs[m].nodeValue == "null"){
                        b[j].removeAttribute(attrs[m].name);
                    }
                }

                // $(tags[i]).append(b[j]);
                // tags[i].innerHTML = "";
                tags[i].appendChild(b[j])
                // tags[i] = tags[i+1]||tags[i]
                // return;
                // console.log(b[j])
            }
            if(tags[i].getAttribute("@href")){
                var t = tags[i];
                tags[i].onclick = function(){
                    var r = new HTMLRenderer(t.getAttribute("@href"));
                    // console.log(window.__renderers)
                    r.render(window.__renderers);
                }
            }else if(tags[i].getAttribute("@href-to")){
                var t = tags[i];
                tags[i].onclick = function(){
                    var r = new HTMLRenderer(t.getAttribute("@href-to"));
                    // console.log(window.__renderers)
                    r.renderTo(document.getElementById(t.getAttribute("@target")),window.__renderers);
                }
            }

            if(callback){
                callback(tags[i].children);
            }
            // console.log(tags[i])
            // document.body.appendChild(tags[i]);
        }
        // self.__parse = "";
    }
}

class HTMLRenderer {
    
    /**
     * @private this.__component_tag_list
     * @param {String} page 
     */

    constructor(page){
        this.__page = page;
        if(typeof native != "undefined"){
            this.__page = (page.startsWith("./")||page.startsWith("/"))?"file:///android_asset/"+page.split("/").slice(1).join(""):"file:///android_assets/"+page;
        }
        this.__component_tag_list = [];
        this.__component_list = [];
    }

    /**
     * 
     * @param {component} component 
     * @param {String} tag 
     */

    addComponentRenderer(component, tag){
        this.__component_tag_list.push(tag);
        this.__component_list.push(component);
    }

    render(...renderers){
        var self = this;
        window.__renderers = renderers;
        // window.__renderers = window.__renderers[0];
        // console.log(renderers)
        if(Array.isArray(renderers[0])){
            renderers = renderers[0];
            window.__renderers = renderers;
        }
        $.get(this.__page,function(html){
            // console.log(html)
            // var doc = parseHTML(html);
            // console.log(doc);
            // document.body = doc.body;
            document.body.innerHTML = html;
            // self.__component_list.forEach(function(comp,i){
            //     console.log(self.__component_tag_list[i]);
            //     // var c = new component(comp.__html);
            //     comp.render(self.__component_tag_list[i]);
            //     // var tags = doc.getElementsByTagName(self.__component_tag_list[i])
            //     // comp.render(self.__component_tag_list[i]);
            // })
            // console.log(Array.from(window.__renderers));
            renderers.forEach(function(map){
                // console.log(map.component)
                // map.tag.do = map.onRender
                map.component.render(map.tag,map.onRender);
            })
        });
    }

    renderTo(el,...renderers){
        var self = this;
        window.__renderers = renderers;
        // window.__renderers = window.__renderers[0];
        console.log(renderers)
        if(Array.isArray(renderers[0])){
            renderers = renderers[0];
        }
        $.get(this.__page,function(html){
            // console.log(html)
            // var doc = parseHTML(html);
            // console.log(doc);
            // document.body = doc.body;
            el.innerHTML = html;
            // self.__component_list.forEach(function(comp,i){
            //     console.log(self.__component_tag_list[i]);
            //     // var c = new component(comp.__html);
            //     comp.render(self.__component_tag_list[i]);
            //     // var tags = doc.getElementsByTagName(self.__component_tag_list[i])
            //     // comp.render(self.__component_tag_list[i]);
            // })
            // console.log(Array.from(window.__renderers));
            renderers.forEach(function(map){
                // console.log(map.component)
                map.component.render(map.tag);
            })
        });
    }
}

export var Reflex = {
    Component: component,

    HTMLRenderer: HTMLRenderer
}