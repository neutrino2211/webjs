export function icons(name){
    var icon = document.createElement("i");
    icon.innerText = name;
    icon.className = "material-icons";
    icon.style.height = "100%";

    return icon;
}

var materialClasses = {};

/**
 * 
 * @param {String} name 
 * @param {Object} rules 
 */

export function createElementClass(name: string,rules: any){
    materialClasses[name] = rules;
}

/**
 * 
 * @param {HTMLElement} element 
 * @param {String} name 
 */

export function setElementClass(element: any,name: string){
    var rules = materialClasses[name];

    Object.getOwnPropertyNames(rules).forEach((name)=>{
        element.style[name] = rules[name];
    })

    return element
}

export function floatingActionButton(obj:any) {
    var btn = document.createElement("div");
    btn.className = `fixed-action-btn ${obj.position ? obj.position : "right" } ${obj.type||""}`
    var a = document.createElement("a");
    a.className = `btn-floating btn-${obj.size} ${obj.color}`;
    var i = obj.icon||document.createElement("i");
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
}

export var ui = {
    card: function(){
        var d = document.createElement("div");
        d.className = "card";

        return d
    },
    /**
     * 
     * @param {Array<HTMLElement>} elements 
     * 
     * @returns {HTMLDivElement}
     */
    row: function(elements){
        var rowDiv = document.createElement("div");
        // rowDiv.style.display = "inline-block";
    
        if(!elements){
            elements = []
        }
    
        elements.forEach((e)=>{
            e.style.display = "inline-block";
            rowDiv.appendChild(e)
        })
    
        return rowDiv
    }
}

export var colors = {
    red: "#f44336",
    blue: "#2196F3",
    pink: "#E91E63",
    cyan: "#00BCD4",
    teal: "#009688",
    lime: "#CDDC39",
    brown: "#795548",
    amber: "#FFC107",
    green: "#4CAF50",
    orange: "#FF9800",
    yellow: "#FFEB3B",
    indigo: "#3F51B5",
    violet: "#673AB7",
    purple: "#9C27B0",
    warning: "#FF5722",
    blueAccent: "#03A9F4",
    greenAccent: "#8BC34A",
    random : function(){
        var colorLength = Object.getOwnPropertyNames(colors).length;
        var colorMap = [];
        Object.getOwnPropertyNames(colors).forEach((name,index)=>{
            colorMap[index] = name;
        })

        var i = Math.round(Math.random()*(colorLength-1));

        console.log(colors[colorMap[i]])

        return colors[colorMap[i]]||colors.red
    }

}