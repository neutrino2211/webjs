import * as ui from "wjs/ui"

var pageNav;

export function title(title){
    var p = document.getElementById("__WJS_PAGE_TITLE__");
    p.innerText = title;
    p.className = "text center"
    p.style.fontFamily = "Consolas";

    // pageNav.appendChild(p)
}

export function createPageNav(){
    var nav = ui.navbar()
    nav.style.height = "10%";
    nav.style.backgroundColor = "red";
    var title = document.createElement("p");
    title.id = "__WJS_PAGE_TITLE__";
    nav.appendChild(title);
    pageNav = nav;

    document.body.appendChild(pageNav);
}