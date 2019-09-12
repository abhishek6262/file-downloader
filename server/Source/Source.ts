import Axios from 'axios'
import Fs from 'fs'
import Mime from 'mime'
import Path from 'path'
import Request from 'request'
import Uniqid from 'uniqid'
import Url from 'url'
import ISourceFile from './interface/ISourceFile'

export default class Source {
  static readonly ERROR_EMPTY_URL: string = 'The source URL can not be empty.'
  static readonly ERROR_NO_SOURCE: string = 'The source URL does not contain any file.'

  static async getLink(sourceLink: string): Promise<string> {
    if (sourceLink === undefined || sourceLink.length < 1) {
      throw new Error(this.ERROR_EMPTY_URL)
    }

    if (! await this.fileExists(sourceLink)) {
      throw new Error(this.ERROR_NO_SOURCE)
    }

    return sourceLink
  }

  static async getFileInfo(sourceLink: string): Promise<ISourceFile> {
    try {
      const res     = await Axios.head(sourceLink)
      const resType = res.headers['content-type'].split('/')[0]

      if (res.status !== 200 || resType === 'text') {
        throw new Error(this.ERROR_NO_SOURCE)
      }

      const fileName = Path.basename(Url.parse(sourceLink).pathname)
      const fileSize = res.headers['content-length'] / 1000 // Bytes to KB
      const fileType = res.headers['content-type']

      return {
        name: fileName,
        size: fileSize,
        sourceLink: sourceLink,
        type: fileType,
      }
    } catch (err) {
      throw new Error(this.ERROR_NO_SOURCE)
    }
  }

  static async fileExists(sourceLink: string): Promise<boolean> {
    try {
      await this.getFileInfo(sourceLink)

      return true
    } catch (err) {
      return false
    }
  }

  static async downloadFile(sourceLink: string, downloadPath: string, monitorDownloadProcess: CallableFunction) {
    const { type } = await this.getFileInfo(sourceLink)

    const fileExtension = Mime.getExtension(type)
    let fileName = Path.basename(Url.parse(sourceLink).pathname)

    // Generate a unique file name so it does not conflict with others
    // present in the same directory.
    fileName = Uniqid()
    fileName += '.' + fileExtension

    downloadPath = Path.resolve(downloadPath, fileName)

    let downloadedSize = 0
    let totalSize = 0

    const file = Fs.createWriteStream(downloadPath)

    Request(sourceLink)
      .on('error', err => {
        file.close()
        Fs.unlinkSync(downloadPath)

        throw err
      })
      .on('response', res => {
        totalSize = parseInt(res.headers['content-length'])
      })
      .on('data', data => {
        downloadedSize += data.length

        const completionPercentage = (downloadedSize / totalSize) * 100

        monitorDownloadProcess({ status: 'processing', completionPercentage, fileName })
      })
      .pipe(file)

    file.on('error', () => {
      file.close()
      Fs.unlinkSync(downloadPath)
    })

    file.on('finish', () => {
      file.close()
      monitorDownloadProcess({ status: 'completed', completionPercentage: 100, fileName })
    })
  }
}
