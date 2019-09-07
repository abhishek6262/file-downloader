import FileModel from '../../Database/Models/FileModel'
import Source from '../../Source/Source'
import Task from './Task'

class ProcessFiles extends Task {
  private async processFile(file) {
    try {
      // TODO: Start a thread to handle the download process.
      Source.downloadFile(file.sourceLink, '/static/downloads', async (downloadPercent: number) => {
        if (downloadPercent === 0) {
          await file.updateOne({ status: 'processing' }).exec()
        }

        // 
      })
    } catch (err) {
      await file.updateOne({ status: 'failed' }).exec()

      // TODO: Log the failure.
    }
  }

  async handle() {
    const processingFiles = await FileModel.find({ status: 'processing' })

    // Terminate if some files are already processing to avoid processing
    // too many files at once and overloading the server.
    if (processingFiles.length > 0) {
      this.sleep(30)

      return
    }

    const pendingFiles = await FileModel.find({ status: 'pending' }).limit(2)

    if (pendingFiles.length < 1) {
      this.sleep(30)

      return
    }

    pendingFiles.forEach(this.processFile)
  }
}

export default ProcessFiles
