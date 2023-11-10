import mongoose from 'mongoose'
import { countConnect } from '../helpers/check.connect'
import { appConfig } from '../configs/config.mongdb'

const { host, port, name } = appConfig.db
const connectString = `mongodb://${host}:${port}/${name}`

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
      .connect(connectString, {
        maxPoolSize: 50
      })
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
