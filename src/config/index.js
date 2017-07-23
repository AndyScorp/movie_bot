

module.exports = {
    telegram: {
        token: process.env.TELEGRAM_TOKEN || require('token_telegram.json').token,
        externalUrl: process.env.CUSTOM_ENV_VARIABLE || 'https://movie-lite-bot.herokuapp.com',
        port: process.env.PORT || 443,
        host: '0.0.0.0'
    }
};