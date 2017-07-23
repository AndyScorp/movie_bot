module.exports = {
    telegram: {
        token: process.env.TELEGRAM_TOKEN || '409804897:AAHW-Fx6Ri8hkMrA9G_4cwd8wWM3mtAwa-c',
        externalUrl: process.env.CUSTOM_ENV_VARIABLE || 'https://movie-lite-bot.herokuapp.com',
        port: process.env.PORT || 443,
        host: '0.0.0.0'
    }
};