<!--
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-06-05 15:44:04
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-10-21 15:20:50
 * @FilePath: \os-web-zgt4.0\src\components\JNPF-topOperation\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="jnpf-opts">
    <!--左侧插槽-->
    <slot name="left" />
    <template v-if="isJudgePer">
      <el-button type="primary" @click="add" :icon="icon"  size="mini" v-has="addPerCode">
        {{ addText === '新建' ? $t(`common.addBtn`) : addText }}
      </el-button>
    </template>
    <template v-else>
      <el-button type="primary" @click="add"  size="mini" :icon="icon">
        {{ addText === '新建' ? $t(`common.addBtn`) : addText }}
      </el-button>
    </template>
    <!-- 默认右侧插槽 -->
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    refreshText: {
      type: String,
      default: '刷新'
    },
    icon:{
      type: String,
      default: 'el-icon-plus'
    },
    addText: {
      type: String,
      default: '新建'
    },
    // 刷新加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 是否展示刷新按钮
    hasRefresh: {
      type: Boolean,
      default: true
    },
    // 新增按钮权限标识
    addPerCode: {
      type: String,
      default: 'btn_add'
    },
    // 是否开启权限判断
    isJudgePer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    refresh() {
      this.$emit('refresh')
    },
    add(e) {
      let target = e.target
      // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
      // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
      if (target.nodeName === 'SPAN' || target.nodeName === 'I') {
        target = e.target.parentNode
      }
     // 让其失去焦点
      target.blur()
      this.$emit('add')
    }
  }
}
</script>
<style lang="scss" scoped>
.jnpf-opts {
  display: inline-block;
}
</style>