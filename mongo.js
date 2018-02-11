const mongoose = require('mongoose')

const user = process.env.MLAB_FULLSTACK_USER;
const pass = process.env.MLAB_FULLSTACK_PASS;

const url = 'mongodb://' + user + ':' + pass + '@ds229448.mlab.com:29448/fullstack_osa3'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

if (process.argv[2] !== undefined && process.argv[3] !== undefined){
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })

    person
        .save()
        .then(result => {
            console.log('lisätään henkilö',person.name,'numero',person.number,'luetteloon')
            mongoose.connection.close();
        })

} else {
    Person
    .find()
    .then(result => {
        if (result.length > 0){
            console.log('Puhelinluettelo')
            result.forEach(person =>{
                console.log(person.name, person.number)
            })
        }
        mongoose.connection.close()
    })
}

  