import { KeyObject } from 'crypto'
import JWT, { Secret } from 'jsonwebtoken'

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

export { createTokensPair }
