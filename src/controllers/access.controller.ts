import { Request, Response, NextFunction } from 'express'
import { AccessService } from '~/services/access.service'

class AccessController {
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(`[P]::signUp::`, req.body)
      return res.status(201).json(await AccessService.signUp(req.body))
    } catch (error) {
      next(error)
    }
  }
}

const accessController = new AccessController()
export { accessController }
