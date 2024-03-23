import { pick } from 'lodash'

export const getInfoData = ({ fields = [], object = {} }: { fields: string[]; object: any }) => {
  return pick(object, fields)
}
