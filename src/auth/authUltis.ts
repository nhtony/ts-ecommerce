import { NextFunction, Request, Response } from 'express'
import JWT from 'jsonwebtoken'
import { AuthFailureError, NotFoundError } from '~/core/error.response'
import { asyncHandler } from '~/helpers/asyncHandler'
import { KeyTokenService } from '~/services/keyToken.service'

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id'
}

interface CustomRequest extends Request {
  keyStore: any
}

const createTokensPair = async (payload: any, publicKey: string, privateKey: string) => {
  try {
    const acessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days'
    })
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days'
    })

    JWT.verify(acessToken, publicKey, (err: any, decode: any) => {
      if (err) {
        console.log(`error verify::`, err)
      } else {
        console.log(`decode verify::`, decode)
      }
    })
    return { acessToken, refreshToken }
  } catch (error) {
    console.log('error', error)
  }
}

const authentication = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  /* 
    1 - Check userId missing ??
    2 - get accessToken
    3 - verifyToken 
    4 - check user in dbs?
    5 - check keyStore with this userId?
    6 - Ok all => return next()
  */
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invalid Request')

  const keyStore = await KeyTokenService.findByUserId(userId)
  console.log('keyStore', keyStore)
  if (!keyStore) throw new NotFoundError('Not found keyStore')

  const accessToken = req.headers[HEADER.AUTHORIZATION] as string
  if (!accessToken) throw new AuthFailureError('Invalid KeyStore')

  // eslint-disable-next-line no-useless-catch
  try {
    const decodeUser: any = JWT.verify(accessToken, keyStore.publicKey as any)
    console.log('decodeUser', decodeUser)

    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
    req.keyStore = keyStore
    return next()
  } catch (error) {
    throw error
  }
})

export { createTokensPair, authentication }
