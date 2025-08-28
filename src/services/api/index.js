import axios from "axios"

const instance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/",
})

instance.interceptors.request.use(
  (request) => {
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
