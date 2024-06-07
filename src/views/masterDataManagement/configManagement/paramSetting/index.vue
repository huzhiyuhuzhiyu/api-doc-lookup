<!--
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-06-06 16:49:57
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-06-07 11:04:37
 * @FilePath: \os-web-zgt4.0\src\views\configManagement\paramSetting\index.vue
 * @Description: 参数设置页面
-->
<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-scrollbar class="JNPF-common-setting">
        <el-tabs v-model="activeName" tab-position="left" type="border-card">
          <!-- 普通属性 -->
          <el-tab-pane v-for="item in tabs" :key="item.tabCode" :label="item.tabName" :name="item.tabCode">
            <Super-col v-model="dataForm" :tabContent="item.tabContent" ref="dataForm" />
          </el-tab-pane>
        </el-tabs>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import tabs from './params'
export default {
  name: 'ParamSetting',
  data() {
    return {
      activeName: 'codeSet',
      tabs: tabs(),
      dataForm: {},
      formLoading: false,
    }
  },
  watch: {
    activeName() {
      this.initData()
    }
  },
  created() {
    this.tabs.forEach(tab=>{
      tab.tabContent.forEach(tc=>{
        tc.row.forEach(row=>{
          this.dataForm[row.prop] = row.value || ""; // 设置默认value
          if (row.type == "custom") {
            if (row.prop === 'code'){
              if (row.tabContent){
                row.tabContent.forEach(child=>{
                  row.value[child.prop] = child.value || ''
                  
                })
              }
            }
          }
        })
      })
    })
  },
  methods: {
    initData() {

    },
  },

}
</script>

<style lang="scss" scoped>
.JNPF-common-setting {
  flex: 1;
  height: 100%;

  .el-scrollbar__wrap {
    height: 100%;

  }

}

::v-deep .el-scrollbar__view {
  height: 100%;

  .el-tabs {
    height: 100%;

    .el-tabs__item {
      height: 60px;
      line-height: 60px;
    }
  }
}
</style>