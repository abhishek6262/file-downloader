import Path from 'path'
import FileModel, {IFileDocument} from '../../Database/Models/FileModel'
import Source from '../../Source/Source'
import Task from './Task'

class ProcessPendingFiles extends Task {
  private async isProcessing(): Promise<boolean> {
    const processingFiles = await FileModel.find({ status: 'processing' })

    return processingFiles.length > 0
  }

  private async processFiles(canProceed: CallableFunction) {
    const pendingFiles = await FileModel.find({ status: 'pending' }).limit(2)

    if (! canProceed(pendingFiles)) {
      return
    }

    for (const file of pendingFiles) {
      await this.downloadFile(file)
    }
  }

  private async downloadFile(file: IFileDocument) {
    try {
      const downloadDIR  = 'static/downloads'
      const downloadPath = Path.resolve(__dirname, './../../../' + downloadDIR)

      await file.updateOne({ status: 'processing' }).exec()

      await Source.downloadFile(file.sourceLink, downloadPath, async ({ status, completionPercentage, fileName }) => {
        if (status === 'completed') {
          const downloadLink = downloadDIR + '/' + fileName

          await file.updateOne({ downloadLink, status }).exec()

          // TODO: Mail user about the completion of the download.
        }

        // TODO: Add a web socket connection.
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
