import Path from 'path'
import FileModel from '../../Database/Models/FileModel'
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

  private async downloadFile(file) {
    try {
      const downloadPath = Path.resolve(__dirname, './../../../static/downloads')

      await Source.downloadFile(file.sourceLink, downloadPath, async (status: string, completionPercentage: number) => {
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
