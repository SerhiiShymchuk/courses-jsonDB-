const {Router} = require('express')
const auth = require('../middleware/authProtect')
const router = Router()
const User = require('../models/user')

router.get('/', auth, (req, res) => {
    res.render('profile', {
        title: 'Профіль',
        isprofile: true,
        user: req.user.toObject(),
    })
})
router.post('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const toChange = {
            name: req.body.name,
        }
        console.log(req.file)
        
        if (req.file) {
            toChange.avatarUrl = req.file.path
        }
        Object.assign(user, toChange)
        await user.save()
        res.redirect('/profile')
    } catch (error) {
        throw error    
    }    
})

module.exports = router