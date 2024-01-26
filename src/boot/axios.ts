import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import { Cookies, Dialog } from 'quasar'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    Authorization: `Bearer ${Cookies.get('access_token')}`
  },
  timeout: 30000
})
api.interceptors.response.use(
  resp => {
    return resp
  },
  (error) => {
    let message = ''
    let title = ''
    if (error.code === 'ERR_NETWORK' || !error.response) {
      message = 'Pastikan koneksi internet Anda aktif'
      title = 'Tidak Terhubung ke Internet'
      Dialog.create({
        title,
        message
      })
      return
    }
    // if (error?.response?.status >= 400) {
    //   title = 'Gagal'
    //   message = error.response.data.message.id
    // }
    if (error?.response?.status >= 500) {
      title = 'Terjadi Gangguan Sistem'
      message = 'Halaman gagal dimuat. Muat ulang halaman ini'
      Dialog.create({
        title,
        message
      })
      return
    }
    return Promise.reject(error)
  }
)
api.interceptors.request.use(
  async config => {
    config.headers.Authorization = `Bearer ${Cookies.get('access_token')}`
    return config
  }
)
export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file
  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
