import { Select } from 'element-ui'
import { deepClone } from '@/utils'

const NSelect = deepClone(Select)
export default {
  props: {
    aliveQuery: {
      type: Boolean,
      default: false
    }
  },
  name: 'el-select-pro',
  extends: NSelect,
  watch: {
    ...(() => {
      const result = {}
      // aliveQuery 回显上一次选择的值到输入状态
      if (this.aliveQuery) {
        const visibleFn = NSelect.watch.visible
        delete NSelect.watch.visible
        result.visible = function(...args) {
          let oldSelectedLabel = this.selectedLabel
          visibleFn.apply(this, args)
          if (oldSelectedLabel && args[0]) {
            this.selectedLabel = oldSelectedLabel
            this.handleQueryChange(oldSelectedLabel)
          }
        }
      }
      return result
    })()
  }
}
