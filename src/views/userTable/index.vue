<template>
  <div class="user">
    <el-form :inline="true" :model="form" label-width="120px">
      <el-form-item label="用户ID">
        <el-input placeholder="请输入用户ID" v-model="form.id" style="width: 200px"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData(form.id)">提交</el-button>
      </el-form-item>
    </el-form>
    <Table :data="data" :columns="columns" />
    
    <el-button type="default" @click="show(heroTable)">英雄列表</el-button>
    <el-button type="primary" @click="show(bagItems)">背包道具</el-button>
    <el-button type="success" @click="show(bagEquip)">背包装备</el-button>
    <el-button type="default" @click="show(bagCoin)">货币</el-button>
    <el-button type="primary" @click="show(addVipActivity)">新增VIP邀请活动</el-button>
    
    <component :is="componentTable" @close="closeModal" :showModal="showModal" :list="comData"></component>
  </div>
</template>

<script setup>
import { reactive, ref, shallowRef } from "@vue/reactivity"
import axios from "@/api/request"
import { transformJSON } from "@/utils/utils"
import bagCoin from "./components/bagCoin.vue";
import bagEquip from "./components/bagEquip.vue";
import bagItems from "./components/bagItems.vue";
import heroTable from "./components/heroTable.vue";
import addVipActivity from "./components/addVipActivity.vue";
import Table from "@/components/Table.vue"
import { ElMessage } from "element-plus";

const showModal = ref(false)
const componentTable = shallowRef(heroTable)
const comData = ref([])
const show = (page) => {
  componentTable.value = page
  switch(page.__name) {
    case 'bagCoin':
      comData.value = bagCoinList.value
      break
    case 'bagEquip':
      comData.value = bagEquipList.value
      break
    case 'bagItems':
      comData.value = bagItemsList.value
      break
    case 'heroTable':
      comData.value = heroList.value
      break
    default: 
      break
  }
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
}

const heroList = ref([])
const bagItemsList = ref([])
const bagEquipList = ref([])
const bagCoinList = ref([])

const getData = async (uid) => {
  if(uid) {
    const list = await axios.get('/api/select_role', {
      params: {
        uid
      }
    })
    if(!list.data) {
      ElMessage.warning(list.msg)
      data.value = []
      bagItemsList.value = []
      heroList.value = []
      bagEquipList.value = []
      bagCoinList.value = []
      return
    }
    localStorage.setItem('uid', uid)
    data.value = [list.data]
    bagItemsList.value = transformJSON(list.Bag)
    heroList.value = transformJSON(list.HerosData.replace(/\}\n\s*\[/g, '},[')
                                                 .replace(/TopPower : {(.*)}/g, 'TopPower : [$1]')          
                                  ).List
    bagEquipList.value = transformJSON(list.EquipmentData.replace(/\}\n\s*\[/g, '},[')
                                                         .replace(/MainPropIndex : {(.*)}/g, 'MainPropIndex : [$1]')).List
    bagCoinList.value = list.Currency
  }
}

const form = reactive({
  id: ''
})
const data = ref([])
const columns = ref([
  {
    prop: 'cpUid',
    label: 'UID',
    width: '200'
  },
  {
    prop: 'server_id',
    label: '服务器',
    width: '200'
  },
  {
    prop: 'role_name',
    label: '昵称',
    width: '200'
  },
])


</script>

<style lang="scss" scoped>
.user{
  width: 600px;
  h4 {
    font-size: 24px;
    margin: 20px;
  }
}
</style>
