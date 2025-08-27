import axios from "axios"
// import { firebaseAuth } from '../firebase'

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

// const firebaseAuthPromise = new Promise((resolve) => {
//     const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
//         unsubscribe()
//         resolve(user)
//     })
// })

// const timeoutPromise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         reject(new Error('Firebase app initialization timed out'))
//     }, 5000) // Adjust the timeout duration as needed
// })

// instance.interceptors.request.use(async function (config) {
//     console.log('I am intercepting', config)

//     // const firebase = useContext(FirebaseContext)

//     try {
//         await Promise.race([firebaseAuthPromise, timeoutPromise]) // Wait for the Firebase app to initialize or time out
//         const idToken = (await firebaseAuth.currentUser?.getIdToken()) ?? ''
//         if (idToken.length !== 0) {
//             config.headers.Authorization = idToken
//         }
//     } catch (error) {
//         // toast.error("Session Expired, Please Login Again");
//         // window.location.href = "/login";
//         console.log('DEBUG: I am rejecting', error)
//         // throw error; // Propagate the error to the caller of the interceptor
//         return ''
//     }

//     console.log(config)

//     return config
// })

// // added interceptors to the response
// // easy to debug
// instance.interceptors.response.use(
//     (response) => {
//         console.log('api response,', response)
//         // Edit response config
//         return response
//     },
//     (error) => {
//         if (error.response === null) {
//             if (window.location.pathname !== '/misc/maintenance/') {
//                 window.location.href = '/misc/maintenance/'
//             }
//         } else if (Number(error.response?.status) === 400) {
//         } else if (Number(error.response?.status) === 401) {
//             if (window.location.pathname !== '/misc/not-authorized/') {
//                 window.location.href = '/misc/not-authorized/'
//             }
//             // window.location.href = "/misc/not-authorized/";
//             // handle 502
//         } else if (Number(error.response?.status) === 502) {
//             if (window.location.pathname !== '/misc/maintenance/') {
//                 window.location.href = '/misc/maintenance/'
//             }
//         }
//         return Promise.reject(error)
//     }
// )

export default instance
