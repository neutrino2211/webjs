import { build } from '../web';
// var appID;

export function init(){
    build('https://connect.facebook.net/en_US/sdk');
}
// export function appID(id){
//     appID = id;
// }
// function FB(){
//     return $.getScript('https://connect.facebook.net/en_US/sdk.js',() => {
//         // FB.init({
//         //     appId: '122242938426720',
//         //     version: 'v2.7' // or v2.1, v2.2, v2.3, ...
//         // });
//         // FB.getLoginStatus(updateStatusCallback)
//         return FB;
//     })
// }