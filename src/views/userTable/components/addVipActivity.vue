<template>
  <div class="bagItems">
    <Modal title="新增VIP邀请活动" :showModal="showModal" @close="closeModal" width="50%">
      <template #default>
        <el-form :inline="true" :model="form" label-width="120px">
          <el-form-item label="用户ID" required>
            <el-input placeholder="请输入用户ID" v-model="form.uidList" style="width: 200px" :disabled="disabled" />
            <input @change="readText" ref="files" type="file" style="display: none;"/>
            <el-button @click="selectFile">选择文件</el-button>
          </el-form-item>
          <el-form-item label="VIP活动ID" required>
            <el-input placeholder="请输入VIP活动ID" v-model="form.opId" style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">提交</el-button>
          </el-form-item>
        </el-form>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { watch } from "vue"
import { reactive, ref } from "@vue/reactivity"
import { EMITS_CLICK_CLOSE } from '@/utils/constant'
import axios from "@/api/request"
import { ElMessage } from 'element-plus'
import Modal from '@/components/Modal.vue'

const form = reactive({
  uidList: '',
  opId: ''
})
const disabled = ref(false)
const props = defineProps({
  showModal: Boolean,
})
watch(() => props.showModal, (val) => {
  showModal.value = val
})
const emits = defineEmits([EMITS_CLICK_CLOSE])
const showModal = ref(props.showModal)
const closeModal = () => {
  showModal.value = false
  emits(EMITS_CLICK_CLOSE)
}
const submit = async () => {
  if(!form.uidList || !form.opId) {
    ElMessage.warning('不能为空')
  }
  const res = await axios.get('/api/playerop', {
    params: {
      uidList: form.uidList,
      type: 5,
      opUser: localStorage.getItem('account') || '',
      opId: form.opId,
      opType: 2,
      paramStr: JSON.stringify({opId: form.opId}),
    }
  })
  if(res.ret == 3) {
    ElMessage.success(res.msg)
  } else {
    ElMessage.warning(res.msg)
  }
}
let uidText
const selectFile = () => {
  files.value.click()
}
const files = ref(null)
const readText = () => {
  let file = files.value.files[0]
  if(file) {
    var index= file.name.lastIndexOf(".");//获取最后一个.的位置
    var ext = file.name.substr(index+1);//获取后缀
    var pattern = /^(txt|csv)$/;
    if(!pattern.test(ext)) {
      ElMessage.error("文件格式不支持");
      return false;
    }
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      //统一格式 |
      if(ext === 'txt') {
        uidText = reader.result.replace(/\r\n/gm, "|");
      } else {
        uidText = reader.result.match(/\d{6}/g).join('|')
      }
      if(uidText.split('|').length > 400) {
        ElMessage.error("用户ID长度不能超过400");
        return false;
      }
      ElMessage.success("检测到" + uidText.split('|').length + "条UID");

      form.uidList = uidText
      disabled.value = true
    }
  }
}

</script>

<style lang="scss" scoped>
.bagItems{
  
}
</style>
