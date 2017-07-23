const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var ajax = require("./ajaxUtils");

ajax.sendGetRequest(lubavaUrl, handler, false);

function handler(request) {
    var arrayFilms=[];
    const dom = new JSDOM(request.responseText);
    var array = toArray(dom.window.document.getElementsByClassName('afisha_td_bottom'));
    array.forEach(function (item, i) {
        arrayFilms.push(item.textContent);
    });
}
function toArray(obj) {
    return [].slice.call(obj)
}