import { NextApiRequest, NextApiResponse } from 'next'
import FileModel from '../../../server/Database/Models/FileModel'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { status } = req.query

  try {
    const totalQueuedFiles = await FileModel.find({ status })

    res.status(200).json({ totalQueuedFiles: totalQueuedFiles.length })
  } catch (err) {
    res.status(500).json({ 'message': 'Sorry! Something went wrong. Please try again later.' })
  }
}
