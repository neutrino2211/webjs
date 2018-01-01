import { Reflex } from "./reflex.module";
import { colors } from "../webjs_modules/material";

export var Divider = new Reflex.Component(`
<div class="divider"></div>
`);

export var Button3 = new Reflex.Component(`
<button class="btn {{color}} {{class}}" style="color:white;margin-top:10px;margin-left:8%;width:22%;display:inline-block;">{{name}}</button>
`);

export var Button2 = new Reflex.Component(`
<button class="btn {{color}} {{class}}" style="color:white;margin-top:10px;margin-left:9.5%;width:35%;display:inline-block;">{{name}}</button>
`);

export var Button1 = new Reflex.Component(`
<button class="btn {{color}} {{class}}" style="color:white;margin-top:10px;margin-left:20%;width:60%;display:inline-block;">{{name}}</button>
`);

export var Nav = new Reflex.Component(`
    <nav class="{{color}}"style="text-align:center;"><p class"text center {{text-color}}" style="font-family:monospace;font-size:27px;">{{title}}</p></nav>
`);

export var Input = new Reflex.Component(`
    <input placeholder="{{placeholder}}" type="{{type}}" id="{{id}}" style="{{style}};width:90%;margin-left:5%;"></input>
`)

export var Footer = new Reflex.Component(`
    <footer class="page-footer accent-color">
        <div class="container">
            <div class="row">
                <div class="col l6 s12">
                    <h5 class="white-text">About me</h5>
                    <p class="grey-text text-lighten-4">
                        I am a Cyber Security student at Federal University of Technology,Minna (Nigeria)<br/>
                        i deal mostly with network systems like servers and sockets using (nodejs , python , golang)
                    </p>
                </div>
                <div class="col l4 offset-l2 s12">
                    <h5 class="white-text">Social</h5>
                    <ul>
                        <li><a class="grey-text text-lighten-3" target="blank_" href="https://www.instagram.com/neutrino2211_/"><i class="fa fa-instagram" style="padding:5px;"></i>Instagram</a></li>
                        <li><a class="grey-text text-lighten-3" target="blank_" href="https://twitter.com/wjsCli_official"><i class="fa fa-twitter" style="padding:5px;"></i>Twitter (wjs)</a></li>
                        <li><a class="grey-text text-lighten-3" target="blank_" href="https://twitter.com/neutrino2211"><i class="fa fa-twitter" style="padding:5px;"></i>Twitter (personal)</a></li>
                        <li><a class="grey-text text-lighten-3" target="blank_" href="https://www.facebook.com/tsowa.mainasara"><i class="fa fa-facebook" style="padding:5px;"></i>Facebook</a></li>
                    </ul>
                </div>
                <div>Lacerta icon made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
            </div>
        </div>
        <div class="footer-copyright">
            <div class="container">
                &copy; 2018
            </div>
        </div>
    </footer>
`);

export var LargeDiv = new Reflex.Component(`
    <div style="width:100%;height:100%;background-color:{{color}}">
        <img  class="circle" src="{{img-src}}" alt="Image" style="width:100px"></img>
    </div>
`);

export var Test = new Reflex.Component(`
    <div class="default-primary-color"style="width:100%;height:100%;text-align:center;">
        <img src="{{src}}" width="180px" alt="Image" style="margin-top:19%;" class="circle app-hover-emphasis"></img>
        <p class="text-primary-color scale-transition scale-out header" id="my-name" style="font-size:25px">{{text}}</p>
    </div>
`)

export var Skill = new Reflex.Component(`
    <div class="progress" style="width:50%;margin-left:25%;color:#ffffff;">
        <div class="determinate" style="width: {{level}}"><p style="text-align:center;">{{name}}</p></div>
    </div>
`)

export var InfoCard = new Reflex.Component(`
<div class="col s12 m6" style="text-align:center;">
<img src="{{src}}" alt="{{title}}"></img>
<div class="card divider-color darken-1">
  <div class="card-content" style="color:#0097A7;">
    <span class="card-title">{{title}}</span>
    <p>{{description}}</p>
  </div>
  <div class="card-action">
    <a href="{{link}}" target="_blank">{{text}}</a>
  </div>
</div>
</div>
`)

export var Header = new Reflex.Component(`
    <h2 class="text header center" id="header" style="color:#00796B;">{{text}}</h2>
`)

export var FloatingActionButton = new Reflex.Component(`
    <div class="fixed-action-btn {{position}} {{type}}"><a class="btn-floating btn-{{size}} {{color}}"><i class="material-icons">{{icon}}</i></a></div>
`)

export var TransitioningFloatingActionButton = new Reflex.Component(`
<div class="fixed-action-btn scale-transition scale-out {{type}}"><a class="btn-floating btn-{{size}} {{position}} {{color}}"><i class="material-icons" style="color:#0097A7;">{{icon}}</i></a></div>
`)