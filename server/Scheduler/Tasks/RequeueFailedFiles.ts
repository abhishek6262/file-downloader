import FileModel from '../../Database/Models/FileModel'
import Task from './Task'

class RequeueFailedFiles extends Task {
  async handle() {
    // TODO: Add limit or attempts to failed files so server does not
    // requeue them over and over again for the entire life.
    const failedFiles = await FileModel.find({ status: 'failed' })

    for (const file of failedFiles) {
      await file.updateOne({ status: 'pending' }).exec()
    }

    // Try to download failed files after 10 minutes.
    this.sleep(1000)
  }
}

export default RequeueFailedFiles
