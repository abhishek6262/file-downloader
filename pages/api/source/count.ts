import { NextApiRequest, NextApiResponse } from 'next'
import Connection from '../../../utils/Database/Connection'
import FileModel from '../../../utils/Database/Models/FileModel'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { status } = req.query

  try {
    if (!Connection.isConnected()) {
      await Connection.create()
    }

    const totalQueuedFiles = await FileModel.find({ status })

    res.status(200).json({ totalQueuedFiles: totalQueuedFiles.length })
  } catch (err) {
    res.status(500).json({ 'message': 'Sorry! Something went wrong. Please try again later.' })
  }
}
