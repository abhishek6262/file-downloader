import { NextApiRequest, NextApiResponse } from 'next'
import ISourceFile from '../../../util/Source/interface/ISourceFile'
import ISourceFileRes from '../../../util/Source/interface/ISourceFileRes'
import Source from '../../../util/Source/Source'

export default async (req: NextApiRequest, res: NextApiResponse) => { 
  try {
    const sourceLink: string            = await Source.getLink(<string> req.query.link)
    const sourceFileRes: ISourceFileRes = await Source.getFileInfo(sourceLink)

    const sourceFile: ISourceFile = {
      id: -1,
      downloadLink: '',
      sourceLink,
      name: sourceFileRes.name,
      size: sourceFileRes.size,
      status: 'verified',
      type: sourceFileRes.type,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    res.status(200).json(sourceFile)
  } catch (err) {
    res.status(422).json({ 'message': err.message || err })
  }
}
