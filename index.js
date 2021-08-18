require('dotenv').config()
const Person = require('./models/person')
const { request, response, json } = require('express')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

app.use(cors())
app.use(express.static('build'))
morgan.token('resp', (response) => {
    return JSON.stringify(response.body)})

app.use(morgan(':method :url  :status :res[content-length] - :response-time ms :resp'))


let persons = []

let info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) response.json(person)
    else response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})


app.use(express.json())

app.post('/api/persons', (request, response) => {
    const body = request.body
    const generateId = () => Math.floor(Math.random() * 100000)

    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
      }

    persons.map(person => { 
        if(person.name === body.name){
            return response.status(409).json({ 
                error: 'name must be unique' 
        })}
    })
   
    person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)
    response.json(person)
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})