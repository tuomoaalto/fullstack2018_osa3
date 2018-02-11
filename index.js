require('dotenv').config()

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
    return JSON.stringify(req.body)
})

//app.use(morgan('tiny'))
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

/*
let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4
    },
    {
      "name": "Jeppe Tunari",
      "number": "050-12345",
      "id": 5
    },
    {
      "name": "Allu Tuppurainen",
      "number": "045-567890",
      "id": 6
    },
    {
      "name": "Pelle Hermanni",
      "number": "123-23456",
      "id": 7
    }
  ]
*/


app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(people => {
            response.json(people.map(Person.format))
        })
})

app.get('/info', (request, response) => {
    Person
        .find({})
        .then(people => {
            var out = 'puhelinluettelossa ' + people.length + ' henkilön tiedot<br/>' + new Date()
            response.send(out)
        })
})

app.get('/api/persons/:id', (request, response) => {
    const inputId = request.params.id

    Person
        .findById(inputId)
        .then(person => {
            if (person === null){
                response.status(404).end()
            } else {
                response.json(Person.format(person))
            }
            
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

/* Pre-mongo -versio kommentoitu veks.
const generatePersonId = () => {
    return Math.floor(Math.random() * Math.floor(123456789));
}

const badName = (inputName) => {
    var namesInList = persons.map(p => p.name);
    return namesInList.includes(inputName)
}
const badNumber = (inputNumber) => {
    var numbersInList = persons.map(p => p.number);
    return numbersInList.includes(inputNumber)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({error: 'Input required for name and number'})
    }
    
    if (badName(body.name)){
        return response.status(400).json({error: 'Name already in list!'})
    }

    if (badNumber(body.number)){
        return response.status(400).json({error: 'Number already in list!'})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generatePersonId()
    }
    persons = persons.concat(person)

    response.json(person)
})
*/


app.post('/api/persons', (request, response) => {
    console.log('post body: ', request.body)
    const body = request.body
    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'Input required for name and number' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    Person
        .find({ name: body.name })
        .then(fetchedPerson => {
            console.log('fetchedPerson: ', fetchedPerson)
            console.log('object.keys: ',Object.keys(fetchedPerson))
            if (Object.keys(fetchedPerson).length !== 0){
                return response.status(400).json({ error: 'Name already in list!' })
            }
            else {
                person
                    .save()
                    .then(newPerson => {
                        response.json(Person.format(newPerson))
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
            response.json(Person.format(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'Id is screwed up.' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

