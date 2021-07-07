const {Router} = require('express')
const Course = require('../models/course')
//const Card = require('../models/card')
//const course = require('../models/course')
const router = Router()
const util = require('util')
const sleep = util.promisify(setTimeout)

router.post('/add', async (req, res) => {
    // const courses = new Course()
    // const card = new Card()
    // const course = await courses.getById(req.body.id)
    // await card.add(course)
    //await sleep(3000)
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)
    res.redirect('/card')
})
router.get('/', async (req, res) => {
    // const cards = new Card()
    // const card = await cards.fetch()
    // res.render('card', {
    //     title: `Корзина`,
    //     courses: card.courses,
    //     price: card.price,
    //     iscard: true,
    // })
    const user = await req.user
                .populate('cart.items.courseId').execPopulate()
    const courses = user.cart.items.map(course => ({
       ...course.courseId._doc, 
       count: course.count
    }))
    res.render('card', {
        title: `Корзина`,
        courses: courses,
        price: countPrice(courses),
        iscard: true,
    })
})
router.delete('/remove/:id', async (req, res)=> {
    // const cards = new Card()
    // const card = await cards.delete(req.params.id)
    // res.status(200).json(card)
    await req.user.deleteFromCart(req.params.id)
    const user = await req.user
                .populate('cart.items.courseId').execPopulate()
    const courses = user.cart.items.map(course => ({
        ...course.courseId._doc, 
       count: course.count,
    }))
    const cart = {
        courses,
        count: countPrice(courses)
    }
    res.status(200).json(cart)
})

function countPrice(courses) {
    return courses.reduce((acc, course) => {
        return acc += +course.price * +course.count
    }, 0)
}
module.exports = router