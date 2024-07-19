<!--
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-06-06 16:49:57
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-06-14 10:51:26
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
            <Super-col v-model="dataForm" :tabContent="item.tabContent" ref="dataForm" v-loading="formLoading" />
          </el-tab-pane>
        </el-tabs>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { getBimBusinessSwitchConfigList, editBimBusinessData } from '@/api/basicData/index'
import tabs from './params'
export default {
  name: 'ParamSetting',
  data() {
    return {
      activeName: 'warehouse',
      tabs: tabs(),
      dataForm: {},
      productForm: {},
      formLoading: false,
      listQuery: {
        pageSize: 1,    // 1是编码 0是财务
        businessCode: "",//attachment——附件   warehouse——仓库   
      },
      codeSetData: [],
    }
  },
  watch: {
    activeName() {
      this.initData()
    }
  },
  created() {
    this.initData()
    this.tabs.forEach(tab => {
      tab.tabContent.forEach(tc => {
        tc.row.forEach(row => {
          this.dataForm[row.prop] = row.value || ""; // 设置默认value
        })
      })
    })
  },
  methods: {
    initData() {
      if (this.activeName === 'warehouse') {
        this.listQuery.pageSize = -1
        this.listQuery.businessCode = 'warehouse'
        this.getData(0)
      }
      // else if (this.activeName === 'financialSet') {
      //   this.listQuery.codeFlag = 0
      //   this.listQuery.annexFlag = 0
      //   this.getData(1)
      // }
      else if (this.activeName === 'attachment') {
        this.listQuery.pageSize = -1
        this.listQuery.businessCode = 'attachment'
        this.getData(1)
      }
    },
    getData(index) {
      this.formLoading = true
      getBimBusinessSwitchConfigList(this.listQuery).then(res => {
        this.formLoading = false
        let data = Object.keys(res.data).map((key) => {
          return { row: res.data[key] }
        });
        // 将接口中的value值赋值给tab
        this.tabs[index].tabContent = this.tabs[index].tabContent.map(tab => {
          tab.row.forEach(item => {
            data.forEach(row => {
              row.row.forEach(dataItem => {
                  if (item.prop === dataItem.configKey) {
                  item.value = dataItem.configValue1;
                  item.businessCode = dataItem.businessCode;
                  item.id = dataItem.id
                  item.change = this.switchChange
                }
              })
            })
          })
          return tab
        });
        this.tabs[index].tabContent.forEach(tc => {
          tc.row.forEach((row, index) => {
            this.dataForm[row.prop] = row.value || ""; // 设置默认value
          })
        })
      }).catch(() => this.formLoading = false);
    },
    switchChange(e, item) {

      // return
      let _data = []
      let query = {
        ...item,
        configKey:item.prop,
        configValue1: e, 
      }
      _data.push(query)
      this.formLoading = true
      editBimBusinessData(_data).then(res => {
        if (res.msg === 'success') {
          this.formLoading = false
          this.initData()
        } else {
          this.formLoading = false
        }
      }).catch(() => this.formLoading = false)
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