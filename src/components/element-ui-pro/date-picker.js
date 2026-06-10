import { DatePicker } from 'element-ui'
import { deepClone } from '@/utils'

export default {
  name: 'date-picker-pro',
  extends: DatePicker,
  created() {
    const _vm = this
    if (!_vm.$slots.sidebar) {
      return
    }
    this.panel = deepClone(this.panel)
    const originalRender = this.panel.render
    this.panel.render = function (h) {
      const Sidebar = _vm.$slots.sidebar[0]

      let modelNode
      const change = (val) => {
        modelNode.componentInstance.$off('input', change)
        this.$forceUpdate()
      }
      this.$nextTick(() => {
        modelNode = Sidebar.tag.includes('ElTooltip') ? Sidebar.componentInstance.$slots.default[0] : Sidebar
        modelNode.componentInstance.$on('input', change)
      })

      this.$slots.sidebar = (
        <div class={'el-picker-panel__sidebar'} style={'z-index: 1000;top: calc(100% - 44px);text-align: center;'}>
          {Sidebar}
        </div>
      )
      return originalRender.call(this, h)
    }
  }
}
