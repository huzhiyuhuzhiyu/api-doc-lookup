<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="tag-group JNPF-common-search-box treeBox_bot"
        style="display:flex;align-items:center;padding:5px 0 5px 10px;margin:0px 0 0px 0">
        <el-radio-group v-model="activeName" style="background-color:#fff;">

          <el-badge :value="item.todoNum" :max="99" v-for="(item, index) in treeData" :key="index">
            <el-radio-button style="margin:2px 0;" :key="item.businessType" :label="item.businessType">{{ item.fullName
              }}</el-radio-button>
          </el-badge>
        </el-radio-group>
      </div>
      <el-table :data="tableData" stripe style="width: 100%"
        :header-cell-style="{ background: '#FAFAFA', color: '#606266', 'text-align': 'center' }">
        <el-table-column prop="configKey" label="功能" width="180">
          <template slot-scope="scope">
            {{ $getLabel(configKeyList, scope.row.configKey, 'value', 'label') }}
          </template>
        </el-table-column>

        <el-table-column prop="state" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.state" @change="stateChange(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="configValue2" label="比例">
          <template slot-scope="scope">
            <el-input style="width: 150px;"
              v-if="scope.row.state && scope.row.configKey == 'work_exceed_report' || scope.row.state && scope.row.configKey == 'collect_exceed_picking'"
              v-model="scope.row.configValue2" @change="configValue2Change(scope.row)">
              <template slot="append">%</template>
            </el-input>
          </template>
        </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getBimBusinessSwitchConfigList, editBimBusinessData } from '@/api/basicData/index'
import { getLabel } from '@/utils/index'
Vue.prototype.$getLabel = getLabel
export default {
  name: 'ParamSetting',
  data() {
    return {
      activeName: 'warehouse',
      dataForm: {},
      productForm: {},
      formLoading: false,
      listQuery: {
        pageSize: 1, // 1是编码 0是财务
        businessCode: '' //attachment——附件   warehouse——仓库
      },
      codeSetData: [],
      treeData: [
        { businessType: 'product', fullName: '产品设置' },
        { businessType: 'produce', fullName: '生产设置' },
        { businessType: 'warehouse', fullName: '仓库设置' },
        { businessType: 'attachment', fullName: '附件开关' },
      ],
      tableData: [],
      configKeyList: [
        {
          label: '启用产品型号', value: 'enable_model'
        },
        {
          label: '允许生产报工超报', value: 'work_exceed_report'
        },
        {
          label: '允许生产超领料', value: 'collect_exceed_picking'
        },
        {
          label: '启用自动生成领料单', value: 'arrange_auto_picking'
        },
        {
          label: '启用仓库库位', value: 'allocation'
        },
        {
          label: '启用成交客户附件', value: 'fj_zskh'
        },
        {
          label: '启用我的客户附件', value: 'fj_wdkh'
        },
        {
          label: '启用潜在客户附件', value: 'fj_qzkh'
        },
        {
          label: '启用公海客户附件', value: 'fj_ghkh'
        },
        {
          label: '启用采购供应商附件', value: 'fj_cggysgl'
        },
        {
          label: '启用外协供应商附件', value: 'fj_wxgysgl'
        },
      ]
    }
  },
  watch: {
    activeName() {
      this.initData()
    },

  },
  created() {
    this.initData()

  },
  methods: {
    initData() {
      if (this.activeName === 'product') {
        this.listQuery.pageSize = -1
        this.listQuery.businessCode = 'product'
        this.getData(0)
      } else if (this.activeName === 'produce') {
        this.listQuery.pageSize = -1
        this.listQuery.businessCode = 'produce'
        this.getData(1)
      } else if (this.activeName === 'warehouse') {
        this.listQuery.pageSize = -1
        this.listQuery.businessCode = 'warehouse'
        this.getData(2)
      }
      // else if (this.activeName === 'financialSet') {
      //   this.listQuery.codeFlag = 0
      //   this.listQuery.annexFlag = 0
      //   this.getData(1)
      // }
      else if (this.activeName === 'attachment') {
        this.listQuery.pageSize = -1
        this.listQuery.businessCode = 'attachment'
        this.getData(3)
      }
      // else if (this.activeName === 'mrp') {
      //   this.listQuery.pageSize = -1
      //   this.listQuery.businessCode = 'mrp'
      //   this.getData(2)
      // }
    },
    getData(index) {
      this.formLoading = true
      getBimBusinessSwitchConfigList(this.listQuery)
        .then((res) => {
          console.log(res, 'oooo')
          if (this.activeName == 'product') {
            this.tableData = res.data.product
          } else if (this.activeName == 'produce') {
            this.tableData = res.data.produce
          } else if (this.activeName == 'warehouse') {
            this.tableData = res.data.warehouse
          } else if (this.activeName == 'attachment') {
            this.tableData = res.data.attachment
          }

          this.tableData.forEach(item => {
            if (item.configValue1 == '1') {
              // item.state = true
              this.$set(item, 'state', true);
            } else {
              // item.state = false
              this.$set(item, 'state', false);
            }
          })

          this.formLoading = false
        })
        .catch(() => (this.formLoading = false))
    },
    stateChange(data) {
      let _data = []
      console.log(data, 'iii')
      if (data.state) {
        data.configValue1 = 1
      } else {
        data.configValue1 = 0
      }
      let query = {
        ...data,
        configKey: data.configKey,
      }
      _data.push(query)
      editBimBusinessData(_data)
        .then((res) => {
          if (res.code == '200') {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.formLoading = false
            this.initData()
          } else {
            this.formLoading = false
          }
        })
    },
    configValue2Change(data) {
      function isNumber(value) {
        return typeof value === 'number' && !isNaN(value);
      }

      function isInteger(value) {
        return isNumber(value) && Number.isInteger(value);
      }

      if (Number(data.configValue2) > 100 || Number(data.configValue2) < 0) {
        return this.$message.error('请输入0到100的整数');
      }
      if (!isNumber(Number(data.configValue2))) {
        return this.$message.error('请输入正确的数字');
      }
      if (!isInteger(Number(data.configValue2))) {
        return this.$message.error('请输入整数');
      }
      let _data = []
      console.log(data, 'iii')

      let query = {
        ...data,
        configKey: data.configKey,
      }
      console.log(query, 'ii')
      _data.push(query)
      editBimBusinessData(_data)
        .then((res) => {
          if (res.code == '200') {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.formLoading = false
            this.initData()
          } else {
            this.formLoading = false
          }
        })
    }
  }
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
