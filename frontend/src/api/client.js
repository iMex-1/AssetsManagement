import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    if (err.response?.status === 403) {
      // Attach a friendly message so components can display it
      err.friendlyMessage = err.response.data?.message ?? 'Accès refusé. Vous n\'avez pas la permission d\'effectuer cette action.'
    }
    return Promise.reject(err)
  }
)

export default client
