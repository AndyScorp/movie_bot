var TelegramBot = require('node-telegram-bot-api');

const config = require("../config");

module.exports = function Constructor() {
    if (process.env.NODE_ENV === 'production') {

        this.bot = new TelegramBot(config.telegram.token, { webHook: { port: config.telegram.port, host: config.telegram.host } });
        this.bot.setWebHook(config.telegram.externalUrl + ':443/bot' + config.telegram.token);

    } else {

        this.bot = new TelegramBot(config.telegram.token, { polling: true });
    }
    return this.bot
};

