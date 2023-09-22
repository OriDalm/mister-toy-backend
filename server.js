import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { toyService } from './services/toy.service.js'
import { loggerService } from './services/logger.service.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'))
} else {
  const corsOptions = {
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

app.get('/api/toy', (req, res) => {
  const { filterBy = {}, sort = {} } = req.query.params

  toyService
    .query(filterBy, sort)
    .then((toys) => {
      res.send(toys)
    })
    .catch((err) => {
      loggerService.error('Cannot load toys', err)
      res.status(400).send('Cannot load toys')
    })
})

app.get('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params
  toyService
    .get(toyId)
    .then((toy) => {
      // toy.msgs =['HEllo']
      res.send(toy)
    })
    .catch((err) => {
      loggerService.error('Cannot get toy', err)
      res.status(400).send(err)
    })
})

app.delete('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params
  toyService
    .remove(toyId, loggedinUser)
    .then((msg) => {
      res.send({ msg, toyId })
    })
    .catch((err) => {
      loggerService.error('Cannot delete toy', err)
      res.status(400).send('Cannot delete toy, ' + err)
    })
})

app.post('/api/toy', (req, res) => {
  const toy = req.body

  toyService
    .save(toy)
    .then((savedToy) => {
      res.send(savedToy)
    })
    .catch((err) => {
      loggerService.error('Cannot add toy', err)
      res.status(400).send('Cannot add toy')
    })
})

app.put('/api/toy', (req, res) => {
  const toy = req.body
  toyService
    .save(toy)
    .then((savedToy) => {
      res.send(savedToy)
    })
    .catch((err) => {
      loggerService.error('Cannot update toy', err)
      res.status(400).send('Cannot update toy')
    })
})

app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const port = process.env.PORT || 3030
app.listen(port, () => {
  loggerService.info(`Server listening on port http://127.0.0.1:${port}`)
})
