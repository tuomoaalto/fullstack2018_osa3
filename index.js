const express = require('express')
const bodyParser = require('body-parser')
var morgan = require('morgan')

const app = express()
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())

morgan.token('body', function getJsonBody (req) {
    return JSON.stringify(req.body);
  })

//app.use(morgan('tiny'))
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

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

    app.get('/api/persons', (request, response) => {
        response.json(persons)
    })
  
    app.get('/info', (request, response) => {
        var out = 'puhelinluettelossa ' + persons.length + ' henkilön tiedot<br/>' + new Date();
        response.send(out)
    })

    app.get('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        const person = persons.find(person => person.id === id)
  
        if ( person ) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })

    app.delete('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        persons = persons.filter(person => person.id !== id)
  
        response.status(204).end()
    })

    const generatePersonId = () => {
        return Math.floor(Math.random() * Math.floor(123456789));
    }
  
    const badName = (inputName) => {
        namesInList = persons.map(p => p.name);
        return namesInList.includes(inputName)
    }

    const badNumber = (inputNumber) => {
        numbersInList = persons.map(p => p.number);
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

    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })