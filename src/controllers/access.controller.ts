import { Request, Response, NextFunction } from 'express'
import { CREATED, OK } from '~/core/success.response'
import { AccessService } from '~/services/access.service'

interface CustomRequest extends Request {
  keyStore: any
}

class AccessController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    new OK({ message: 'Login successfully', metadata: await AccessService.login(req.body) }).send(res)
  }
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    new CREATED({
      message: 'Registered OK!',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10
      }
    }).send(res)
  }
  logOut = async (req: CustomRequest, res: Response, next: NextFunction) => {
    new OK({ message: 'LogOut successfully', metadata: await AccessService.logout(req.keyStore) }).send(res)
  }
}

const accessController = new AccessController()
export { accessController }
