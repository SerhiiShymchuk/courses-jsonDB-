const { Types } = require('mongoose')
const { ObjectId } = Types
const { Router } = require('express')
const router = Router()
const Course = require('../models/course')


router.get('', async (req, res) => {
    //const course = new Course()
    //const arrCourses = await course.getAll()
    const courses = await Course.find()
    res.render('courses', {
        title: 'Список курсів ',
        iscourses: true,
        //arrCourses,
        courses,
    })
})
router.get('/:id', async (req, res) => {
    // const courses = new Course()
    // const course = await courses.getById(req.params.id)
    const course = await Course.findById(req.params.id)
    res.render('course', {
        title: `Курс ${course.title}`,
        layout: 'empty',
        course,
    })
})
router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) res.redirect('/')

    // const courses = new Course()
    // const course = await courses.getById(req.params.id)
    const course = await Course.findById(req.params.id)
    res.render('course-edit', {
        title: `Редагувати ${course.title}`,
        course,
    })
})
router.post('/:id/edit', async (req, res) => {
    // const course = new Course()
    // console.log(`---- req.body ----`)
    // console.log(req.body)
    //await course.update(req.body)
    const id = req.body.id
    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body)
    res.redirect('/courses')
})
router.post('/remove', async (req, res) => {
    try {
        await Course.deleteOne({ _id: new ObjectId(req.body.id) })
        res.redirect('/courses')
    } catch (error) { throw error }
})

module.exports = router