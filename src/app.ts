import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import { router } from './routes'

const app = express()

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)

// init db
require('./dbs/init.mongodb.ts')

// init routes
// eslint-disable-next-line @typescript-eslint/no-var-requires
app.use('/', router)

// handling error

export { app }
