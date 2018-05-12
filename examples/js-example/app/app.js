//Declare imports here.
import { $ } from "../webjs_modules/web"
import * as app from "../webjs_modules/app"
import { WJSModule } from "../webjs_modules/definitions";
import * as material from "../webjs_modules/material";
import Controller from "./pages/app.controller";
import { Reflex } from "./reflex.module";
import * as reflex from "./reflex.component";

import { Photo } from "../webjs_modules/media";

class Application {
    constructor(){
        this.myCustomTag = new Reflex.Component(`
            <div class="blue card">
                <p>Hello</p>
            </div>
        `);
    }
    
    //Your apps entry point
    onViewLoad(){
        // document.body.style.background = "linear-gradient(#009688)";
        app.title("Tsowa Mainasara Al-amin")
        document.body.style.overflowX = "hidden";
        // document.body.style.overflowY = "scroll";
        $("head").append("<link rel='stylesheet' href='pages/page.css'/>")
        function sms(number, message){
            if(typeof native !== "undefined"){
                native.sms(number,message);
            }else{
                console.error("Not deployed in android environment");
            }
        }

        function AnimateRotate(e,angle) {
            // caching the object for performance reasons
            var $elem = $(e);
        
            // we use a pseudo object for the animation
            // (starts from `0` to `angle`), you can name it as you want
            $({deg: 0}).animate({deg: angle}, {
                duration: 200,
                step: function(now) {
                    // in the step-callback (that is fired each step of the animation),
                    // you can use the `now` paramter which contains the current
                    // animation-position (`0` up to `angle`)
                    $elem.css({
                        transform: 'rotate(' + now + 'deg)'
                    });
                }
            });
        }

        var HomePage = new Reflex.HTMLRenderer("./pages/app.reflex.html");
        // 1. No source
        HomePage.render(
            {
                component: reflex.Footer,
                tag: "app-footer"
            },
            {
                component: reflex.Skill,
                tag: "skill",
                onRender(elements){
                    var p = new Photo();
                    // alert(p)
                    p.capture(function(file){
                        console.log(file)
                    })
                    var animated = true;
                    var l = elements[0].children[0].style.width;
                    elements[0].children[0].style.width = "0%";
                    $(window).scroll(function(){
                        var $pos = $(window).scrollTop()+innerHeight;

                        // console.log($pos,$(elements[0]).offset().top)

                        if($pos > $(elements[0]).offset().top && animated){
                            $(elements[0].children[0]).animate({
                                width: l
                            },400);
                            animated = false;
                        }
                    })
                }
            },
            {
                component: reflex.TransitioningFloatingActionButton,
                tag: "app-transitioning-fab",
                onRender(element){
                    var deg = 0;
                    $(window).scroll(function(ev){
                        // console.log($(window).scrollTop())
                        var $pos = $(window).scrollTop();
                        // console.log($pos,$("#header").offset().top)
                        if($pos < $("#my-name").offset().top && deg != 0){
                            AnimateRotate(element[0],0);
                            deg = 0;
                        }else if($pos > $("#my-name").offset().top && deg != 180){
                            AnimateRotate(element[0],180);
                            deg = 180;
                        }
                    })

                    // console.log(element)
                    $(element[0]).click(function(){
                        deg = (deg == 180)?0:180;
                        AnimateRotate(element[0],deg);
                        if(deg != 0){
                            $('html,body').animate({ scrollTop: $("#header").offset().top }, 'slow');
                        }else{
                            $('html,body').animate({ scrollTop: 0 }, 'slow');
                        }
                        return false;
                    })
                    setTimeout(function(){
                        $(element[0]).removeClass("scale-out");
                    },500)
                }
            },
            {
                component: reflex.Test,
                tag: "app-large-div",
                onRender(elements){
                    // $(elements[0]).carousel();
                    setTimeout(function(){
                        $(elements[0].children[1]).removeClass("scale-out").addClass("scale-in");
                    },500);
                }
            },
            {
                component: reflex.Header,
                tag: "app-header"
            },
            {
                component: reflex.InfoCard,
                tag: "app-card"
            }
        );
    }
}

app.load(Application)
        