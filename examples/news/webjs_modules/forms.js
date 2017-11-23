import { $ } from "core"

/**
 * 
 * @param {Array<HTMLInputElement>} inputs 
 */

export function compareInputs(...inputs){
    var ret = true;
    var start = $(inputs[0]).val()
    for (var key in inputs.slice(1)) {
        if($(inputs[key]).val() != start){
            ret = false
            break
        }
    }

    return ret;
} 