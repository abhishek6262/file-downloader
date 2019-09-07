import axios from 'axios'
import path from 'path'
import url from 'url'
import ISourceFile from './interface/ISourceFile'

export default class Source {
  static readonly ERROR_EMPTY_URL: string = 'The source URL can not be empty.'
  static readonly ERROR_NO_SOURCE: string = 'The source URL does not contain any file.'

  static getLink(sourceLink: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (sourceLink === undefined || sourceLink.length < 1) {
        reject(this.ERROR_EMPTY_URL)
        return
      }

      if (! await this.fileExists(sourceLink)) {
        reject(this.ERROR_NO_SOURCE)
        return
      }

      resolve(sourceLink)
    })
  }

  static getFileInfo(sourceLink: string): Promise<ISourceFile> {
    return new Promise(async (resolve, reject) => {
      try {
        const res     = await axios.head(sourceLink)
        const resType = res.headers['content-type'].split('/')[0]

        if (res.status !== 200 || resType === 'text') {
          reject(this.ERROR_NO_SOURCE)
          return
        }

        const fileName = path.basename(url.parse(sourceLink).pathname)
        const fileSize = res.headers['content-length'] / 1000 // Bytes to KB
        const fileType = res.headers['content-type']

        resolve({
          name: fileName,
          size: fileSize,
          sourceLink: sourceLink,
          type: fileType,
        })
      } catch (err) {
        reject(this.ERROR_NO_SOURCE)
      }
    })
  }

  static fileExists(sourceLink: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        await this.getFileInfo(sourceLink)

        resolve(true)
      } catch (err) {
        resolve(false)
      }
    })
  }

  static downloadFile(sourceLink: string, path: string, monitorProcess: CallableFunction) {
    return new Promise(async (resolve, reject) => {
      // Do something as the download progresses
      monitorProcess()
    })
  }
}
