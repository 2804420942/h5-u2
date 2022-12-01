<template>
  <div class="bagEquip">
    <Modal title="背包装备" :showModal="showModal" @close="closeModal" width="65%">
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
  data.value = Object.values(props.list)
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
      type: 4,
      opUser: localStorage.getItem('account') || '',
      opId: row.DescId,
      opType: 1,
      opNum: num,
      uniqueId: row.SerialNum,
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
const data = ref(Object.values(props.list))
const columns = ref([
  {
    prop: 'DescId',
    label: '背包装备ID',
    width: '180'
  },
  {
    prop: 'SerialNum',
    label: '唯一ID',
    width: '180'
  },
  {
    prop: 'name',
    label: '名称',
    width: '180'
  },
  {
    prop: 'State',
    label: '品质',
    width: '180'
  },
  {
    prop: 'Level',
    label: '强化等级',
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
.bagEquip{
  
}
</style>
