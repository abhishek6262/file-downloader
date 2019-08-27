import axios from 'axios'

export function verifySourceLink(sourceLink: string) {
  return axios.get('/api/verify-source', {
    params: {
      link: sourceLink
    }
  })
}
