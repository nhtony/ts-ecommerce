import mongoose from 'mongoose'
import { countConnect } from '../helpers/check.connect'

const connectString = `mongodb://localhost:27017/shopDEV`

class Database {
  static instance: Database
  constructor() {
    this.connect()
  }

  //connect
  connect(type = 'mongodb') {
    // eslint-disable-next-line no-constant-condition
    if (1 === 1) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    mongoose
      .connect(connectString)
      .then((_) => {
        countConnect()
        console.log(`Connected Mongodb Successfully`)
      })
      .catch((err) => console.log(`Error Connect!`))
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()

export { instanceMongodb }
