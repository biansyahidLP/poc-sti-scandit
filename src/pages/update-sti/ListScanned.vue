<template>
  <q-dialog v-model="promptRemoveStt" persistent>
    <q-card style="min-width: 350px;">
      <q-card-section>
        <div class="text-h6">Hapus STT</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Yakin ingin menghapus STT {{ inputSttModelValue }} ?
      </q-card-section>

      <q-card-actions align="right" class="text-primary q-pa-md">
        <q-btn flat label="Batal" no-caps class="q-mr-md" v-close-popup />
        <q-btn color="primary" label="Hapus" no-caps @click="onRemoveStt" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <div class="q-mt-lg">
    <q-table
      table-header-class="bg-grey-4"
      :dense="$q.screen.lt.md"
      flat
      hide-pagination
      virtual-scroll
      :rows-per-page-options="[0]"
      title="List STT"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn color="primary" icon="delete" flat :dense="$q.screen.lt.md" @click="openPopupRemoveStt(props.row.sttNumber)" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref
} from 'vue'
import { useStiStore } from 'stores/sti-store'

const columns = [
  {
    name: 'sttNumber',
    required: true,
    label: 'No. STT',
    align: 'left',
    sortable: false,
    field: 'sttNumber'
  },
  {
    name: 'product',
    required: true,
    label: 'Product',
    align: 'left',
    sortable: false,
    field: 'product'
  },
  {
    name: 'totalPieces',
    required: true,
    label: 'TK',
    align: 'left',
    sortable: false,
    field: 'totalPieces'
  },
  {
    name: 'grossWeight',
    required: true,
    label: 'GW',
    align: 'left',
    sortable: false,
    field: 'grossWeight'
  },
  {
    name: 'region',
    required: true,
    label: 'Wilayah',
    align: 'left',
    sortable: false,
    field: 'region'
  },
  {
    name: 'action',
    label: 'Action',
    align: 'center',
    field: 'action'
  }
]
export default defineComponent({
  name: 'ListScanned',
  components: { },
  setup () {
    const stiStore = useStiStore()
    const rows = computed(() => {
      return stiStore.listShipmentReadyToSti.map((stt:any) => {
        return {
          sttNumber: stt.stt_no,
          product: stt.stt_product_type,
          totalPieces: stt.stt_total_piece,
          grossWeight: stt.stt_gross_weight,
          region: stt.stt_origin_region_name
        }
      })
    })
    const promptRemoveStt = ref(false)
    const inputSttModelValue = ref('')
    function onRemoveStt () {
      stiStore.removeShipmentFromList(inputSttModelValue.value)
    }
    function openPopupRemoveStt (value: string) {
      inputSttModelValue.value = value
      promptRemoveStt.value = true
    }
    return {
      rows,
      columns,
      stiStore,
      openPopupRemoveStt,
      promptRemoveStt,
      onRemoveStt,
      inputSttModelValue
    }
  }
})
</script>
