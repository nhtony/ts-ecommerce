import { Request, Response, NextFunction } from 'express'
import { CREATED } from '~/core/success.response'
import { AccessService } from '~/services/access.service'

class AccessController {
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    new CREATED({
      message: 'Registered OK!',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10
      }
    }).send(res)
  }
}

const accessController = new AccessController()
export { accessController }
