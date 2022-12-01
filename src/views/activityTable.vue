<template>
  <div class="activityTable">
    <el-row style="margin-bottom: 20px">
      <el-col :span="8">
        <el-select v-model="server" style="width: 400px">
          <el-option disabled value="#">
            <el-input placeholder="请输入自定义服务器" v-model="custom" style="width: 270px;margin-right: 10px;"/>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="请输入自定义服务器如：301001-301020,多条用#号分割"
              placement="right"
            >
              ❔
            </el-tooltip>
          </el-option>
          <el-option value="" label="选择全部"></el-option>
          <el-option value="10" label="美服">美服</el-option>
          <el-option value="70-80" label="亚服">亚服</el-option>
          <el-option value="20" label="欧服">欧服</el-option>
          <el-option value="30" label="东南亚服">东南亚服</el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-select v-model="interval" style="width: 400px">
          <el-option :value="7" label="最近一周"></el-option>
          <el-option :value="15" label="最近十五天"></el-option>
          <el-option :value="30" label="最近一个月"></el-option>
          <el-option :value="60" label="最近两个月"></el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-select v-model="types" style="width: 400px" multiple collapse-tags @change="changeTypes">
          <el-option value="-1" label="选择全部"></el-option>
          <el-option value="0-1-2" label="累充累销开服积分活动"></el-option>
          <el-option value="1" label="开服积分"></el-option>
          <el-option value="6" label="UP池"></el-option>
          <el-option value="7" label="心愿池"></el-option>
          <el-option value="12" label="精英挑战赛"></el-option>
          <el-option value="10000" label="宾果翻牌"></el-option>
          <el-option value="120000" label="燃油提纯"></el-option>
          <el-option value="20000" label="单服双倍币"></el-option>
          <el-option value="130000" label="全服双倍币"></el-option>
          <el-option value="30000" label="星球竞技场胜场"></el-option>
          <el-option value="40000" label="7日连充"></el-option>
          <el-option value="140000" label="7日连充2"></el-option>
          <el-option value="50000" label="英雄成长"></el-option>
          <el-option value="80000" label="新翻牌"></el-option>
          <el-option value="100000" label="量子拟态机"></el-option>
          <el-option value="110000" label="战货系统"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-table-v2
        ref="tableV2"
        :columns="array"
        :data="realmList"
        :sort-by="sortState"
        :width="1600"
        :height="700"
        :row-height="30"
        :cache="30"
        fixed
        scrollbar-always-on
        @column-sort="onSort"
      >
        <template #row="props">
          <Row v-bind="props" />
        </template>
      </el-table-v2>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, watch,  cloneVNode, computed, nextTick } from 'vue'
import {format, getArray, getDiffDate, transformBeginTime, range} from "@/utils/utils"
import { TableV2SortOrder } from 'element-plus'
import { ElMessage } from 'element-plus'
import axios from '@/api/request';



  // 表格数据处理
  const realmList = ref([])
  let interval = ref(7)
  
  const allData = ref([])
  let beginTime = ref(transformBeginTime(interval.value))
  const tableV2 = ref(null)

  async function getData(newVal) {
    try {
      let { data = [] } = await axios.get('/api/select_activity', {
        params: {
          beginTime: beginTime.value
        }
      })
      let date = []
      data = data.filter(item => {
        const flag1 = Math.abs(Math.floor(((new Date()).getTime() - (new Date(item.startTime)).getTime()) / (1000 * 60 * 60 *24)))
        const flag2 = Math.abs(Math.floor(((new Date(item.endTime)).getTime() - (new Date()).getTime()) / (1000 * 60 * 60 *24)))
        if(flag1 <= interval.value || flag2 <= interval.value) {
          return true;
        }
      })
      data.forEach((item, idx) => {
        date[idx] = getDiffDate(item.startTime, item.endTime)
      })
      data.forEach((d, idx) => {
        array.value.forEach((a) => {
          if(date[idx].includes(a.key)) {
            d[a.key] = `${d.activityName}(${d.activityId})(${d.activityType})`
          }
        })
      })
      await nextTick()
      flagIdxs = []
      allData.value = data
    } catch(e) {
      ElMessage({
        message: e,
        type: 'warning',
      })
    }
  }
  
  onMounted(async () => {
    await getData()
    server.value = '10'
    realmList.value = allData.value
  })

  watch(interval, async (value) => {
    beginTime.value = transformBeginTime(value)
    await getData()
    setTimeout(() => {
      if(server.value == '') {
        realmList.value = allData.value
      }
      if(server.value == '70-80') {
        realmList.value = allData.value.filter(item => item.realmId.toString().startsWith('70') || item.realmId.toString().startsWith('80'))
      } else {
        realmList.value = allData.value.filter(item => item.realmId.toString().startsWith(server.value))
      }
      if(!types.value.includes('-1')) {
        realmList.value = realmList.value.filter(item => {
          return types.value.includes(item.activityType.toString()) || (types.value.includes('0-1-2') && ['0', '1', '2'].includes(item.activityType.toString()))
        })
      }
      
      tableV2.value.scrollTo({ scrollLeft: 0, scrollTop: 0})
    }, 0)
  })

  const array = computed(() => [...allCols.value.slice(0, 1), ...allCols.value.slice(61 - interval.value, 61 + interval.value)])
  
  const columns = [
    {
      title: '服务器',
      key: 'realmName',
      dataKey: 'realmName',
      width: 100
    },
    ...format(getArray(60))
  ];


  const server = ref('')

  watch(server, (value) => {
    if(value == '') {
      realmList.value = allData.value
    }
    else if(value == '70-80') {
      realmList.value = allData.value.filter(item => item.realmId.toString().startsWith('70') || item.realmId.toString().startsWith('80'))
    } else {
      realmList.value = allData.value.filter(item => item.realmId.toString().startsWith(value))
    }
    if(!types.value.includes('-1')) {
      realmList.value = realmList.value.filter(item => {
        return types.value.includes(item.activityType.toString()) || (types.value.includes('0-1-2') && ['0', '1', '2'].includes(item.activityType.toString()))
      })
    }
    flagIdxs = []
    tableV2.value.scrollTo({ scrollLeft: 0, scrollTop: 0})
  })

  const types = ref(['-1'])

  watch(types, (value) => {
    if(server.value == '') {
      realmList.value = allData.value
    }
    else if(server.value == '70-80') {
      realmList.value = allData.value.filter(item => item.realmId.toString().startsWith('70') || item.realmId.toString().startsWith('80'))
    } else {
      realmList.value = allData.value.filter(item => item.realmId.toString().startsWith(server.value))
    }
    if(!value.includes('-1')) {
      realmList.value = realmList.value.filter(item => {
        return value.includes(item.activityType.toString()) || (value.includes('0-1-2') && ['0', '1', '2'].includes(item.activityType.toString()))
      })
    }
    flagIdxs = []
    tableV2.value.scrollTo({ scrollLeft: 0, scrollTop: 0})
  })

  const changeTypes = (value) => {
    if(value.some(item => item !== '-1') && value[value.length - 1] != '-1') {
      types.value = types.value.filter(item => item !== '-1')
    } else {
      types.value = ['-1']
    }
  }

  const custom = ref('')

  const search = () => {
    if(custom.value) {
      const arr = custom.value.split('#')
      let temp = []
      arr.forEach(item => {
        temp.push(range(item))
      })
      realmList.value = allData.value.filter(item => temp.some(t => t.includes(item.realmId)))
    } else {
      server.value = ''
    }
  }

  // 表格行列合并

  const rowsCol = ({rowData, columns: cols }) => {
    const dataKeys = Object.keys(rowData)
    let colSpanIndex = 1
    for(let i = 1; i < cols.length - 1; i++) {
      if(cols[i].dataKey === dataKeys[7]) {
        colSpanIndex = i
      }
    }
    const colSpan = dataKeys.slice(7).length
    columns[colSpanIndex].colSpan = () => {
      return colSpan
    }
    columns[colSpanIndex].align = 'center'
    return { colSpan, colSpanIndex }
  };


  const rowSpanIndex = 0
  columns[rowSpanIndex].rowSpan = ({ rowData, rowIndex }) =>{
    let mark = 1;
    const col = 'realmName'
    if(rowIndex > 0 && rowData[col] === realmList.value[rowIndex - 1][col]) {
      return 0;
    }
    
    for(let i = rowIndex + 1; i < realmList.value.length; i++) {
      if(rowData[col] === realmList.value[i][col]) {
        mark++;
      }
    }
    return mark
  }
  columns[rowSpanIndex].fixed = true
  columns[rowSpanIndex].sortable = true
  const sortState = ref({
    key: 'realmName',
    order: TableV2SortOrder.ASC,
  })
  const onSort = (sortBy) => {
    realmList.value = realmList.value.reverse()
    sortState.value = sortBy
  }
  let flagIdxs = []
  const allCols = ref(columns)
  const Row = ({ rowData, rowIndex, cells, columns }) => {
    const { colSpanIndex, colSpan } = rowsCol({ rowData, rowIndex, cells, columns })
    const rowSpan = columns[rowSpanIndex].rowSpan({ rowData, rowIndex })
    let flag = false
    
    for(let j = rowIndex; j < rowIndex + rowSpan; j++) {
      for (let i = j + 1; i < rowIndex + rowSpan; i++) {
        if(rowData.activityType == realmList.value[i].activityType) {
          let [start1, start2] = [new Date(rowData.startTime), new Date(realmList.value[i].startTime)]
          let [end1, end2] = [new Date(rowData.endTime), new Date(realmList.value[i].endTime)]
          if(!(end1 < start2 || end2 < start1)) {
            flagIdxs.push([j, i])
          }
        }
      }
    }
    
    if (colSpan >= 1 && cells[colSpanIndex] && cells[colSpanIndex].props) {
      let width = Number.parseInt(cells[colSpanIndex].props.style.width)
      for (let i = 1; i < colSpan; i++) {
        width += Number.parseInt(cells[colSpanIndex + i].props.style.width)
        cells[colSpanIndex + i] = null
      }
      
      const style = {
        ...cells[colSpanIndex].props.style,
        width: `${width}px`,
        justifyContent: 'center',
        backgroundColor: 'var(--el-color-primary-light-3)',
      }
      for(let i = 0; i < flagIdxs.length; i++) {
        if(flagIdxs[i].includes(rowIndex)) style.backgroundColor = 'var(--el-color-danger)'
      }
      cells[colSpanIndex] = cloneVNode(cells[colSpanIndex], { style })
    }
    
    
    if (rowSpan >= 1) {
      const cell = cells[rowSpanIndex]
      const style = {
        ...cell.props.style,
        backgroundColor: 'var(--el-color-primary-light-8)',
        height: `${rowSpan * 30}px`,
        alignSelf: 'flex-start',
        border: '1px solid var(--el-text-color-placeholder)',
        zIndex: 1,
      }
      for (let i = 1; i < rowSpan; i++) {
        if(rowData.activityType == realmList.value[rowIndex + i].activityType) {
          let [start1, start2] = [new Date(rowData.startTime), new Date(realmList.value[rowIndex + i].startTime)]
          let [end1, end2] = [new Date(rowData.endTime), new Date(realmList.value[rowIndex + 1].endTime)]
          if(!(end1 < start2 || end2 < start1)) {
            flag = true
          }
        }
      }
      if(flag) style.backgroundColor = 'var(--el-color-danger)'
      
      cells[rowSpanIndex] = cloneVNode(cell, { style })
    }
    return cells
  }
  
</script>

<style lang="scss" scoped>
.activityTable {
  width: 1800px;
  .el-select{
    ::v-deep .el-tag{
      margin-bottom: 23px;
    }
  }
}

</style>
