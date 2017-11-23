import { modules,$ } from "core";

var ui = {
    navbar: function() {
        var nav = document.createElement("nav");
        nav.className = "navbar navbar-fixed-top";
        nav.color = function(color) {
            nav.style.color = color;
        }
        nav.height = nav.style.height;
        nav.maxHeight = nav.style.maxHeight;
        nav.minHeight = nav.style.minHeight;
        nav.width = nav.style.width;
        nav.minWidth = nav.style.minWidth;
        nav.maxWidth = nav.style.maxWidth;
        nav.append = nav.appendChild;

        return nav;
    },
    actionButton: function(obj) {
        var btn = document.createElement("div");
        btn.className = `fixed-action-btn ${obj.position ? obj.position : "right" } ${obj.type||""}`
        var a = document.createElement("a");
        a.className = `btn-floating btn-${obj.size} ${obj.color}`;
        var i = document.createElement("i");
        i.className = `${obj.size} material-icons ${obj.icon||""}`;
        // i.innerText = obj.icon||"";
        var ul = document.createElement("ul")
        btn.appendChild(a);
        a.appendChild(i);
        if (!obj.fab) {
            return btn;
        }

        obj.fab.forEach(function(fab) {
            var li = document.createElement("li");
            li.className = "waves-effect";
            li.appendChild(fab)
            ul.appendChild(li);
        })
        btn.appendChild(ul);
        return btn;
    },
    actionButtonFAB: function(obj) {
        /**
         * @param {Object} obj
         */
        var click = document.createElement("a");
        click.className = `btn-floating ${obj.color}`;
        var i = document.createElement("i");
        i.className = `fa fa-${obj.type}`;

        click.appendChild(i);
        return click;
    },
    menu: {
        sideMenu: function(obj) {
            var ul = document.createElement("ul");
            ul.id = "slide-out";
            ul.className = "side-nav";
            var li = document.createElement("li")
            li.appendChild(obj.userView);
            ul.appendChild(li);
            obj.items.forEach(function(item) {
                var li = document.createElement("li");
                li.appendChild(item);
                ul.appendChild(li);
            })
            return ul;
        },
        sideMenuActivator: function(sideMenu, text) {
            var a;
            a = document.createElement("a");
            $(a).attr("data-activates", sideMenu.id);
            a.className = "button-collapse";
            a.href = "#";
            var i = document.createElement("i");
            i.className = "material-icons";
            i.innerHTML = text;
            a.appendChild(i);
            a.activate = function() {
                $(a).sideNav()
            }
            return a;
        },

    },
    card: function(arg) {
        if (!arg || typeof arg != "object") {
            throw new TypeError("Argument must be a valid js object")
        }
        var div = document.createElement("div");
        div.className = "card " + (arg.class || "");
        div.style.width = arg.width || div.style.width;
        div.style.height = arg.height || div.style.height;
        div.style.backgroundColor = arg.backgroundColor || "";

        return div;
    },
    text: function(text,className){
        var p = document.createElement("p");
        p.innerText = text;
        p.className = className;

        return p;
    },
    menuItems: {
        sideMenuUserView: function(obj) {
            var Uv = document.createElement("div");
            Uv.className = "user-view";
            var back = document.createElement("div");
            back.className = "background";
            back.appendChild(obj.backgroundImage);
            Uv.appendChild(back);
            var userImage = document.createElement("a");
            userImage.href = "#!user";
            userImage.appendChild(obj.userImage);
            Uv.appendChild(userImage);
            obj.userImage.className = "circle";
            if (!obj.userInfo) {
                return Uv;
            }
            obj.userInfo.forEach(function(element) {
                var a = document.createElement("a");
                a.appendChild(element);
                Uv.appendChild(a);
            });

            return Uv;
        },
        divider: function() {
            var li = document.createElement("li");
            var div = document.createElement("div");
            div.className = "divider";
            li.appendChild(div);
            return li;
        }
    },
    divider: function(){
        var div = document.createElement("div");
        div.className = "divider";
        return div;
    }
}
export const card = ui.card;
export const menu = ui.menu;
export const menuItems = ui.menuItems;
export const navbar = ui.navbar;
export const actionButton = ui.actionButton;
export const actionButtonFAB = ui.actionButtonFAB;
export const text  = ui.text;
export const divider = ui.divider;
modules.ui = ui;
Object.freeze(modules.ui);