<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="tag-group JNPF-common-search-box treeBox_bot"
        style="display:flex;align-items:center;padding:5px 0 5px 10px;margin:0px 0 0px 0">
        <el-radio-group v-model="activeName">
          <el-radio-button label="product">产品设置</el-radio-button>
          <el-radio-button label="produce">生产设置</el-radio-button>
          <el-radio-button label="warehouse">仓库设置</el-radio-button>
          <el-radio-button label="attachment">附件开关</el-radio-button>
        </el-radio-group>
      </div>
      <div class="tag-group JNPF-common-search-box treeBox_bot"
        style="height: 100vh;padding:5px 10px 5px 10px;margin:0px 0 0px 0">
        <el-table :data="tableData" stripe style="margin-right: 10px;"
          :header-cell-style="{ background: '#FAFAFA', color: '#606266', 'text-align': 'center' }">
          <el-table-column prop="configKey" label="功能" width="180">
            <template slot-scope="scope">
              {{ $getLabel(configKeyList, scope.row.configKey, 'value', 'label') }}
            </template>
          </el-table-column>

          <el-table-column prop="state" label="操作" :width="stateWidth" :align="stateAlign">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.state" @change="stateChange(scope.row)"></el-checkbox>
              <el-input style="width: 150px;margin-left: 10px;" v-if="
                (scope.row.state && scope.row.configKey == 'work_exceed_report') ||
                (scope.row.state && scope.row.configKey == 'collect_exceed_picking')
              " v-model="scope.row.configValue2" @change="configValue2Change(scope.row)">
                <template slot="append">
                  %
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="说明">
            <template slot-scope="scope">
              {{ $getLabel(descriptionList, scope.row.description, 'value', 'label') }}
            </template>
          </el-table-column>
        </el-table>
      </div>
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
      activeName: 'product',
      dataForm: {},
      productForm: {},
      formLoading: false,
      listQuery: {
        pageSize: 1, // 1是编码 0是财务
        businessCode: '' //attachment——附件   warehouse——仓库
      },
      codeSetData: [],
      tableData: [],
      configKeyList: [
        {
          label: '启用产品型号',
          value: 'enable_model'
        },
        {
          label: '允许生产报工超报',
          value: 'work_exceed_report'
        },
        {
          label: '允许生产超领料',
          value: 'collect_exceed_picking'
        },
        {
          label: '启用自动生成领料单',
          value: 'arrange_auto_picking'
        },
        {
          label: '启用仓库库位',
          value: 'allocation'
        },
        {
          label: '启用成交客户附件',
          value: 'fj_zskh'
        },
        {
          label: '启用我的客户附件',
          value: 'fj_wdkh'
        },
        {
          label: '启用潜在客户附件',
          value: 'fj_qzkh'
        },
        {
          label: '启用公海客户附件',
          value: 'fj_ghkh'
        },
        {
          label: '启用采购供应商附件',
          value: 'fj_cggysgl'
        },
        {
          label: '启用外协供应商附件',
          value: 'fj_wxgysgl'
        }
      ],
      descriptionList: [
        {
          label: '启用产品型号管理后，创建成品产品时，需先创建型号，再创建产品。',
          value: 'enable_model'
        },
        {
          label: '允许超报后，生产报工总数量将大于计划生产数量。',
          value: 'work_exceed_report'
        },
        {
          label: '允许超领料后，生产领料总数量将大于计划用料总数量。',
          value: 'collect_exceed_picking'
        },
        {
          label: '启用后，在编辑任务后，将会自动生成领料单。',
          value: 'arrange_auto_picking'
        },
        {
          label: '开启后，在仓库库位新建、编辑、查看都会显示附件操作。',
          value: 'allocation'
        },
        {
          label: '开启后，在成交客户新建、编辑、查看都会显示附件操作。',
          value: 'fj_zskh'
        },
        {
          label: '开启后，在我的客户新建、编辑、查看都会显示附件操作。',
          value: 'fj_wdkh'
        },
        {
          label: '开启后，在潜在客户新建、编辑、查看都会显示附件操作。',
          value: 'fj_qzkh'
        },
        {
          label: '开启后，在公海客户新建、编辑、查看都会显示附件操作。',
          value: 'fj_ghkh'
        },
        {
          label: '开启后，在采购供应新建、编辑、查看都会显示附件操作。',
          value: 'fj_cggysgl'
        },
        {
          label: '开启后，在外协供应商附件新建、编辑、查看都会显示附件操作。',
          value: 'fj_wxgysgl'
        }
      ]
    }
  },
  watch: {
    activeName() {
      this.initData()
    }
  },
  created() {
    this.initData()
  },
  computed: {
    stateWidth() {
      let width = 60
      let flag = true
      this.tableData.forEach((item) => {
        if (item.configKey == 'work_exceed_report') {
          if (item.state) {
            width = 200
            flag = false
          } else {
            width = 60
            flag = true
          }
        }
        if (flag) {
          if (item.configKey == 'collect_exceed_picking') {
            if (item.state) {
              width = 200
            } else {
              width = 60
            }
          }
        }
      })

      return width
    },
    stateAlign() {
      let align = 'center'
      let flag = true
      this.tableData.forEach((item) => {
        if (item.configKey == 'work_exceed_report') {
          if (item.state) {
            align = 'left'
            flag = false
          } else {
            align = 'center'
            flag = true
          }
        }
        if (flag) {
          if (item.configKey == 'collect_exceed_picking') {
            if (item.state) {
              align = 'left'
            } else {
              align = 'center'
            }
          }
        }
      })
      return align
    }
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
          if (this.activeName == 'product') {
            this.tableData = res.data.product
          } else if (this.activeName == 'produce') {
            this.tableData = res.data.produce
          } else if (this.activeName == 'warehouse') {
            this.tableData = res.data.warehouse
          } else if (this.activeName == 'attachment') {
            this.tableData = res.data.attachment
          }

          this.tableData.forEach((item) => {
            if (item.configValue1 == '1') {
              this.$set(item, 'state', true)
            } else {
              this.$set(item, 'state', false)
            }
            this.$set(item, 'description', item.configKey)
          })

          this.formLoading = false
        })
        .catch(() => (this.formLoading = false))
    },
    stateChange(data) {
      let _data = []

      if (data.state) {
        data.configValue1 = 1
      } else {
        data.configValue1 = 0
      }
      let query = {
        ...data,
        configKey: data.configKey
      }
      _data.push(query)
      editBimBusinessData(_data).then((res) => {
        if (res.code == '200') {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.formLoading = false
        } else {
          this.formLoading = false
        }
      })
    },
    configValue2Change(data) {
      function isNumber(value) {
        return typeof value === 'number' && !isNaN(value)
      }

      function isInteger(value) {
        return isNumber(value) && Number.isInteger(value)
      }

      if (Number(data.configValue2) > 100 || Number(data.configValue2) < 0) {
        return this.$message.error('请输入0到100的整数')
      }
      if (!isNumber(Number(data.configValue2))) {
        return this.$message.error('请输入正确的数字')
      }
      if (!isInteger(Number(data.configValue2))) {
        return this.$message.error('请输入整数')
      }
      let _data = []

      let query = {
        ...data,
        configKey: data.configKey
      }

      _data.push(query)
      editBimBusinessData(_data).then((res) => {
        if (res.code == '200') {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.formLoading = false
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
