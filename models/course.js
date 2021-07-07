const {Schema, model} = require('mongoose')
const course = new Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true},
    img: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
})

module.exports = model('Course', course)


// const { v1: uuidv1 } = require('uuid');
// const path = require('path')
// const fs = require('fs').promises

// class Course {
//     constructor(title, price, img) {
//         this.title = title
//         this.price = price
//         this.img = img
//         this.id = uuidv1()
//     }
//     toJSON() {
//         return {
//             title: this.title,
//             price: this.price,
//             img: this.img,
//             id: this.id
//         }
//     }
//     async save() {
//         const courses = await this.getAll()
//         console.log('Всі курси:')
//         console.log(courses)
//         courses.push(this.toJSON())
//         try {
//             await fs.writeFile(path.join(__dirname, '..', 'data', 'courses.json'), JSON.stringify(courses))
//         } catch (error) {
//             throw error
//         }
//     }
//     async getAll() {
//         try {
//             const data = await fs.readFile(path.join(__dirname, '..', 'data', 'courses.json'), 'utf-8')
//             return JSON.parse(data)
//         } catch (error) {
//             throw error
//         }
//     }
//     async getById(id) {
//         const allCourses = await this.getAll()
//         const findedCourse = allCourses.find(course => course.id == id)
//         console.log("Знайдений курс по айді")
//         console.log(findedCourse)
//         return findedCourse
//     }
//     async update(course) {
//         const courses = await this.getAll()
//         const index = courses.findIndex(courseObj => courseObj.id == course.id)
//         courses[index] = course
//         try {
//             await fs.writeFile(path.join(__dirname, '..', 'data', 'courses.json'), JSON.stringify(courses))
//             console.log('Дані успішно оновлені...')
//         } catch (error) {
//             throw error
//         }
//     }
// }
// module.exports = Course