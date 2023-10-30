import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'

const app = express()

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// init db

// init routes
app.get('/', (red, res, next) => {
  const strCompress = 'Hello Factipjs'
  return res.status(500).json({
    message: 'Welcome Fantipjs!',
    metadata: strCompress.repeat(1000000)
  })
})

// handling error

export { app }
