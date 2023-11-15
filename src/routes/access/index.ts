import express from 'express'
import { accessController } from '~/controllers/access.controller'

const accessRouter = express.Router()

accessRouter.post('/shop/signup', accessController.signUp)

export { accessRouter }
