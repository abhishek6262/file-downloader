import axios from 'axios'

export function countSourceFiles(status: string) {
  return axios.get('/api/source/count', { params: { status } } )
}

export function queueSourceFile(sourceLink: string) {
  return axios.get('/api/source/add', {
    params: {
      link: sourceLink
    }
  })
}

export function verifySourceLink(sourceLink: string) {
  return axios.get('/api/source/verify', {
    params: {
      link: sourceLink
    }
  })
}
