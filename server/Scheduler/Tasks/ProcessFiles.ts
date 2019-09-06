import FileModel from '../../Database/Models/FileModel'
import Task from './Task'

class ProcessFiles extends Task {
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

    pendingFiles.forEach(file => {
      file.updateOne({ status: 'processing' }).exec()

      // TODO: Start a thread to handle the download process.
    })
  }
}

export default ProcessFiles
