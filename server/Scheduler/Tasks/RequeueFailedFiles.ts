import getConfig from 'next/config'
import FileModel from '../../Database/Models/FileModel'
import Task from './Task'

class RequeueFailedFiles extends Task {
  async handle() {
    const { serverRuntimeConfig } = getConfig()
    const MAX_FAILED_ATTEMPTS = serverRuntimeConfig.MAX_FAILED_ATTEMPTS

    const totalFailedFiles = await FileModel.find({ failedAttempts: { $lt: MAX_FAILED_ATTEMPTS }, status: 'failed' })

    for (const file of totalFailedFiles) {
      await file.updateOne({ status: 'pending', updatedAt: new Date })
    }

    // Try to download failed files after 5 minutes.
    this.sleep(300)
  }
}

export default RequeueFailedFiles
