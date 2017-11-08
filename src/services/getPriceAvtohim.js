
var token = process.env.DROP_BOX_TOKEN || require('../token_telegram.json').DropBoxToken;

const dropboxV2Api = require('dropbox-v2-api');
const dropbox = dropboxV2Api.authenticate({
    token: token
});
const xlsx = require('node-xlsx').default;

module.exports.getPrice = function (stuff) {
    stuff = stuff.split(' ');
    return new Promise (function (resolve, reject) {
        const downloadStream = dropbox({
            resource: 'files/download',
            parameters: { path: '/price1.xlsx' }
        });

        var chunks = [];

        downloadStream.on('data', (chunk) => {
            chunks.push(chunk)
        });

        downloadStream.on('end', () => {
            let book = xlsx.parse(Buffer.concat(chunks));
            let priceElements = book[0].data;
            let priceLength = priceElements.length;
            for (let j=0; j<stuff.length; j++) {

                priceElements = getMatches(priceElements, stuff[j]);

            }
            if (priceLength === priceElements.length) {
                return resolve([])
            } else {
                return resolve(priceElements);
            }
        });
    });
};

function getMatches(array, stuff) {
    let newArray = [];
    for (let i=0; i<array.length; i++) {

        if (array[i] && array[i][2] && array[i][2].toLowerCase().indexOf(stuff.toLowerCase()) !==-1 ) {
            newArray.push(array[i])
        }
    }
    if (newArray.length) {
        return newArray
    } else {
        return array
    }
}

