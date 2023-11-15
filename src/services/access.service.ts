import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { shopModel } from '~/models/shop.model'
import { KeyTokenService } from './keyToken.service'
import { createTokensPair } from '~/auth/authUltis'

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

class AccessService {
  static signUp = async ({ name, email, password, roles }: SignUpParams) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean()
      if (holderShop) {
        return {
          code: 'xxxx',
          message: 'Shop already registered!'
        }
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
        console.log('newShop', newShop)

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey
        })

        // console.log(keyStore)

        if (!keyStore) {
          return {
            code: 'xxxx',
            message: 'keyStore error'
          }
        }

        const tokens = await createTokensPair({ userId: newShop._id, email }, publicKey, privateKey)

        return {
          code: 201,
          metadata: {
            shop: newShop,
            tokens
          }
        }
      }

      return {
        code: 20,
        metadata: null
      }
    } catch (error: any) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }
}

export { AccessService }
