import { Types } from 'mongoose'
import { keyTokenModel } from '~/models/keyToken.model'

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey
  }: {
    userId: Types.ObjectId
    publicKey: string
    privateKey: string
  }) => {
    try {
      const tokens = await keyTokenModel.create({
        shop: userId,
        publicKey,
        privateKey
      })
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }
}

export { KeyTokenService }
