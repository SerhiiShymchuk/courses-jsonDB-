const { Router } = require('express')
const router = Router()
const Course = require('../models/course')
const authProtect = require('../middleware/authProtect')

router.get('', authProtect, (req, res) => {
  res.render('add', {
    title: 'Додати курси', isadd: true
  })
  //res.sendFile(path.join(__dirname, 'views', 'about.html'))
})
router.post('', authProtect, async (req, res) => {
  //console.log(req.body, req.user)
  const { title, price, img } = req.body
  //const course = new Course(title, price, img)
  const course = new Course({
    title,
    price,
    img,
    userId: req.user
  })
  try {
    await course.save()
    res.redirect('/courses')
  } catch (error) {
    throw error
  }
})

module.exports = router