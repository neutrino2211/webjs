import {TemplateApplicationPage} from "wjs/definitions"
// import {actionButton} from "wjs/ui"
import * as material from "../../webjs_modules/material"
import { LoginPage } from "./login";
import { $ } from "core"
import * as app from "wjs/app";

export class HomePage extends TemplateApplicationPage{
    /**
     * 
     * @param {HTMLElement} element 
     */
    constructor(element){
        super(element)
        String.prototype.__funky = function(){alert(this)};

        document.getElementById("nav").appendChild(material.icons.user);

        window.messages = 1;

        document.getElementById("Title").innerText = "Chat";

        material.createElementClass("large_icons",{
            "font-size": "100%"
        })

        material.createElementClass("avatar-large",{
            "border-radius": "50%",
            "background-color": "blue",
            "font-size": "40px",
            "color": "white",
            "width": "60px"
        })

        material.createElementClass("avatar-text",{
            "text-align": "center"
        })

        material.createElementClass("disabled",{
            color: "rgba(255, 255, 255, 0.3)"            
        })

        var myIcon = material.setElementClass(material.icons.add,"large_icons")

        var floatingActionButton = material.floatingActionButton({
            color: "blue waves-effect",
            icon: myIcon,
            size: ""
        });

        var slide = document.getElementById("slideout");

        floatingActionButton.id = "fab";
        this.color = material.colors.random();
        console.log(material.ui.row());

        floatingActionButton.onclick = ()=>{
            if(floatingActionButton.style.display != "none"){
                floatingActionButton.style.display = "none";
                element.appendChild(app.JSX(()=>{
                    return `
                        <div class="navbar navbar-fixed-bottom card" id="text">
                            <input type="text" id="message" style="width:80%;margin-left:10%;"></input>
                            <!--<div class="btn" style="width:10%;margin-top:-5%;margin-left:85%;" id="send_button"><i class="material-icons">send</i></div>-->
                        </div>
                    `
                }))
                window.location.hash = "#message";
                document.onkeydown = (ev)=>{
                    if(ev.key == "Enter"){
                        var v = $("#message").val()
                        $("#message").focus()
                        floatingActionButton.style.display = "initial";
                        document.getElementById("text").remove()
                        if (v.trim() != ""){
                            var m = this.postMessage(v)
                            element.appendChild(m)
                            // $(m).focus()
                            // $("#message").focus();
                            // document.getElementById("message").click()
                            window.location.hash = "#message"+window.messages;
                            window.messages += 1;

                            var mm = document.getElementById("message1");

                            mm.style.marginTop = "60px";
                        }else{
                            window.location.hash = "#message"+window.messages;
                        }
                    }
                }
            } 
        }

        element.appendChild(floatingActionButton)
        // material.introduceElement(floatingActionButton,element);
    }

    postMessage(text){
        material.createElementClass("avatar-normal",{
            "border-radius": "50%",
            "background-color": this.color,
            "font-size": "30px",
            "margin": "10px",
            "color": "white",
            "width": "40px",
            "height": "40px"
            // "padding": "15px" 
        })

        var card = material.ui.card();
        card.id = "message"+window.messages;
        var avatar = document.createElement("div");
        var avatarText = document.createElement("p");
        avatarText.innerText = window.User[0].toUpperCase();
        var t = material.setElementClass(avatarText,"avatar-text");
        avatar.appendChild(t);

        var name = document.createElement("p");
        name.innerText = "@"+window.User;
        name.style.fontFamily = "monospace";
        name.style.marginRight = "10%";
        name.style.color = material.colors.blueAccent;

        // element.appendChild(material.setElementClass(avatar,"avatar-normal"))
        var av = material.setElementClass(avatar,"avatar-normal");
        // av.style.paddingRight = "20px";
        // name.style.paddingLeft = "20px"
        material.createElementClass("chat-message",{
            "font-family": "Consolas,monospace",
            "margin": "10px",
            "width": card.style.width
        })
        var uiRow = material.ui.row([av,name])
        uiRow.style.width = card.style.width;
        var message = document.createElement("div");
        message.innerText = text;
        message.className = "text";
        material.setElementClass(message,"chat-message")
        card.appendChild(uiRow);
        card.appendChild(material.ui.divider())
        card.appendChild(message);

        // console.log(card);
        return card;
    }
} 