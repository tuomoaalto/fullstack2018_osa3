const Person = require('./models/person')

const express = require('express')
const bodyParser = require('body-parser')
var morgan = require('morgan')

const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())

morgan.token('body', function getJsonBody (req) {
    return JSON.stringify(req.body);
  })

//app.use(morgan('tiny'))
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

app.get('/api/persons', (request, response) => {
    Person
    .find({})
    .then(people => {
        response.json(people)
    })
})
  
app.get('/api/info', (request, response) => {
    Person
    .find({})
    .then(people => {
        var out = 'puhelinluettelossa ' + people.length + ' henkilön tiedot<br/>' + new Date();    
        response.send(out)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const inputId = request.params.id
    
    Person
    .findById(inputId)
    .then(person =>{
        response.json(person)
    })
    .catch(error => {
        console.log(error)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const inputId = request.params.id
    console.log('inputId: ', inputId)
    Person
    .findByIdAndRemove(inputId)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => {
        response.status(400).send({ error: 'Id is screwed up.' })
    })
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body
    const inputId = request.params.id
      
    const person = {
          name: body.name,
          number: body.number
        }
      
    Person
    .findByIdAndUpdate(inputId, person, { new: true } )
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'Id is screwed up.' })
    })
})


app.post('/api/persons', (request, response) => {
    console.log('post body: ', request.body)
    const body = request.body
    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({error: 'Input required for name and number'})
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    /*
    person
    .save()
    .then(newPerson =>{
        response.json(newPerson)
    })    
    .catch(error => {
        console.log(error)
    })  
*/
    Person
    .find({name: body.name})
    .then(fetchedPersonByName => {
        console.log('fetchedPersonByName:', fetchedPersonByName)
        if (fetchedPersonByName){
            return response.status(400).json({error: 'Name already in list!'});
        }
        else{                
            person
            .save()
            .then(newPerson =>{
                response.json(newPerson)
            })    
            .catch(error => {
                console.log(error)
            })              
        }
    })
    .catch(error => {
        console.log
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

