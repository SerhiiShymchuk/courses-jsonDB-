const {Router} = require('express')
const router = Router()
const Course = require('../models/course')

router.get('', async (req, res) => {
    const course = new Course()
    const arrCourses = await course.getAll()
    res.render('courses', {
      title: 'Список курсів ',
      iscourses: true,
      arrCourses,
    })
})
router.get('/:id', async (req, res) => {
    const courses = new Course()
    const course = await courses.getById(req.params.id)
    res.render('course', {
        title: `Курс ${course.title}`,
        layout: 'empty',
        course,
    })
})
router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) res.redirect('/')
    
    const courses = new Course()
    const course = await courses.getById(req.params.id)
    res.render('course-edit', {
        title: `Редагувати ${course.title}`,
        course,
    })
})
router.post('/:id/edit', async (req, res) => {
    const course = new Course()
    console.log(`---- req.body ----`)
    console.log(req.body)
    
    await course.update(req.body)
    res.redirect('/courses')
})

module.exports = router