import FileModel from '../../Database/Models/FileModel'
import ITask from './ITask'

class ProcessFiles implements ITask {
  async handle() {
    const processingFiles = await FileModel.find({ status: 'processing' })

    // Terminate if some files are already processing to avoid processing
    // too many files at once and overloading the server.
    if (processingFiles.length > 0) {
      return
    }

    const pendingFiles = await FileModel.find({ status: 'pending' }).limit(2)

    if (pendingFiles.length < 1) {
      return
    }

    pendingFiles.forEach(file => {
      file.updateOne({ status: 'processing' }).exec()

      // TODO: Start a thread to handle the download process.
    })
  }
}

export default ProcessFiles
