import express from 'express'
import { asyncHandler } from '~/auth/checkAuth'
import { accessController } from '~/controllers/access.controller'

const accessRouter = express.Router()

accessRouter.post('/shop/signup', asyncHandler(accessController.signUp) as any)

export { accessRouter }
