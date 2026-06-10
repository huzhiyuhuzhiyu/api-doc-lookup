<template>
  <el-dropdown hide-on-click>
    <span class="el-dropdown-link">
      <el-button type="text" size="mini">
        {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
    </span>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item in menuList"
        :key="item.type"
        :disabled="isItemDisabled(item)"
        @click.native="handleClick(item)"
      >
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'CommonDropdown',
  props: {
    row: {
      type: Object,
      required: true
    },
    // 外部传入菜单配置
    menuList: {
      type: Array,
      required: true
    }
  },
  methods: {
    // 执行外部传入的 disabled 表达式/函数
    isItemDisabled(item) {
      // 1. 如果是字符串表达式 → 用 row 执行
      if (typeof item.disabled === 'string') {
        try {
          // 把 row 作为作用域，执行表达式
          return new Function('row', `return ${item.disabled}`)(this.row)
        } catch (e) {
          return false
        }
      }
      // 2. 如果是函数 → 执行
      if (typeof item.disabled === 'function') {
        return item.disabled(this.row)
      }
      // 3. 布尔值
      return !!item.disabled
    },

    // 向外抛事件
    handleClick(item) {
      this.$emit('menu-click', item.type, this.row)
    }
  }
}
</script>

<style scoped>
.el-dropdown-link { cursor: pointer; }
</style>
