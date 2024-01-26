import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { Cookies, Dialog, Loading } from 'quasar'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    currentUser: null as any
  }),
  getters: {
    name: (state) => state.currentUser?.name
  },
  actions: {
    async login (email: string, password: string) {
      try {
        Loading.show()
        const { data } = await api.post('/horde/v2/auth/login', {
          email,
          password
        })
        Cookies.set('access_token', data.data.token, {
          expires: new Date(data.data.expired_at)
        })
        this.router.replace({
          name: 'update-sti'
        })
        Loading.hide()
      } catch (e:any) {
        Loading.hide()
        Dialog.create({
          title: 'Gagal Login',
          message: e.response?.data?.message?.id || 'Something Went Wrong'
        })
      }
    },
    async logout () {
      try {
        Loading.show()
        await api.post('/horde/v1/auth/logout', {})
        Cookies.remove('access_token')
        this.router.replace('/login')
        Loading.hide()
      } catch (e) {
        Cookies.remove('access_token')
        this.router.replace('/login')
      }
    },
    async checkLogin () {
      if (!Cookies.get('access_token')) {
        this.router.replace('/login')
        return
      }
      await this.getProfile()
    },
    async getProfile () {
      try {
        const { data } = await api.get('/horde/v1/account/profile')
        this.currentUser = data.data
      } catch (e) {
        await this.logout()
      }
    }
  }
})
