const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('POST-body', (req, res) => {
  if(req.method == 'POST') return JSON.stringify(req.body)
  return ''
})

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens['POST-body'](req, res)
  ].join(' ')
}))

let data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(data)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const entry = data.find(val => val.id == id)

    if(entry) {
        response.json(entry)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    data = data.filter(val => val.id != id)

    response.status(204).end()
}) 

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random() * (10**6))
    const entry = request.body
    entry.id = id

    if(!entry.name || !entry.number) {
      return response.status(400).json({
        error: 'name or number missing'
      })
    }
    
    if(data.find(val => val.name == entry.name)) {
      return response.status(400).json({
        error: 'name already in phonebook'
      })
    }

    data = data.concat(entry)
    response.json(entry)
}) 

app.get('/info', (request, response) => {
    const count = `Phonebook has info for ${data.length} people`
    const time = new Date()
    response.send(`<p>${count}</p><p>${time}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})