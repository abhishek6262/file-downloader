import Fs from 'fs'
import Path from 'path'
import Task from './Task'
import FileModel from '../../Database/Models/FileModel'

class CleanDiskSpace extends Task {
  async handle() {
    const today = new Date

    const files = await FileModel.find({
      status: { $ne: 'expired' },
      updatedAt: { $lte: today.setMonth(today.getMonth() - 1) }
    })

    for (const file of files) {
      const filePath = Path.resolve(__dirname, './../../../' + file.filePath)

      if (Fs.existsSync(filePath)) {
        Fs.unlinkSync(filePath)
      }

      await file.updateOne({ status: 'expired', updatedAt: new Date })
    }

    // Query for disk space in every 2 hours.
    this.sleep(7200)
  }
}

export default CleanDiskSpace
