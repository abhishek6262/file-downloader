import { NextApiRequest, NextApiResponse } from 'next'
import FileModel from '../../../server/Database/Models/FileModel'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, _id } = req.query

  try {
    const sourceFile = await FileModel.findByIdAndUpdate({ _id }, { email })

    res.status(200).json(sourceFile.toJSON())
  } catch (err) {
    res.status(500).json({ 'message': 'Sorry! Something went wrong. Please try again later.' })
  }
}
