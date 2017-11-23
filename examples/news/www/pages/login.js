import * as app from "../../webjs_modules/app"
import { $ } from "../../webjs_modules/web"
import { HomePage } from "./HomePage"
import { TemplateApplicationPage } from "../../webjs_modules/definitions"

export class LoginPage extends TemplateApplicationPage{
    /**
     * 
     * @param {HTMLElement} element 
     */

    constructor(element){
        super(element);

        document.getElementById("Title").innerText = "Login";

        element.appendChild(app.JSX(()=>{
            return `
                <input style="margin-top:${(innerHeight/2)+"px"};" placeholder="Login Name" id="in"><input/>
            `;
        }))

        var input = document.getElementById("in");

        document.onkeydown = (ev)=>{
            // console.log(ev)
            if(ev.key == "Enter"){
                var ln = $(input).val();
                window.User = ln;
                this.login(element)
            }
        }

    }

    login(e){
        if(window.User.trim() == ""){
            alert("Enter name")
        }else{
            new HomePage(e);
        }
    }
}