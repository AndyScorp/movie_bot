token = require('token_telegram.json')["token"];

module.exports = {
    telegram: {
        token: process.env.TELEGRAM_TOKEN || token,
        externalUrl: process.env.CUSTOM_ENV_VARIABLE || 'https://movie-lite-bot.herokuapp.com',
        port: process.env.PORT || 443,
        host: '0.0.0.0'
    }
};