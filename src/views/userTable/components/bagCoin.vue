<template>
  <div class="bagItems">
    <Modal title="货币" :showModal="showModal" @close="closeModal" width="50%">
      <template #default>
        <Table :data="data" :columns="columns" />
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { watch } from "vue"
import { ref } from "@vue/reactivity"
import { EMITS_CLICK_CLOSE } from '@/utils/constant'
import axios from "@/api/request"
import { ElMessage } from 'element-plus'
import Table from "@/components/Table.vue"
import Modal from '@/components/Modal.vue'

const props = defineProps({
  showModal: Boolean,
  list: Object
})
watch(() => props.showModal, (val) => {
  showModal.value = val
  data.value = initData()
})
const emits = defineEmits([EMITS_CLICK_CLOSE])
const showModal = ref(props.showModal)
const closeModal = () => {
  showModal.value = false
  emits(EMITS_CLICK_CLOSE)
}
const onDelete = async (row, index, num) => {
  const res = await axios.get('/api/playerop', {
    params: {
      uid: localStorage.getItem('uid') || '',
      uidList: '',
      type: 1,
      opUser: localStorage.getItem('account') || '',
      opId: row.coinID,
      opType: 1,
      opNum: num,
      uniqueId: '',
      paramStr: JSON.stringify({...row, num}),
      paramInt: 0
    }
  })
  if(res.ret == 3) {
    ElMessage.success(res.msg)
  } else {
    ElMessage.warning(res.msg)
  }
}
function filter(item) {
  return item === 'Chip' || item === 'Diamond'
}
function initData() {
  return Object.keys(props.list).filter(item => filter(item)).map(item => {
    if(item === 'Chip') {
      return {
        coinID: props.list.UnionId,
        name: '金币',
        nums: props.list.Chip,
      }
    } else if(item === 'Diamond') {
      return {
        coinID: props.list.UnionId,
        name: '钻石',
        nums: props.list.Diamond,
      }
    }
  })
}
const data = ref(initData())
const columns = ref([
  {
    prop: 'coinID',
    label: '货币ID',
    width: '180'
  },
  {
    prop: 'name',
    label: '名称',
    width: '180'
  },
  {
    prop: 'nums',
    label: '数量',
    width: '180'
  },
  {
    prop: 'operation',
    label: '操作',
    width: '180',
    operation: [
      {
        text: '删除',
        onClick: onDelete,
        type: 'danger'
      }
    ]
  },
])

</script>

<style lang="scss" scoped>
.bagItems{
  
}
</style>
