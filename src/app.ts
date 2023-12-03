import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import { router } from './routes'

interface AppError extends Error {
  status?: number
}

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
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: AppError = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error'
  })
})

export { app }
