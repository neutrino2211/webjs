import { parseHTML } from "wjs/app";
export class Reflex{
    /**
     * 
     * @param {String} html 
     */
    constructor(html){
        this.__html = html;
    }

    render(tag){
        var self = this;
        var tags = document.getElementsByTagName(tag);        
        var d = this.__html.match(/{{(.*)}}/g);
        // console.log(d);
        d = d||[];
        d.forEach(function(t){
            var dd = t.slice(2,-2);
            // console.log(dd)
            var bb = tags;
            for(var j=0;j<bb.length;bb++){
                var e = bb[j];

                self.__html = self.__html.replace(t,e.getAttribute("reflex-"+dd))
                // console.log(e.getAttribute("reflex-"+dd),dd)
                // for(var k=0;k<e.attributes.length;k++){
                //     var a = e.attributes[k];
                //     var f = a.split("reflex-")[1];

                //     self.__html = self.__html.replace(t,obj[dd])
                // }
            }
        })
        var b = parseHTML(this.__html).body.children;

        for(var i=0;i<tags.length;i++){

            for(var j=0;j<b.length;j++){
                tags[i].appendChild(b[j]);
            }

        }
    }
}