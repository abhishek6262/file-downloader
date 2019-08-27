import { NextApiRequest, NextApiResponse } from 'next'
import ISourceFile from './interface/ISourceFile'

export default (req: NextApiRequest, res: NextApiResponse) => { 
  const sourceLink = <string> req.query.link

  // TODO: Verify the source link.

  const sourceFile: ISourceFile = {
    id: -1,
    downloadLink: '',
    sourceLink,
    name: 'Prince of Persia',
    size: 2048, // MB
    status: 'verified',
    type: 'video/mp4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  res.status(200).json(sourceFile)
}
