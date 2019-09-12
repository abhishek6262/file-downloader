import getConfig from 'next/config'
import Path from 'path'
import FileModel, { IFileDocument } from '../../Database/Models/FileModel'
import Mailer from '../../Mailer'
import Source from '../../Source/Source'
import Task from './Task'
import WebSocket from '../../WebSocket'

class ProcessPendingFiles extends Task {
  private async isProcessing(): Promise<boolean> {
    const processingFiles = await FileModel.find({ status: 'processing' })

    return processingFiles.length > 0
  }

  private async processFiles(canProceed: CallableFunction) {
    const { serverRuntimeConfig: { MAX_SERVICE_WORKERS } } = getConfig()

    const pendingFiles = await FileModel.find({ status: 'pending' }).limit(MAX_SERVICE_WORKERS)

    if (!canProceed(pendingFiles)) {
      return
    }

    for (const file of pendingFiles) {
      await this.downloadFile(file)
    }
  }

  private async downloadFile(file: IFileDocument) {
    const { serverRuntimeConfig: { MAX_FAILED_ATTEMPTS } } = getConfig()
    const { APP_NAME, TRACK_DOWNLOAD_COMPLETION } = process.env

    const downloadDIR  = 'static/downloads'
    const downloadPath = Path.resolve(__dirname, './../../../' + downloadDIR)

    try {
      file = await FileModel.findOneAndUpdate({ _id: file._id }, { status: 'processing', updatedAt: new Date }, { new: true })

      await Source.downloadFile(file.sourceLink, downloadPath, async ({ status, completionPercentage, fileName }) => {
        const filePath = downloadDIR + '/' + fileName

        if (status === 'completed') {
          file = await FileModel.findOneAndUpdate({ _id: file._id }, { filePath, status, updatedAt: new Date }, { new: true })

          if (file.email.length > 0) {
            const downloadLink = file.downloadLink
            const message = `Hello,<br><br>Thanks for using our service. We have successfully generated a safe, resumable and light-speed download link for you. You can start your download right away by clicking on the link below.<br><br><a href="${downloadLink}" target="_blank">${downloadLink}</a><br><br>Happy Converting.<br><br>Regards,<br>${APP_NAME}.`

            await Mailer.send(file.email, APP_NAME + ' - Download Completed', message)
          }
        }

        WebSocket.broadcast(`${TRACK_DOWNLOAD_COMPLETION}/${file._id}`, {
          completionPercentage: completionPercentage.toFixed(2),
          downloadLink: file.downloadLink,
          status,
        })
      })
    } catch (err) {
      const failedAttempts = file.failedAttempts + 1

      file = await FileModel.findOneAndUpdate({ _id: file._id }, { failedAttempts, status: 'failed', updatedAt: new Date }, { new: true })

      if (file.failedAttempts < MAX_FAILED_ATTEMPTS) {
        const message = `Hello,<br><br>We failed to generate a link for your file <b>"${file.name}"</b>. But we will continue trying to generate again few more times and we will update you about the same.<br><br>Happy Converting.<br><br>Regards,<br>${APP_NAME}.`

        await Mailer.send(file.email, APP_NAME + ' - Download Failed', message)
      } else {
        const message = `Hello,<br><br>We failed to generate a link for your file <b>"${file.name}"</b>. But we can try to generate for your new files.<br><br>Happy Converting.<br><br>Regards,<br>${APP_NAME}.`

        await Mailer.send(file.email, APP_NAME + ' - Download Failed', message)
      }
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
