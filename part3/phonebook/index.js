require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Entry = require('./models/entry')

morgan.token('POST-body', (req, res) => {
  if(req.method == 'POST') return JSON.stringify(req.body)
  return ''
})

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
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

app.get('/api/persons', (request, response) => {
  Entry.find({}).then(entries => {
    response.json(entries)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Entry.findById(request.params.id)
  .then(entry => {
    if(entry) response.json(entry)
    else response.status(404).json({
      error: 'id not found',
    })
  })
  .catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response) => {
  Entry.deleteOne({_id: request.params.id})
  .then(res => {
    response.status(204).end()
  })
}) 

app.post('/api/persons', (request, response, next) => {
  const {name, number} = request.body

  Entry.exists({name: name})
    .then(val => {
      if(val) {
        return response.status(400).json({
          error: 'name already in phonebook'
        })
      }
      
      const entry = new Entry({
        name: name,
        number: number,
      })

      entry.save().then(savedEntry => {
        response.json(savedEntry)
      }).catch(err => next(err))

    })
    .catch(err => next(err));
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Entry.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updated => {
      response.json(updated);
    })
    .catch(err => next(err));
})

app.get('/info', (request, response) => {
    const count = `Phonebook has info for ${data.length} people`
    const time = new Date()
    response.send(`<p>${count}</p><p>${time}</p>`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }


  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})