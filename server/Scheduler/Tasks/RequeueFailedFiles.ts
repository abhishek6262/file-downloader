import getConfig from 'next/config'
import FileModel from '../../Database/Models/FileModel'
import Task from './Task'

class RequeueFailedFiles extends Task {
  async handle() {
    const { serverRuntimeConfig } = getConfig()
    const MAX_FAILED_ATTEMPTS = serverRuntimeConfig.MAX_FAILED_ATTEMPTS

    const failedFiles = await FileModel.find({ status: 'failed' })

    for (const file of failedFiles) {
      if (file.failedAttempts < MAX_FAILED_ATTEMPTS) {
        await file.updateOne({ status: 'pending' }).exec()
      }
    }

    // Try to download failed files after 5 minutes.
    this.sleep(300)
  }
}

export default RequeueFailedFiles
