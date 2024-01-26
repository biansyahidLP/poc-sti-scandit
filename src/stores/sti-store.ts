import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { Dialog, Loading, Notify } from 'quasar'
import { notification } from 'src/modules/Audio'

export const useStiStore = defineStore({
  id: 'sti',
  state: () => ({
    listShipmentReadyToSti: [] as Array<any>
  }),
  persist: true,
  getters: {
    totalStt: (state) => state.listShipmentReadyToSti.length,
    totalPieces: (state) => state.listShipmentReadyToSti.reduce((a: any, b: any) => {
      return a + b.stt_total_piece
    }, 0)
  },
  actions: {
    resetDataList () {
      this.listShipmentReadyToSti = []
    },
    async submitUpdateSti () {
      try {
        Loading.show()
        const { data } = await api.post('/hydra/v1/sti/generate', {
          hub_id: 0,
          hub_name: '',
          stt_no: this.listShipmentReadyToSti.map((list: any) => list.stt_no)
        })
        Loading.hide()
        const isAllFailed = data.data.total_stt_success === 0
        const isAllSuccess = data.data.total_stt_failed === 0
        if (isAllSuccess) {
          Dialog.create({
            title: 'Perubahan Status STT Berhasil !',
            message: 'Status STT berhasil diupdate menjadi STI.'
          }).onOk(() => this.resetDataList())
          return
        }
        if (isAllFailed) {
          Dialog.create({
            title: 'Perubahan Status STT Gagal !',
            message: 'Perubahan status STI gagal dibuat.'
          })
          return
        }
        Dialog.create({
          title: 'Perubahan Status STT Berhasil !',
          message: `Beberapa status STT berhasil diupdate menjadi STI, namun terdapat kegagalan pada ${data.data.total_stt_failed} STT`
        }).onOk(() => this.resetDataList())
      } catch (e: any) {
        Dialog.create({
          title: 'Perubahan Status STT Gagal !',
          message: e.response?.data?.message?.id || 'Something Went Wrong'
        })
        Loading.hide()
      }
    },
    async scanShipment (payload: string, isContinuousScan = false) {
      try {
        if (this.findExistingShipment(payload)) {
          this.onErrorScanNotification(undefined, isContinuousScan)
          return
        }
        const isLiloBag = payload.startsWith('TKP01-BAG-')

        Loading.show()
        const { data } = await api.get(`/hydra/v${isLiloBag ? '2' : '1'}/sti/stt-detail`, {
          params: {
            stt_or_pickup_code: payload
          }
        })
        const eligibleStt = this.checkAllSttToBeInserted(data)
        if (eligibleStt.length) {
          this.listShipmentReadyToSti = [
            ...this.listShipmentReadyToSti,
            ...eligibleStt
              .filter((sttToBeInserted: any) => !this.findExistingShipment(sttToBeInserted.stt.stt_no))
              .map((sttToBeInserted: any) => sttToBeInserted.stt)
          ]
          notification('success')
        }
        Loading.hide()
      } catch (err: any) {
        this.onErrorScanNotification(err.response?.data?.message?.id || 'Something Went Wrong', isContinuousScan)
        Loading.hide()
      }
    },
    checkAllSttToBeInserted (data: any, isContinuousScan = false) {
      const sttToBeInserteds = data.data.stts.filter((stt: any) => stt.is_allow_update_status)
      if (!sttToBeInserteds.length) {
        this.onErrorScanNotification(data.data.stts[0].error_message, isContinuousScan)
        return []
      }

      let findDuplicate = true
      sttToBeInserteds.forEach((stt: any) => {
        findDuplicate = findDuplicate && this.findExistingShipment(stt.stt.stt_no)
      })
      if (findDuplicate) {
        this.onErrorScanNotification(undefined, isContinuousScan)
        return []
      }
      return sttToBeInserteds
    },
    findExistingShipment (value: string) {
      return this.listShipmentReadyToSti.findIndex((item) => item.stt_no === value) > -1
    },
    removeShipmentFromList (payload: string) {
      const index = this.listShipmentReadyToSti.findIndex((item) => item.stt_no === payload)
      this.listShipmentReadyToSti.splice(index, 1)
    },
    onErrorScanNotification (message = 'STT sudah di scan', isContinuousScan = false) {
      notification('error')
      if (isContinuousScan) {
        Notify.create({
          type: 'negative',
          position: 'top-right',
          message
        })
        return
      }
      Dialog.create({
        title: 'Scan Gagal',
        message
      })
    }
  }
})
