const {Router} = require('express')
const router = Router()
const Course = require('../models/course')

router.get('', (req, res) => {
    res.render('add', {
      title: 'Додати курси', isadd: true
    })
    //res.sendFile(path.join(__dirname, 'views', 'about.html'))
})
router.post('', async (req, res) => {
    console.log(req.body)
    const {title, price, img} = req.body
    const course = new Course(title, price, img)
    await course.save()
    res.redirect('/courses')
})

module.exports = router