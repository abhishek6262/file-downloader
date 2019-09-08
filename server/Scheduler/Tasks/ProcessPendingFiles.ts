import getConfig from 'next/config'
import Path from 'path'
import FileModel, {IFileDocument} from '../../Database/Models/FileModel'
import Source from '../../Source/Source'
import Task from './Task'
import WebSocket from '../../WebSocket'

class ProcessPendingFiles extends Task {
  private async isProcessing(): Promise<boolean> {
    const processingFiles = await FileModel.find({ status: 'processing' })

    return processingFiles.length > 0
  }

  private async processFiles(canProceed: CallableFunction) {
    const { serverRuntimeConfig } = getConfig()
    const MAX_SERVICE_WORKERS = serverRuntimeConfig.MAX_SERVICE_WORKERS

    const pendingFiles = await FileModel.find({ status: 'pending' }).limit(MAX_SERVICE_WORKERS)

    if (!canProceed(pendingFiles)) {
      return
    }

    for (const file of pendingFiles) {
      await this.downloadFile(file)
    }
  }

  private async downloadFile(file: IFileDocument) {
    const { publicRuntimeConfig: { APP_URL } } = getConfig()

    const downloadDIR  = 'static/downloads'
    const downloadPath = Path.resolve(__dirname, './../../../' + downloadDIR)

    try {
      await file.updateOne({ status: 'processing' }).exec()

      await Source.downloadFile(file.sourceLink, downloadPath, async ({ status, completionPercentage, fileName }) => {
        const downloadLink = downloadDIR + '/' + fileName

        // TODO: Limit the messages sent via web socket to avoid over
        // charges by the third-party apps.
        WebSocket.broadcast('my-channel', {
          _id: file._id,
          completionPercentage: completionPercentage.toFixed(2),
          downloadLink: APP_URL + '/' + downloadLink,
          status,
        })

        if (status === 'completed') {
          await file.updateOne({ downloadLink, status }).exec()

          // TODO: Mail user about the completion of the download.
        }
      })
    } catch (err) {
      const failedAttempts = file.failedAttempts + 1

      await file.updateOne({ failedAttempts, status: 'failed' }).exec()

      // TODO: Mail user about the failed download & also about max tried.
    }
  }

  async handle() {
    // Terminate if some files are already processing to avoid processing
    // too many files at once and overloading the server.
    if (await this.isProcessing()) {
      this.sleep(30)
      return
    }

    await this.processFiles(pendingFiles => {
      if (pendingFiles.length > 0) {
        return true
      }

      this.sleep(30)

      return false
    })
  }
}

export default ProcessPendingFiles
