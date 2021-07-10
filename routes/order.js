const { Router } = require('express')
const router = Router()
const Order = require('../models/order')
const authProtect = require('../middleware/authProtect')

router.get('/', authProtect, async (req, res) => {
    const orders = await Order.find({'user.userId': req.user._id})
            .populate('user.userId')
    res.render('orders', {
        isorder: true,
        title: 'Замовлення',
        orders: orders.map(o => ({
            ...o._doc,
            price: o.courses.reduce((acc, c) => {
                return acc += c.count * c.course.price
            }, 0)
        }))
    })
})
router.post('/', authProtect, async (req, res) => {
    try {
        const user = await req.user
            .populate('cart.items.courseId')
            .execPopulate()
        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: { ...i.courseId._doc }
        }))
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user,
            },
            courses: courses,
        })

        await order.save()
        await req.user.clearCart()
        res.redirect('/order')
    } catch (error) {
        throw error
    }
})

module.exports = router