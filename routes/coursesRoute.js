const { Types } = require('mongoose')
const { ObjectId } = Types
const { Router } = require('express')
const router = Router()
const Course = require('../models/course')
const authProtect = require('../middleware/authProtect')

router.get('', async (req, res) => {
    //const course = new Course()
    //const arrCourses = await course.getAll()
    try {
        const courses = await Course.find()
                .populate('userId', 'email name')
                .select('price title img')
        res.render('courses', {
            title: 'Список курсів ',
            iscourses: true,
            userId: req.user ? req.user._id.toString() : null,
            //arrCourses,
            courses,
        })
    } catch (err) {
        throw err
    }
})
router.get('/:id', async (req, res) => {
    // const courses = new Course()
    // const course = await courses.getById(req.params.id)
    try {
        const course = await Course.findById(req.params.id)
        res.render('course', {
            title: `Курс ${course.title}`,
            layout: 'empty',
            course,
        })
    } catch (err) {
        throw err
    }
})
router.get('/:id/edit', authProtect, async (req, res) => {
    if (!req.query.allow) res.redirect('/')

    // const courses = new Course()
    // const course = await courses.getById(req.params.id)

    try {
        const course = await Course.findById(req.params.id)
        if (course.userId.toString() !== req.user._id.toString()) return res.redirect('/courses')
        res.render('course-edit', {
            title: `Редагувати ${course.title}`,
            course,
        })
    } catch (err) {
        throw err
    }
})
router.post('/:id/edit', authProtect, async (req, res) => {
    // const course = new Course()
    // console.log(`---- req.body ----`)
    // console.log(req.body)
    //await course.update(req.body)
    try {
        const id = req.body.id
        delete req.body.id
        await Course.findByIdAndUpdate(id, req.body)
        res.redirect('/courses')
    } catch (err) {
        throw err
    }
})
router.post('/remove', authProtect, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: new ObjectId(req.body.id),
            userId: req.user._id,
        })
        res.redirect('/courses')
    } catch (error) { throw error }
})

module.exports = router