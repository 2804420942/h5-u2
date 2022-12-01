<template>
  <div class="hero">
    <el-form :inline="true" :model="form" label-width="120px">
      <el-form-item label="操作类型">
        <el-select v-model="form.type" placeholder="请选择操作类型">
          <el-option
            label="删除"
            :value="1"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作人员账号">
        <el-input placeholder="请输入操作人员账号" v-model="form.opUser" style="width: 200px"/>
      </el-form-item>
      <el-form-item label="操作物品ID">
        <el-input placeholder="请输入操作物品ID" v-model="form.opId" style="width: 200px"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <Table :data="data" :columns="columns" page :total="total" @change-page="changePage" />
  </div>
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity"
import Table from "../components/Table.vue"
import cols from "@/utils/cols";
import { onMounted } from "vue";
import axios from "@/api/request";

const OPTYPE = {
  1: '删除'
}
const TYPE = {
  1: '货币',
  2: '英雄',
  3: '背包道具',
  4: '背包装备',
  5: 'vip活动'
}
const total = ref(0)
const form = reactive({
  type: 1,
  opUser: '',
  opId: ''
})
const search = () => {
  getData()
}

onMounted(async () => {
  await getData()
})
const getData = async (pageIndex = 1 ) => {
  const { data: tbData, count  } = await axios.get('/api/select_playerop', {
    params: {
      pageSize: 10,
      pageIndex,
      type: form.type,
      opUser: form.opUser,
      opId: form.opId,
    }
  })
  total.value = count
  data.value = tbData.map(item => {
    item.operationContent = OPTYPE[item.opType] + '【' + TYPE[item.type] + '】'
    return item
  })
}

const changePage = (val) => {
  getData(val)
}
const data = ref([])
const columns = ref([
  {
    type: 'expand',
    cols: cols,
  },
  {
    prop: 'opUser',
    label: '操作用户',
  },
  {
    prop: 'uid',
    label: 'UID',
  },
  {
    prop: 'createTime',
    label: '操作时间',
  },
  {
    prop: 'operationContent',
    label: '操作内容',
  },
])

</script>

<style lang="scss" scoped>
.hero{
  width: 1800px;
}
</style>
