const {Schema, model} = require('mongoose')
const UserSchema = new Schema({
    email: {type: String, required: true},
    name: {type: String},
    password: {type: String, required: true},
    avatarUrl: String,
    resetToken: String,
    resetTokenExp: Date,
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    default: 1,
                    required: true,
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true,
                },
            }
        ]
    },
})
UserSchema.methods.addToCart = async function (course) {
    const clonedItems = JSON.parse(JSON.stringify(this.cart.items))
    const index = clonedItems.findIndex(item => item.courseId.toString() === course._id.toString())
    if (index >= 0) clonedItems[index].count++
    else {
        clonedItems.push({
            count: 1,
            courseId: course._id,
        })
    }
    this.cart = {items: clonedItems}
    return this.save()
}
UserSchema.methods.deleteFromCart = async function (id) {
    let items = JSON.parse(JSON.stringify(this.cart.items))
    const index = items.findIndex(c => c.courseId.toString() === id.toString())
    if (items[index].count === 1) items = items.filter(c => c.courseId.toString() !== id.toString())
    else items[index].count--
    this.cart = {items}
    return this.save()
}
UserSchema.methods.clearCart = async function() {
    this.cart = {items: []}
    return this.save()
}

module.exports = model('User', UserSchema)