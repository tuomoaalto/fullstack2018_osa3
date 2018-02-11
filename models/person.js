const mongoose = require('mongoose')
const Schema = mongoose.Schema

if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
}

const user = process.env.MLAB_FULLSTACK_USER
const pass = process.env.MLAB_FULLSTACK_PASS
const dburl = process.env.MLAB_FULLSTACK_URL

const url = 'mongodb://' + user + ':' + pass + '@' + dburl

mongoose.connect(url)

var personSchema = new Schema({
    id: String,
    name: String,
    number: String
})

personSchema.statics.format = function(person) {
    return {
        id: person._id,
        name: person.name,
        number: person.number
    }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person