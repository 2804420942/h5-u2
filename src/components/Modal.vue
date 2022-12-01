<template>
  <el-dialog
    v-model="showModal"
    :title="title"
    :width="width"
    @close="closeModal"
  >
    <slot />
  </el-dialog>
</template>
<script setup>
import { ref, watch } from "vue"
import {EMITS_CLICK_CLOSE} from '@/utils/constant.js'
const props = defineProps({
  showModal: Boolean,
  title: String,
  width: String
})
const emits = defineEmits([EMITS_CLICK_CLOSE])
const showModal = ref(props.showModal)
watch(() => props.showModal, (val) => {
  showModal.value = val
})
const closeModal = () => {
  showModal.value = false
  emits(EMITS_CLICK_CLOSE)
}
</script>

<style lang="scss" scoped>
</style>
