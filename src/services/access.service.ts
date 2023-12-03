import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { shopModel } from '~/models/shop.model'
import { KeyTokenService } from './keyToken.service'
import { createTokensPair } from '~/auth/authUltis'
import { BadRequestError } from '~/core/error.response'

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
        throw new BadRequestError('Error: keyStore erorr!')
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
  }
}

export { AccessService }
