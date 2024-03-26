import { Request, Response, NextFunction } from 'express'

interface ApiKeyRequest extends Request {
  objKey: any
}

export const asyncHandler = (fn: any) => {
  return (req: ApiKeyRequest, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}
