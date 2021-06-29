const {Router} = require('express')
const Course = require('../models/course')
const Card = require('../models/card')
const router = Router()
const util = require('util')
const sleep = util.promisify(setTimeout)

router.post('/add', async (req, res) => {
    const courses = new Course()
    const card = new Card()
    const course = await courses.getById(req.body.id)
    await card.add(course)
    //await sleep(3000)
    res.redirect('/card')
})
router.get('/', async (req, res) => {
    const cards = new Card()
    const card = await cards.fetch()
    res.render('card', {
        title: `Корзина`,
        courses: card.courses,
        price: card.price,
        iscard: true,
    })
})
router.delete('/remove/:id', async (req, res)=> {
    const cards = new Card()
    const card = await cards.delete(req.params.id)
    res.status(200).json(card)
})
module.exports = router