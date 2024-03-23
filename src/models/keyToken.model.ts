import { model, Schema } from 'mongoose'

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

const keyTokenSchema = new Schema(
  {
    shop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop'
    },
    publicKey: {
      type: String,
      trim: true
    },
    privateKey: {
      type: String,
      trim: true
    },
    refreshTokenUsed: {
      type: Array,
      default: []
    },
    refreshToken: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const keyTokenModel = model(DOCUMENT_NAME, keyTokenSchema)

export { keyTokenModel }
