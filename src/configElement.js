import { 
  ElInput, ElTableV2, ElSelect, ElOption, ElButton, ElForm, ElFormItem, ElTable, ElRow,ElCol, ElDivider,
  ElDatePicker, ElSpace, ElTooltip, ElDialog, ElTableColumn, ElPopover, ElInputNumber, ElPagination, ElConfigProvider,
  ElCard, ElScrollbar
} from 'element-plus' 

const components = [
  ElInput, ElTableV2, ElSelect, ElOption, ElButton, ElForm, ElFormItem, ElTable, ElRow,ElCol, ElDivider,
  ElDatePicker, ElSpace, ElTooltip, ElDialog, ElTableColumn, ElPopover, ElInputNumber, ElPagination, ElConfigProvider,
  ElCard, ElScrollbar
]

const install = (app) => {
  components.forEach(component => {
    app.component(component.name, component)
  })
}

export default {
  install
}