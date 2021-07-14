module.exports = {
    PORT: process.env.PORT || 3009,
    //passMongo: '85hevFHBVxIqZ2tp',
    //userNameMongo: 'admin',
    url: `mongodb+srv://admin:85hevFHBVxIqZ2tp@cluster0.hdehi.mongodb.net/shop`,
    secret: 'some text',
    sendgrid_email_api_key: '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',
    base_url: `http://localhost:${process.env.PORT}`,
    email_from: 'shymakachok@mail.ru',
}