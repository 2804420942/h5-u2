<template>
  <div class="hero">
    <Modal title="英雄列表" :showModal="showModal" @close="closeModal" width="70%">
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
      type: 2,
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
    prop: 'Id',
    label: '英雄ID',
    width: '180'
  },
  {
    prop: 'SerialNum',
    label: '唯一ID',
    width: '180'
  },
  {
    prop: 'nickname',
    label: '称号',
    width: '180'
  },
  {
    prop: 'Star',
    label: '品质',
    width: '180'
  },
  {
    prop: 'Level',
    label: '等级',
    width: '180'
  },
  {
    prop: 'SuperEvolve',
    label: '是否超进化',
    width: '180'
  },
  {
    prop: 'SuperEvolveLevel',
    label: '超进化等级',
    width: '180'
  },
  {
    prop: 'TempWeaponLevel',
    label: '专武等级',
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
.hero{
  
}
</style>
