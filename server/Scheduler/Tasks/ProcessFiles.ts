import FileModel from '../../Database/Models/FileModel'
import Source from '../../Source/Source'
import Task from './Task'

class ProcessFiles extends Task {
  private async isFilesProcessing(): Promise<boolean> {
    const processingFiles = await FileModel.find({ status: 'processing' })

    return processingFiles.length > 0
  }

  private async processPendingFiles(processFiles: CallableFunction) {
    const pendingFiles = await FileModel.find({ status: 'pending' }).limit(2)

    if (! processFiles(pendingFiles)) {
      return
    }

    pendingFiles.forEach(this.downloadFile)
  }

  private async downloadFile(file) {
    try {
      // TODO: Start a thread to handle the download process.
      Source.downloadFile(file.sourceLink, '/static/downloads', async (downloadPercent: number) => {
        if (downloadPercent === 0) {
          await file.updateOne({ status: 'processing' }).exec()
        } else if (downloadPercent === 50) {
          // TODO: Mail user about the half download.
        } else if (downloadPercent === 100) {
          await file.updateOne({ status: 'completed' }).exec()

          // TODO: Mail user about the completion of the download.
        }
      })
    } catch (err) {
      await file.updateOne({ status: 'failed' }).exec()

      // TODO: Mail user about the failed download.
    }
  }

  private async requeueFailedFiles() {
    // TODO: Add limit or attempts to failed files so server does not
    // requeue them over and over again for the entire life.
    const failedFiles = await FileModel.find({ status: 'failed' })

    failedFiles.forEach(async (file) => {
      await file.updateOne({ status: 'pending' }).exec()
    })
  }

  async handle() {
    // Terminate if some files are already processing to avoid processing
    // too many files at once and overloading the server.
    if (await this.isFilesProcessing()) {
      this.sleep(30)
      return
    }

    await this.processPendingFiles(pendingFiles => {
      if (pendingFiles.length > 0) {
        return true
      }

      this.sleep(30)

      return false
    })

    // Add failed files to queue at the end so newly added files are given
    // priority over them.
    this.requeueFailedFiles()
  }
}

export default ProcessFiles
