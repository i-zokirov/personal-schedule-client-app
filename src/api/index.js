import { API_URL } from '@/config'
import axios from 'axios'

const apiUrl = axios.create({
  baseURL: API_URL,
  withCredentials: false,
})

apiUrl.defaults.headers.common['Content-Type'] = 'application/json'

export default apiUrl
