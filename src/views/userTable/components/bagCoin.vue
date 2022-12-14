<template>
  <div class="bagCoin">
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
  if(num > row.nums) {
    ElMessage.warning(`数量不能大于${row.nums}`)
    return
  }
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

function initData() {
  return Object.keys(props.list).map(item => {
    switch(item) {
      case 'Chip':
        return {
          coinID: 1,
          name: '金币',
          nums: props.list.Chip,
        }
      case 'Diamond':
        return {
          coinID: 2,
          name: '钻石',
          nums: props.list.Diamond,
        }
      case 'HeroExp':
        return {
          coinID: 7,
          name: '英雄经验',
          nums: props.list.HeroExp,
        }
      case 'VipExp':
        return {
          coinID: 12,
          name: 'vip经验',
          nums: props.list.VipExp,
        }
      case 'playerArenaMoney':
        return {
          coinID: 4,
          name: '地牢币',
          nums: props.list.playerArenaMoney,
        }
      case 'unionCoin':
        return {
          coinID: 15,
          name: '工会币',
          nums: props.list.unionCoin,
        }
      case 'starCoin':
        return {
          coinID: 14,
          name: '星球币',
          nums: props.list.starCoin,
        }
      case 'heroTalentExp':
        return {
          coinID: 21,
          name: '天赋经验',
          nums: props.list.heroTalentExp,
        }
      case 'treasureExp':
        return {
          coinID: 22,
          name: '宝物经验',
          nums: props.list.treasureExp,
        }
      case 'playerEquipMoney':
        return {
          coinID: 5,
          name: '遣散币',
          nums: props.list.playerEquipMoney,
        }
    }
  })
}
const data = ref(initData())
const columns = ref([
  {
    prop: 'coinID',
    label: '货币ID',
    width: '120'
  },
  {
    prop: 'name',
    label: '名称',
    width: '150'
  },
  {
    prop: 'nums',
    label: '数量',
    width: '150'
  },
  {
    prop: 'operation',
    label: '操作',
    width: '120',
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
.bagCoin{
  height: 100%;
  ::v-deep .el-dialog{
    overflow-y: auto;
    max-height: calc(100% - 200px);
    &::-webkit-scrollbar {
      width: 10px;
      background-color: #d9d9d9;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background-color: #b9b9b9;
    }

  }
}
</style>
