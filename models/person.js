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

personSchema.statics.format = function(name, cb) {
    return this.find({ name: new RegExp(name, 'i') }, cb)
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person

/*

Refaktoroi koodiasi siten, että määrittelet formatoinnin suorittavan metodin
mongoose skeeman staattisena metodina, jolloin voit käyttää sitä koodista seuraavasti:

persons.map(Person.format)
muotoillessa taulukossa persons olevat oliot tai yksittäsen olion person muotoilussa seuraavasti:

Person.format(person)
Tehtävän tekeminen edellyttää luovaa manuaalin lukemista. Älä juutu tähän ainakaan aluksi liian pitkäksi aikaa!

const formatNote = (note) => {
    return {
      content: note.content,
      date: note.date,
      important: note.important,
      id: note._id
    }
  }


  */