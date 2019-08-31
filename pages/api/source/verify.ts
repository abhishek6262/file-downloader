import { NextApiRequest, NextApiResponse } from 'next'
import ISourceFile from '../../../util/Source/interface/ISourceFile'
import Source from '../../../util/Source/Source'

export default async (req: NextApiRequest, res: NextApiResponse) => { 
  try {
    const sourceLink: string          = await Source.getLink(<string> req.query.link)
    const sourceFileInfo: ISourceFile = await Source.getFileInfo(sourceLink)
    const sourceFile: ISourceFile     = Object.assign({}, sourceFileInfo)

    sourceFile.id -1
    sourceFile.downloadLink = ''
    sourceFile.status = 'verified'
    sourceFile.created_at = new Date().toISOString()
    sourceFile.updated_at = new Date().toISOString()

    res.status(200).json(sourceFile)
  } catch (err) {
    res.status(422).json({ 'message': err.message || err })
  }
}
