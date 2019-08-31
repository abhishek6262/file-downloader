import axios from 'axios'

export function verifySourceLink(sourceLink: string) {
  return axios.get('/api/source/verify', {
    params: {
      link: sourceLink
    }
  })
}
