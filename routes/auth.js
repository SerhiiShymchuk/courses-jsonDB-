const { Router } = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const router = Router()
const User = require('../models/user')
const keys = require('../keys/config')
const resetEmail = require('../email/reset')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const regMail = require('../email/registration')


const transport = nodemailer.createTransport(sendgrid({
    auth: { api_key: keys.sendgrid_email_api_key }
}))

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизація',
        islogin: true,
        registerError: req.flash('registerError'),
        loginError: req.flash('loginError'),
    })
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const candidate = await User.findOne({ email })
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)
            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save((error) => {
                    if (error) throw error
                    res.redirect('/')
                })
            } else {
                req.flash('loginError', "Невірний пароль")
                res.redirect('/auth/login')
            }
        }
        else {
            req.flash('loginError', "Невірний email")
            res.redirect('/auth/login')
        }
    } catch (err) {
        throw err
    }

})
router.post('/register', async (req, res) => {
    try {
        const { email, name, password, confirm } = req.body
        const candidate = await User.findOne({ email })
        if (candidate) {
            req.flash('registerError', 'Такий email уже існує')
            res.redirect('/auth/login#register')
        } else {
            const hashPass = await bcrypt.hash(password[0], 9)
            const user = new User({
                email, name,
                password: hashPass,
                cart: { items: [] }
            })
            await user.save()
            await transport.sendMail(regMail(email))
            res.redirect('/auth/login#login')
        }
    } catch (error) {
        throw error
    }
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login')
    })
})
router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Забули пароль',
        error: req.flash('error'),
    })
})
router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(16, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Щось пішло не так. Повторіть пізніше')
                return res.redirect('/auth/reset')
            }
            const token = buffer.toString('hex')
            const candidate = await User.findOne({ email: req.body.email })
            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 3600000 // 1 година
                await candidate.save()
                await transport.sendMail(resetEmail(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'Такого email немає')
                res.redirect('/auth/reset')
            }
        })
    } catch (error) {
        throw error
    }
})

router.get('/password/:token', async (req, res) => {
    try {
        const token = req.params.token
        if (!token) {
            return res.redirect('/auth/login')
        }
        const user = await User.findOne({
            resetToken: token,
            resetTokenExp: { $gt: Date.now() },
        })
        if (!user) return res.redirect('/auth/login')
        else {
            res.render('auth/password', {
                title: 'Відновлення доступу',
                error: req.flash('error'),
                userId: user._id.toString(),
                token,
            })
        }
    } catch (error) {
        throw error
    }
})
router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })
        if (user) {
            user.password = await bcrypt.hash(req.body.password, 6)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')
        } else {
            req.flash('loginError', 'Час життя токену завершився')
            res.redirect('/auth/login')
        }
    } catch (error) {
        throw error
    }
})
module.exports = router