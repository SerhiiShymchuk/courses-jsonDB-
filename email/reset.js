const keys = require('../keys/config')

module.exports = function (email, token) {
    return {
        to: email,
        from: keys.email_from,
        subject: 'Відновлення доступу',
        html: `
            <h1>Ви забули пароль?</h1>
            <p>Тоді натисніть на посилання нижче:</p>
            <p><a href="${keys.base_url}/auth/password/${token}">Відновити доступ</a></p>
            <hr />
            <a href=${keys.base_url}>Магазин курсів</a>
        `,
    }
}