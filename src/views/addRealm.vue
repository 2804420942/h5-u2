<template>
  <div class="addRealm">
    <el-row :gutter="10">
      <div v-for="(o, idx) in form.list" :key="idx">
        <el-form :model="o" label-width="100px">
          <el-space :direction="isMobileTerminal ? 'vertical' : 'horizontal'">
            <el-col :span="8" :xs="24" style="width: 375px">
              <el-form-item label="服务器大区" required>
                <el-select
                  v-model="o.areaName"
                  style="width: 275px"
                  placeholder="选择服务器大区"
                >
                  <el-option disabled value="NA" label="NA">NA</el-option>
                  <el-option value="EU" label="EU">EU</el-option>
                  <el-option value="Asia" label="Asia">Asia</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="24" class="tags" style="width: 375px">
              <el-form-item label="bigRealmId" required>
                <el-select
                v-model="o.bigRealmId"
                  style="width: 265px"
                  placeholder="选择bigRealmId"
                >
                  <el-option v-for="item in idList[idx]" :key="item" :value="item" :label="item" :disabled="optionDisabled(item)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="24" style="width: 375px">
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
            <el-col :span="8" :xs="24" style="width: 375px">
              <el-form-item label="对外时间" required>
                <el-date-picker
                  style="width: 275px"
                  v-model="o.visibleTime"
                  type="date"
                  :disabled-date="(time) => disabledOpenDate(time, idx)"
                  placeholder="请选择对外时间"
                />
              </el-form-item>
            </el-col>
          </el-space>
        </el-form>
        <el-divider />
      </div>
      <el-col :span="8" :xs="24">
        <el-button style="width: 375px" type="primary" @click="addServer" plain>添加服务器</el-button>
      </el-col>
      <el-col :span="8" :xs="24">
        <el-button style="width: 375px" type="danger" @click="delServer" plain>删除服务器</el-button>
      </el-col>
      <el-col :span="8" :xs="24">
        <el-button style="width: 375px" type="primary" @click="submit(form.list)">提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { isMobileTerminal } from "../utils/flexible";
import { ElMessage } from 'element-plus'
import dayjs from "dayjs";
import axios from "../api/request";
const form = reactive({
  list: [{
    areaName: '',
    bigRealmId: '',
    openTime: dayjs().set('hour', 5).set('minute', 0).set('second', 0).toDate(),
    visibleTime: '',
    realmId: ''
  }],
})

const addServer = () => {
  if(form.list.length < 3) {
    form.list.push({
      areaName: '',
      bigRealmId: '',
      openTime: dayjs().set('hour', 5).set('minute', 0).set('second', 0).toDate(),
      visibleTime: '',
      realmId: ''
    })  
  } else {
    ElMessage.warning('服务器最多一次性创建3个！')
  }
}

const delServer = () => {
  if(form.list.length > 1) {
    form.list.pop()
  } else {
    ElMessage.warning('最少新增一个服务器！')
  }
}

const idList = ref([]);

let bigRealmId = 0;
watch(() => form.list, async (list) => {
  list.forEach(async (item, idx) => {
    if(item.areaName) {
      const data = await axios.get("/api/select_bigRealmId", {
        params: {
          areaName: item.areaName,
        },
      });
      bigRealmId = data.bigrealmid;
      idList.value[idx] = [];
      for (let i = 0; i < 3; i++) {
        idList.value[idx][i] = (bigRealmId + i + 1).toString();
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
const submit = async (list) => {
  const flag = validate(list)
  if(flag) return 
  const data = dataFormat(list)
  if(data.some(item => item.openTime && item.openTime < Math.floor(new Date().getTime() / 1000))) {
    ElMessage.warning('存在服务器当前时间大于开服时间！')
    return
  }
  const res = await axios.post(`/api/add_realmInfo?account=${localStorage.getItem('account')}`, {
    realmList: data,
    token: localStorage.getItem('os-token')
  })
  if(res.code === 0) {
    ElMessage.success('创建成功！')
    setTimeout(() => {
      location.reload()
    }, 1000)
  }
  if(res.code === 1) {
    ElMessage.warning('创建失败！')
  }
}
const validate = (list) => (
  list.some(item => 
    Object.entries(item).some(([key, value]) => {
      return required(key, value)
    })
  )
)
const nameMap = {
  'areaName': '服务器大区',
  'bigRealmId': 'bigRealmId',
  'openTime': '开服时间',
  'visibleTime': '对外时间',
  "realmId": 'realmId'
}
const required = (name, value) => {
  if(value != 0 && !value) {
    ElMessage.warning(`${nameMap[name]}不能为空`)
    return true
  }
}
const dataFormat = (list) => {
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
      visibleTime: item.visibleTimeTmp
    }
  })
}
const formatDate = (date, isOpenTime) => {
  return isOpenTime 
    ? dayjs(date).set('hour', 5).set('minute', 0).set('second', 0).unix()
    : dayjs(date).set('hour', 7).set('minute', 30).set('second', 0).unix()
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
}
</style>
