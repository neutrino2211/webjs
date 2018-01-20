//Declare imports here.
import * as app from "wjs/app"
import { TemplateApplication } from "wjs/definitions";
import * as material from "wjs/material";
import { $ } from "../../webjs_modules/web";


export class TickTockHome extends TemplateApplication{
    constructor(){
        super();

        this.template = `
            <html>
            <head>
                <style type="text/css">
                    html, body {
                        overflow: hidden;
                    }
                    .splash {
                        height: 100vh;
                        width: 100%;
                        background: #ff5722;
                    }
            
                    .logo {
                        font-size: 3em;
                        margin-top: 4em;
                    }
                    .logo span {
                        margin-top: 20%;	
                        /*border: 2px solid #fff;*/
                        /*border-radius: 100%;*/
                        padding: 1em;
                    }
            
                    ul li {
                        margin-right: 1em;
                    }
                </style>
            </head>
            <body class="deep-orange">
                <div class="splash">
                    <ul>
                        <p class="white-text center" id="timer2" style="font-size:3em;font-family:monospace;margin-top:3%;">0:00</p>
                        <!-- <li class="white-text">Second Time: 00:00</li> -->
        
                    </ul>
                    
                    <div class="logo center">
                        <div>
                            <span class="white-text" id="timer1" style="font-family:monospace;">0:00</span>
                        </div>
                        
                    </div>
                    <nav class="transparent center" style="box-shadow: none; margin-top: 36%;">
                        <ul style="margin-left: 35%;">
                            <li><button class="btn-floating btn-large transparent btn-flat" id="reset"><i class="material-icons">replay</i></button></li>
                            <li><button class="btn-floating btn-large red"><i class="material-icons" id="start">play_arrow</i></button></li>
                        </ul>
                    </nav>
            
            
                </div>
            </body>
            </html>
        `;

        this.counting = "";
    }

    /**
     * 
     * @param {Number} time 
     */
    timify(time){
        var seconds = time;
        var minutes = Math.floor(seconds/60);
        if(seconds > 59 ){
            var multiple = Math.floor(seconds/60)
            var multipleSeconds = multiple*60
            seconds = seconds-multipleSeconds;
        }

        return minutes+":"+(seconds<10?"0"+seconds:seconds);
    }

    /**
     * 
     * @param {String} t 
     */
    timeFromString(t){
        var min = t.split(":")[0];
        var sec = t.split(":")[1];
        var minM = min=="0"?0:min;
        var secM = sec=="0"?0:sec;
        return (Number(min)*60)+(Number(sec));
    }

    stopCounting(e){
        clearInterval(e.EVENT);
    }

    /**
     * 
     * @param {HTMLElement} e 
     */
    count(e){
        var self = this;
        var i = this.timeFromString(e.innerText);
        console.log(i);
        // console.log(i);
        e.EVENT = setInterval(function(){
            i++;
            e.innerText = self.timify(i);
        },1000)
    }
    
    //Your apps entry point
    onTemplateLoad(){
        document.body.style.backgroundColor = "#ff5722";
        var self = this;
        var time1 = document.getElementById("timer1");
        var time2 = document.getElementById("timer2");
        var reset = document.getElementById("reset");
        var timeIcon1 = document.getElementById("start");

        this.T1 = time1;
        this.T2 = time2;

        reset.addEventListener("click",function(){
            if(self.counting === ""){

            }else if(self.counting === "t1"){
                clearTimeout(time1.EVENT)
            }else if(self.counting === "t2"){
                clearInterval(time2.EVENT);
            }

            self.counting = "";
            time1.innerText = "0:00";
            time2.innerText = "0:00";
        })

        timeIcon1.addEventListener("click",function(){
            // console.log(time2.EVENT);
            // console.log(time1.EVENT);
            if(self.counting === ""){
                self.count(time1);
                self.counting = "t1";
            }else if(self.counting === "t1"){
                self.counting = "t2";
                clearInterval(time1.EVENT);
                self.count(time2);;
            }else if(self.counting === "t2"){
                self.counting = "t1";
                clearInterval(time2.EVENT);
                self.count(time1);
            }
        },this)

        // document.body.appendChild(time1);
        // document.body.appendChild(time2);
        // document.body.appendChild(timeIcon1);
    }
}