<template>
  <div class="table">
    <el-table
      ref="table"
      style="width: 100%"
      :data="props.data"
    >
      <template v-if="props.columns[0].type != 'expand'" #default>
        <el-table-column v-for="col in props.columns" :key="col.prop" :prop="col.prop" :label="col.label" :width="col.width">
          <template #default="scope" v-if="col.prop === 'operation'">
            <el-space v-for="(op, idx) in col.operation" :key="idx">
              <el-popover v-if="op.text === '删除'" :visible="visible[scope.$index]" placement="top" :width="160">
                <p>请输入你想要删除的数量</p>
                <el-input-number placeholder="请输入数量" v-model="num" :min="1" size="small"/>
                <div style="text-align: right; margin: 0">
                  <el-button size="small" text @click="visible[scope.$index] = false">取消</el-button>
                  <el-button size="small" type="primary" @click="op.onClick(scope.row, scope.$index, num);visible[scope.$index] = false"
                    >确认</el-button
                  >
                </div>
                <template #reference>
                  <el-button size="small" :type="op.type" @click="num = 1;visible[scope.$index] = true"
                    >{{ op.text }}</el-button>
                </template>
              </el-popover>
            </el-space>
          </template>
        </el-table-column>
      </template>
      <template v-else #default>
        <el-table-column type="expand" :width="50">
          <template #default="data">
            <el-table :data="exTable[data.$index]">
              <el-table-column v-for="col in props.columns[0].cols[data?.row?.type - 1]" :key="col.prop" :prop="col.prop" :label="col.label" :width="col.width" />
            </el-table>
          </template>
        </el-table-column>
        <el-table-column v-for="col in props.columns.slice(1)" :key="col.prop" :prop="col.prop" :label="col.label" :width="col.width">
          <template #default="scope" v-if="col.prop === 'operation'">
            <el-space v-for="(op, idx) in col.operation" :key="idx">
              <el-button size="small" @click="op.onClick(scope.row, scope.$index)" :type="op.type"
                >{{ op.text }}</el-button
              >
            </el-space>
          </template>
        </el-table-column>
      </template>
      
    </el-table> 
    <el-pagination 
      v-if="page" 
      layout="prev, pager, next" 
      :total="total || 0" 
      background 
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { ref,defineProps, watch } from "vue"
import { transformJSON } from '@/utils/utils'
const props = defineProps({
  data: {
    type: Array,
    require: true
  },
  columns: {
    type: Array,
    require: true
  },
  page: Boolean,
  total: Number
})
const exTable = ref([])
watch(() => props.data, (list) => {
  if(props.columns[0].type == 'expand') {
    exTable.value = list.map(item => {
      return [JSON.parse(item.paramStr)]
    })
  }
})

const emits = defineEmits(['changePage'])
const table = ref(null)
const visible = ref([])
const num = ref(1)
const handleCurrentChange = (val) => {
  emits('changePage', val)
}
</script>

<style lang="scss" scoped>
.table {
  .input-number {
    margin-bottom: 10px;
  }
  .el-pagination {
    margin-top: 10px;
    justify-content: center;
  }
}
</style>
