import Path from 'path'
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
      const downloadPath = Path.resolve(__dirname, './../../../static/downloads')

      Source.downloadFile(file.sourceLink, downloadPath, async (status: string, downloadedPercentage: number) => {
        if (file.status !== status) {
          await file.updateOne({ status }).exec()
        }

        if (status === 'completed') {
          // TODO: Mail user about the completion of the download.
        }

        // TODO: Add a web socket connection.
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
