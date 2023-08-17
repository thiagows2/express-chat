import axios from 'axios'
import { configure } from 'axios-hooks'

const apiClient = axios.create({
  // baseURL: 'https://apichat.thiagows.dev'
  baseURL: 'http://localhost:4040'
})

export function configAxios() {
  configure({ axios: apiClient })
}
