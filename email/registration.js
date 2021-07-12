const keys = require('../keys/config')

module.exports = function (email) {
    return {
        to: email,
        from: keys.email_from,
        subject: 'Акаунт успішно створено',
        html: `
            <h1>Вітаю!</h1>
            <p>Ви успішно створили акаунт з ${email}</p>
            <hr />
            <a href=${keys.base_url}>Магазин курсів</a>
        `,
    }
}