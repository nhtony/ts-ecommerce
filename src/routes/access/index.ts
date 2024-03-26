import express from 'express'
import { accessController } from '~/controllers/access.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import { authentication } from '~/auth/authUltis'

const accessRouter = express.Router()

accessRouter.post('/shop/signup', asyncHandler(accessController.signUp) as any)
accessRouter.post('/shop/login', asyncHandler(accessController.login) as any)

accessRouter.use(authentication as any)

accessRouter.post('/shop/logout', asyncHandler(accessController.logOut) as any)

export { accessRouter }
