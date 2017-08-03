

module.exports = {
    telegram: {
        token: process.env.TELEGRAM_TOKEN || require('../token_telegram.json').token,
        externalUrl: process.env.CUSTOM_ENV_VARIABLE || 'https://movie-lite-bot.herokuapp.com',
        port: 8080 || 8080,
        host: process.env.HOST || '0.0.0.0'
    }
};