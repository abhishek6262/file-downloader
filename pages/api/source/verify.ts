import { NextApiRequest, NextApiResponse } from 'next'
import ISourceFile from '../../../server/Source/interface/ISourceFile'
import Source from '../../../server/Source/Source'

export default async (req: NextApiRequest, res: NextApiResponse) => { 
  try {
    const sourceLink: string          = await Source.getLink(<string> req.query.link)
    const sourceFileInfo: ISourceFile = await Source.getFileInfo(sourceLink)
    const sourceFile: ISourceFile     = Object.assign({}, sourceFileInfo)

    sourceFile._id = -1
    sourceFile.downloadLink = ''
    sourceFile.status = 'verified'
    sourceFile.createdAt = new Date().toISOString()
    sourceFile.updatedAt = new Date().toISOString()

    res.status(200).json(sourceFile)
  } catch (err) {
    res.status(422).json({ 'message': err.message || err })
  }
}
