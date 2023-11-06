import mongoose from 'mongoose'
import os from 'os'

const _SECONDS = 5000
const countConnect = () => {
  const numConnection = mongoose.connections.length
  console.log(`Number of connections::${numConnection}`)
}

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsages = process.memoryUsage().rss
    console.log(`Memory usage::${memoryUsages / 1024 / 1024} MB`)

    // Example maximum number of connections based on number of cores
    const maxConnections = numCores * 5
    if (numConnection > maxConnections) {
      console.log(`Connection overload detected`)
    }
  }, _SECONDS)
}

export { countConnect, checkOverload }
