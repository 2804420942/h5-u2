<template>
  <div class="addRealm">
    <el-row :gutter="10">
      <div v-for="(o, idx) in form.list" :key="idx">
        <el-form :model="o" label-width="100px">
          <el-space :direction="isMobileTerminal ? 'vertical' : 'horizontal'">
            <el-col :span="8" :xs="24" style="width: 369px">
              <el-form-item label="服务器大区" required>
                <el-select
                  v-model="o.areaName"
                  style="width: 275px"
                  placeholder="选择服务器大区"
                >
                  <el-option value="NA" label="NA">NA</el-option>
                  <el-option value="EU" label="EU">EU</el-option>
                  <el-option value="Asia" label="Asia">Asia</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-card class="box-card" v-if="(visibleData.length > 0 && mode === 'select')">
              <template #header>
                <div class="card-header" style="display:flex; justify-content: space-between">
                  <el-button type="primary" link @click="toggleIdx(-1)" :disabled="(visibleIdx === 0)">上一个</el-button>
                  <span style="font-size: 20px;vertical-align: middle;"> 可修改服务器 </span>
                  <el-button type="primary" link @click="toggleIdx(1)" :disabled="(visibleIdx === visibleData.length - 1)">下一个</el-button>
                </div>
              </template>
              <div v-for="(o, key) in visibleData[visibleIdx]" :key="key" class="text">
                <div v-if="key == 'openTime' || key == 'visibleTime'">
                  {{ key + ': ' + dayjs.unix(o).format('YYYY-MM-DD HH:mm:ss') }}
                </div>
                <div v-else>
                  {{ key + ': ' + o }}
                </div>
              </div>
              <el-button type="primary" link @click="changeMode('edit')">编辑</el-button>
            </el-card>
            <el-col :span="8" :xs="24" class="tags" style="width: 369px" v-if="mode === 'edit' || mode === 'add'">
              <el-form-item label="bigRealmId" required>
                <el-select
                v-model="o.bigRealmId"
                  style="width: 259px"
                  placeholder="选择bigRealmId"
                >
                  <el-option v-for="item in idList[idx]" :key="item" :value="item" :label="item" :disabled="optionDisabled(item)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="24" style="width: 369px" v-if="mode === 'edit'|| mode === 'add'">
              <el-form-item label="开服时间" required>
                <el-date-picker
                  style="width: 275px"
                  v-model="o.openTime"
                  type="date"
                  :disabled-date="disabledDate"
                  placeholder="请选择开服时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="24" style="width: 369px" v-if="mode === 'edit'|| mode === 'add'">
              <el-form-item label="对外时间" required>
                <el-date-picker
                  style="width: 275px"
                  v-model="o.visibleTime"
                  type="datetime"
                  :disabled-date="(time) => disabledOpenDate(time, idx)"
                  placeholder="请选择对外时间"
                />
              </el-form-item>
            </el-col>
          </el-space>
        </el-form>
      </div>
      <el-col :span="8" :xs="24" v-if="mode === 'add'">
        <el-button style="width: 350px" type="success" @click="changeMode('select')">查看可修改服务器</el-button>
      </el-col>
      <el-col :span="8" :xs="24" v-if="mode !== 'add'">
        <el-button style="width: 350px" type="warning" @click="changeMode('add')">返回新增</el-button>
      </el-col>
      <el-col :span="8" :xs="24" v-if="mode === 'edit'">
        <el-button style="width: 350px" type="danger" @click="addServer(form.list, 'del')" plain>删除服务器</el-button>
      </el-col>
      <el-col :span="8" :xs="24" v-if="mode === 'add' || mode === 'edit'">
        <el-button style="width: 350px" type="primary" @click="addServer(form.list, mode === 'add' ? 'add' : 'edit')" plain>{{mode === 'add' ? '添加服务器' : '修改服务器'}}</el-button>
      </el-col>
      <el-col :span="8" :xs="24" v-if="mode === 'add' || mode === 'edit'">
        <el-button style="width: 350px" type="primary" @click="submit">提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { isMobileTerminal } from "../utils/flexible";
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from "dayjs";
import axios from "../api/request";

const mode = ref('add')
const changeMode = (type) => {
  if(type === 'edit') {
    form.list[0] = {
      areaName: form.list[0].areaName,
      bigRealmId: visibleData.value[visibleIdx.value].bigRealmId.toString(),
      openTime: dayjs.unix(visibleData.value[visibleIdx.value].openTime).toDate(),
      visibleTime: dayjs.unix(visibleData.value[visibleIdx.value].visibleTime).toDate(),
      realmId: visibleData.value[visibleIdx.value].realmId
    }
  }
  if(type === 'add') {
    form.list[0] = {
      areaName: '',
      bigRealmId: '',
      openTime: dayjs().set('hour', 5).set('minute', 0).set('second', 0).toDate(),
      visibleTime: '',
      realmId: ''
    }
    visibleData.value = []
  }
  mode.value = type
}

const form = reactive({
  list: [{
    areaName: '',
    bigRealmId: '',
    openTime: dayjs().set('hour', 5).set('minute', 0).set('second', 0).toDate(),
    visibleTime: '',
    realmId: ''
  }],
})

// const addServer = () => {
//   if(form.list.length < 3) {
//     form.list.push({
//       areaName: '',
//       bigRealmId: '',
//       openTime: dayjs().set('hour', 5).set('minute', 0).set('second', 0).toDate(),
//       visibleTime: '',
//       realmId: ''
//     })  
//   } else {
//     ElMessage.warning('服务器最多一次性创建3个！')
//   }
// }

// const delServer = () => {
//   if(form.list.length > 1) {
//     form.list.pop()
//   } else {
//     ElMessage.warning('最少新增一个服务器！')
//   }
// }

const idList = ref([]);
const visibleData = ref([])
const visibleIdx = ref(0)
const toggleIdx = (num) => {
  visibleIdx.value += num
}

let bigRealmId = 0;
watch(() => form.list, async (list) => {
  list.forEach(async (item, idx) => {
    if(item.areaName) {
      const { data } = await axios.get("/api/select_recentRealm", {
        params: {
          areaName: item.areaName,
        },
      });
      visibleData.value = data
      visibleIdx.value = data.length - 1
      bigRealmId = data[data.length - 1].bigRealmId;
      idList.value[idx] = [];
      for (let i = 0; i < 2; i++) {
        idList.value[idx][i] = (bigRealmId + i).toString();
      }
      if(item.bigRealmId && !idList.value[idx].includes(item.bigRealmId)) {
        item.bigRealmId = ''
      }
    }
  })
}, {
  deep: true
});
const openTime = ref('')


const visibleTime = ref("");
const disabledDate = (time) => {
  return (
    time.getTime() < Date.now() - 24 * 60 * 60 * 1000 ||
    time.getTime() > Date.now() + 2 * 24 * 60 * 60 * 1000
  );
};
const openTimeDisable = computed(() => {
  return form.list.map(item => {
    if (item.openTime) {
      return true;
    } else return false;
  })
});
const disabledOpenDate = (time, idx) => {
  if (!openTimeDisable.value[idx]) return true;
  return (
    time.getTime() <= form.list[idx].openTime.getTime() - 24 * 60 * 60 * 1000 // ||
    // time.getTime() > form.list[idx].openTime.getTime() + 2 * 24 * 60 * 60 * 1000
  );
};

const optionDisabled = (value) => {
  return form.list.some(item => item.bigRealmId == value)
}
const ruleFormRef = ref(null)
const addServer = async (list, type = 'add') => {
  const data = dataFormat(list, type === 'edit' || type === 'del')[0]
  const flag = validate(data)
  if(flag) return 
  if(data.openTime && data.openTime < Math.floor(new Date().getTime() / 1000)) {
    ElMessage.warning('服务器开服时间需大于当前时间！')
    return
  }
  if(data.openTime && data.visibleTime && data.openTime > data.visibleTime) {
    ElMessage.warning('服务器对外时间需大于开服时间！')
    return
  }
  ElMessageBox.confirm(
    '确认要操作服务器吗？',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
  }).then(async () => {
    const res = await axios.post(`/api/add_realmInfo?account=${localStorage.getItem('account')}`, {
      simpleRealm: data,
      type: type,
      token: localStorage.getItem('os-token')
    })
    if(res.ret === 0) {
      ElMessage.success(res.msg)
      setTimeout(() => {
        location.reload()
      }, 1000)
    }
    if(res.ret === 1) {
      ElMessage.warning('操作失败！')
    }
  }).catch(() => {})
  
}
const validate = (list) => (
  Object.entries(list).some(([key, value]) => {
    return required(key, value)
  })
)
const nameMap = {
  'areaName': '服务器大区',
  'bigRealmId': 'bigRealmId',
  'openTime': '开服时间',
  'visibleTime': '对外时间',
  "realmId": 'realmId'
}
const required = (name, value) => {
  if(value !== 0 && name !== 'realmId' && !value) {
    ElMessage.warning(`${nameMap[name]}不能为空`)
    return true
  }
}
const dataFormat = (list, edit) => {
  const data =  list.map(item => {
    item.openTimeTmp = formatDate(item.openTime, true)
    item.visibleTimeTmp = formatDate(item.visibleTime, false)
    return item
  })
  return data.map(item => {
    return {
      areaName: item.areaName,
      bigRealmId: parseInt(item.bigRealmId),
      openTime: item.openTimeTmp,
      visibleTime: item.visibleTimeTmp,
      realmId: edit ? item.realmId : undefined
    }
  })
}
const formatDate = (date, isOpenTime) => {
  return isOpenTime 
    ? dayjs(date).set('hour', 5).set('minute', 0).set('second', 0).unix()
    : dayjs(date).unix()
}

// 提交
const submit = async () => {
  ElMessageBox.confirm(
    '确认要提交吗？',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
  }).then(async () => {
    const res = await axios.get(`/api/commit_realmInfo?account=${localStorage.getItem('account')}`);
    if(res.code === 0) {
      ElMessage.success('提交成功')
    } else {
      ElMessage.warning(res.msg)
    }
  }).catch(() => {})
  
}
</script>

<style lang="scss" scoped>
.addRealm {
  .label {
    font-size: 20px;
  }
  .tags {
    display: flex;
    flex-direction: row;
    .list{
      font-size: 14px;
    }
    & .el-tag {
      margin-right: 5px;
    }
  }
  .box-card{
    ::v-deep .el-card__header{
      width: 330px;
      padding: 10px;
    }
    ::v-deep .el-card__body{
      width: 330px;
      padding: 10px;
    }
    .text{
      font-size: 17px;
    }
  }
}
</style>
