import { Types } from 'mongoose'
import { keyTokenModel } from '~/models/keyToken.model'

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken
  }: {
    userId: Types.ObjectId
    publicKey: string
    privateKey: string
    refreshToken: string | undefined
  }) => {
    try {
      // const tokens = await keyTokenModel.create({
      //   shop: userId,
      //   publicKey,
      //   privateKey
      // })

      const filter = { shop: userId }
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken
      }
      const options = { upsert: true, new: true }
      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }

  static findByUserId = async (userId: any) => {
    return await keyTokenModel.findOne({ shop: new Types.ObjectId(userId) }).lean()
  }

  static removeTokenById = async ({ id }: Types.ObjectId) => {
    const result = await keyTokenModel.deleteOne({
      _id: new Types.ObjectId(id)
    })
    return result
  }
}

export { KeyTokenService }
