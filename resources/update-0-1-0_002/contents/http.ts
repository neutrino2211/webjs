import { $ } from './web';

export function get(url:string,cb:Function){
    $.get(url,cb);
}

export function post(url:string,cb:Function){
    $.post(url,cb);
}