import axios from 'axios'
import path from 'path'
import url from 'url'
import ISourceFileRes from "../interface/ISourceFileRes"

export default class Source {
  static readonly ERROR_EMPTY_URL: string = 'The source URL can not be empty.'
  static readonly ERROR_NO_SOURCE: string = 'The source URL does not contain any file.'

  static getLink(sourceLink: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (sourceLink === undefined || sourceLink.length < 1) {
        reject(Source.ERROR_EMPTY_URL)
        return
      }

      if (await Source.fileExists(sourceLink)) {
        resolve(sourceLink)
      }

      reject(Source.ERROR_NO_SOURCE)

      // try {
      //   const originalSourceLink = await Source.followToSourceFile(sourceLink)

      //   resolve(originalSourceLink)
      // } catch (err) {
      //   reject(err.message || err)
      // }
    })
  }

  static getFileInfo(sourceLink: string): Promise<ISourceFileRes> {
    return new Promise(async (resolve, reject) => {
      try {
        const res     = await axios.head(sourceLink)
        const resType = res.headers['content-type'].split('/')[0]

        if (res.status !== 200 || resType === 'text') {
          reject(Source.ERROR_NO_SOURCE)
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
        reject(Source.ERROR_NO_SOURCE)
      }
    })
  }

  // static followToSourceFile(sourceLink: string): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     // TODO: Reach to the source from the supplied link.
  //     reject(Source.ERROR_NO_SOURCE)
  //   })
  // }

  static fileExists(sourceLink: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        const res     = await axios.head(sourceLink)
        const resType = res.headers['content-type'].split('/')[0]

        if (res.status !== 200 || resType === 'text') {
          resolve(false)
          return
        }

        resolve(true)
      } catch (err) {
        resolve(false)
      }
    })
  }

  static verifySourceLink(sourceLink: string) {
    return axios.get('/api/source/verify', {
      params: {
        link: sourceLink
      }
    })
  }
}
