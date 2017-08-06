

module.exports = {
    telegram: {
        token: process.env.TELEGRAM_TOKEN || require('../token_telegram.json').token,
        url: 'https://movie-lite-bot.herokuapp.com',
        port: process.env.PORT
    }
};