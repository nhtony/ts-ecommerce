import { Response } from 'express'

const StatusCode = {
  OK: 200,
  CREATED: 201
}

const ReasonStatusCode = {
  OK: 'Success',
  CREATED: 'Created!'
}

class SuccessResponse {
  message: string
  status: number
  metadata: any

  constructor(message: string, metadata = {}, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK) {
    this.message = message ? message : reasonStatusCode
    this.status = statusCode
    this.metadata = metadata
  }

  send(res: Response, headers = {}) {
    return res.status(this.status).json(this)
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }: { message: string; metadata: any }) {
    super(message, metadata)
  }
}

class CREATED extends SuccessResponse {
  options: any
  constructor({
    message,
    metadata = {},
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    options = {}
  }: {
    message: string
    metadata: any
    statusCode?: number
    reasonStatusCode?: string
    options?: any
  }) {
    super(message, metadata, statusCode, reasonStatusCode)
    this.options = options
  }
}

export { OK, CREATED }
