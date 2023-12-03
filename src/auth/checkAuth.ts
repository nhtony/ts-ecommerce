import { Request, Response, NextFunction, RequestHandler } from 'express'
import { findById } from '~/services/apiKey.service'

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}

interface ApiKeyRequest extends Request {
  objKey: any
}

const apiKey: any = async (req: ApiKeyRequest, res: Response, next: NextFunction) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString()
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }
    const objKey = await findById(key)
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }
    req.objKey = objKey
    return next()
  } catch (error) {
    console.log('apiKey error', error)
  }
}

const permission: any = (permission: string) => {
  return (req: ApiKeyRequest, res: Response, next: NextFunction) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: 'permission denied'
      })
    }
    console.log('permissions::', req.objKey.permissions)
    const validPermission = req.objKey.permissions.includes(permission)
    if (!validPermission) {
      return res.status(403).json({
        message: 'permission denied'
      })
    }
    return next()
  }
}

const asyncHandler = (fn: any) => {
  return (req: ApiKeyRequest, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}

export { apiKey, permission, asyncHandler }
