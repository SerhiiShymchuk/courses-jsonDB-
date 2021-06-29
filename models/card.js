const fs = require('fs').promises
const path = require('path')
const absolutePath = path.dirname(process.mainModule.filename)
class Card {
    async add(course) {
        const card = await this.fetch()
        const index = card.courses.findIndex(c => c.id === course.id)
        const candidate = card.courses[index]
        if (!candidate) { 
            //курса нема
            course.count = 1
            card.courses.push(course)
        } else {
            // курс вже є
            candidate.count++
            //card.courses[index] = candidate
        }
        card.price += +course.price
        try {
            await fs.writeFile(path.join(absolutePath, 'data', 'card.json'), JSON.stringify(card), 'utf-8')
        } catch (error) {
            throw error
        }
    }
    async fetch() {
        try {
            const cardContent = await fs.readFile(path.join(absolutePath, 'data', 'card.json'), 'utf-8')
            return JSON.parse(cardContent)
        } catch (error) {
            throw error
        }
    }
    async delete(id) {
        const card = await this.fetch()
        const index = card.courses.findIndex(c => c.id === id)
        const course = card.courses[index]
        if (course.count === 1) {
            card.courses.splice(index, 1)
        } else {
            course.count--
        }
        card.price -= +course.price
        try {
            await fs.writeFile(path.join(absolutePath, 'data', 'card.json'), JSON.stringify(card), 'utf-8')
            return card
        } catch (error) {
            throw error
        }
        
    }
}

module.exports = Card