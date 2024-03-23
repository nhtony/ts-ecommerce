import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { shopModel } from '~/models/shop.model'
import { KeyTokenService } from './keyToken.service'
import { createTokensPair } from '~/auth/authUltis'
import { AuthFailureError, BadRequestError } from '~/core/error.response'
import { findByEmail } from './shop.service'
import { getInfoData } from '../utils'

enum RoleShop {
  SHOP = 'SHOP',
  WRITER = 'WRITER',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN'
}

type SignUpParams = {
  name: string
  email: string
  password: string
  roles: string[]
}

type LoginParams = {
  email: string
  password: string
  refreshToken: string | null
}

class AccessService {
  static login = async ({ email, password, refreshToken = null }: LoginParams) => {
    const foundShop = await findByEmail({ email })

    if (!foundShop) throw new BadRequestError('Shop not registered')

    const math = await bcrypt.compare(password, foundShop.password)
    if (!math) throw new AuthFailureError('Authentication error')

    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    const { _id: userId } = foundShop
    const tokens = await createTokensPair({ userId, email }, publicKey, privateKey)

    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens?.refreshToken
    })

    return {
      shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
      tokens
    }
  }

  static signUp = async ({ name, email, password, roles }: SignUpParams) => {
    const holderShop = await shopModel.findOne({ email }).lean()
    if (holderShop) {
      throw new BadRequestError('Error: Shop already registered!')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP]
    })

    if (newShop) {
      // created privateKey, publicKey

      const privateKey = crypto.randomBytes(64).toString('hex')
      const publicKey = crypto.randomBytes(64).toString('hex')

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshToken: undefined
      })

      // console.log(keyStore)

      if (!keyStore) {
        throw new BadRequestError('Error: keyStore erorr!')
      }

      const tokens = await createTokensPair({ userId: newShop._id, email }, publicKey, privateKey)

      return {
        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
        tokens
      }
    }

    return {
      code: 20,
      metadata: null
    }
  }
}

export { AccessService }
