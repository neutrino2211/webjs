export class TemplateApplication{
    template;
    $element;
    // onViewLoad;
    constructor(){
        console.log("Ready")
        document.addEventListener("__INIT__",()=>{
            this.onTemplateLoad();
        });
    }

    onViewLoad(){
        this.$element.innerHTML = this.template;
        document.dispatchEvent(new Event("__INIT__"))
        // this.ovl();
        // window.WJS_PAGE_STATE = 1;
    }
}