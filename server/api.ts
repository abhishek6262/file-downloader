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

export function updateEmailAddress({ email, _id }) {
  return axios.get('/api/source/update', {
    params: {
      _id,
      email
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
