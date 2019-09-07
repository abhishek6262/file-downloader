import Axios from 'axios'
import Fs from 'fs'
import Path from 'path'
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

  static async downloadFile(sourceLink: string, path: string, monitorDownloadProcess: CallableFunction) {
    const fileName = Path.basename(Url.parse(sourceLink).pathname)

    if (path[0] === '/') {
      path = path.substr(1)
    }

    const downloadPath = Path.resolve(__dirname, './../../' + path, fileName)

    const res = await Axios({
      method: 'GET',
      url: sourceLink,
      responseType: 'stream',
      onDownloadProgress(progressEvent) {
        console.log(progressEvent)

        // Do something as the download progresses
        // monitorDownloadProcess()
      }
    })

    res.data.pipe(Fs.createWriteStream(downloadPath))
  }
}
