const {Router} = require('express')
const bcrypt = require('bcryptjs')
const router = Router()
const User = require('../models/user')

router.get('/login', async (req, res)=> {
    res.render('auth/login', {
        title: 'Авторизація',
        islogin: true,
        registerError: req.flash('registerError'),
        loginError: req.flash('loginError'),
    })
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({email})
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
        const {email, name, password, confirm} = req.body
        const candidate = await User.findOne({email})
        if (candidate) {
            req.flash('registerError', 'Такий email уже існує')
            res.redirect('/auth/login#register')
        } else {
            const hashPass = await bcrypt.hash(password[0], 9)
            const user = new User({
                email, name,
                password: hashPass,
                cart: {items: []}
            })
            await user.save()
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
module.exports = router