import axios from 'axios'

export function queueSourceFile(sourceLink: string) {
  return axios.get('/api/source/queue', {
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
