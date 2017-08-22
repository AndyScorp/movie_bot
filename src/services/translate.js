const translate = require('google-translate-api');

module.exports.translate = function (phrase) {
    if ( phrase.charCodeAt(0) > 64 && phrase.charCodeAt(0) < 123) {
        return translate(phrase, {from: 'en', to: 'ru', raw: true})
    } else if ( phrase.charCodeAt(0) > 1039 && phrase.charCodeAt(0) < 1104) {
        return translate(phrase, {from: 'ru', to: 'en', raw: true})
    }
};