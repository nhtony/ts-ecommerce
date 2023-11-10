const dev = {
  app: {
    ports: process.env.DEV_APP_PORT || 3052
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || 'shopDEV'
  }
}

const pro = {
  app: {
    ports: process.env.PRO_APP_PORT || 3000
  },
  db: {
    host: process.env.PRO_DB_HOST || 'localhost',
    port: process.env.PRO_DB_PORT || 27017,
    name: process.env.PRO_DB_NAME || 'shopPRO'
  }
}

const config = { dev, pro }
const env = process.env.NODE_ENV || 'dev'
const appConfig = config[env as keyof typeof config]

export { appConfig }
