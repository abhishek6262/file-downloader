import { NextApiRequest, NextApiResponse } from 'next'
import Connection from '../../../server/Database/Connection'
import FileModel from '../../../server/Database/Models/FileModel'
import ISourceFile from '../../../server/Source/interface/ISourceFile'
import Source from '../../../server/Source/Source'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let sourceFileInfo: ISourceFile
  let sourceLink: string

  try {
    sourceLink     = await Source.getLink(<string> req.query.link)
    sourceFileInfo = await Source.getFileInfo(sourceLink)
  } catch (err) {
    res.status(422).json({ 'message': err.message || err })

    return
  }

  try {
    if (! Connection.isConnected()) {
      await Connection.create()
    }

    const sourceFile = new FileModel({
      name      : sourceFileInfo.name,
      size      : sourceFileInfo.size,
      sourceLink: sourceLink,
      type      : sourceFileInfo.type,
    })

    await sourceFile.save()

    res.status(201).json(sourceFile.toJSON())
  } catch (err) {
    res.status(500).json({ 'message': 'Sorry! Something went wrong. Please try again later.' })
  }
}
