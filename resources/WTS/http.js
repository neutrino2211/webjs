import { $ } from 'core';

export function get(url,cb){
    $.get(url,cb);
}

export function post(url,cb){
    $.post(url,cb);
}