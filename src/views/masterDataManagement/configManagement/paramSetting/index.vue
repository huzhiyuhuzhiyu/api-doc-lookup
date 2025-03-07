<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="tag-group JNPF-common-search-box treeBox_bot"
        style="display:flex;align-items:center;padding:5px 0 5px 10px;margin:0px 0 0px 0">
        <el-radio-group v-model="activeName">
          <el-radio-button label="product">产品设置</el-radio-button>
          <el-radio-button label="orderField">产品属性设置</el-radio-button>
          <el-radio-button label="produce">生产设置</el-radio-button>
          <el-radio-button label="price">价格设置</el-radio-button>
          <el-radio-button label="warehouse">仓库设置</el-radio-button>
          <el-radio-button label="return">退货设置</el-radio-button>
          <el-radio-button label="attachment">附件开关</el-radio-button>
          <el-radio-button label="system">项目管理</el-radio-button>
          <el-radio-button label="customersupplier">客户供应商管理</el-radio-button>
          <el-radio-button label="deputyUnit">副单位设置</el-radio-button>
          <el-radio-button label="maintenance">维修设置</el-radio-button>
          <el-radio-button label="departmentalset">人力资源设置</el-radio-button>
          <el-radio-button label="print">打印设置</el-radio-button>
          <el-radio-button label="inspect">质量设置</el-radio-button>
        </el-radio-group>
      </div>
      <div class="JNPF-common-layout-center JNPF-flex-main" style="background-color: #FFFFFF;margin-top: 5px">
        <div style="margin: 10px -6px 0 10px;overflow: scroll;">
          <el-table v-if="tableRerender"
            :span-method="['attachment', 'orderField'].includes(activeName) ? arraySpanMethod : undefined"
            :height="maxHeight" :data="tableData" stripe :row-style="{ height: '50px' }"
            :header-cell-style="{ background: '#FAFAFA', color: '#606266', 'text-align': 'center' }">
            <el-table-column align="left" v-if="activeName === 'attachment'" prop="mainModule" label="所属模块"
              width="135" />
            <el-table-column align="left" v-if="activeName === 'orderField'" prop="mainModule" label="所属模块"
              width="135" />

            <el-table-column prop="configKeyLabel" label="功能" width="230">
              <template v-slot:default="{ row }">
                <div>{{ row.configKeyLabel }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="state" label="操作" :width="stateWidth" :align="stateAlign">
              <template slot-scope="scope">
                <div v-if="['warehouse', 'price'].includes(scope.row.businessCode)">
                  <el-radio-group v-model="scope.row.radio" @input="radioChange(scope.row)">
                    <el-radio :label="0">
                      {{ scope.row.radioOff }}
                    </el-radio>
                    <el-radio :label="1">
                      {{ scope.row.radioOn }}
                    </el-radio>
                  </el-radio-group>
                </div>
                <div v-else>
                  <template v-if="scope.row.configKey == 'auto_material'">
                    <el-radio-group v-model="scope.row.radio" @input="radioChange(scope.row)">
                      <el-radio :label="0" style="margin-bottom: 7px;">
                        {{ scope.row.radioOff }}
                      </el-radio>
                      <el-radio :label="1" style="margin-top: 7px;">
                        {{ scope.row.radioOn }}
                      </el-radio>
                    </el-radio-group>
                  </template>
                  <template v-else>
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
                </div>
              </template>
            </el-table-column>
            <el-table-column class-name="pointer" prop="configValue3" label="文件分类" width="150"
              v-if="activeName === 'attachment'">
              <template v-slot:default="{ row }">
                <div @click="fileCategoryClick(row)" style="width: 100%">
                  <ComSelect2 v-if="row.editFlag" :currOrgId="row.configValue2" v-model="row.configValue2"
                    :ref="row.configKey" placeholder="请选择所属分类" auth :closeHandler="() => closeHandler(row)"
                    @change="(...args) => onOrganizeChange(...args, row)"
                    :selectClassifyType="FileCategoryType.SYSTEM_ATTACHMENT" />
                  <div v-else>
                    <div style="width: 100%" v-if="row.configValue3">
                      <el-link type="primary" :underline="false">{{ row.configValue3 }}</el-link>
                    </div>
                    <div style="width: 100%;visibility: hidden" v-else>1</div>
                  </div>
                </div>
              </template>
              <template v-slot:header>
                <div><i class="el-icon el-icon-edit-outline"></i> 文件分类</div>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="说明" />
          </el-table>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { getBimBusinessSwitchConfigList, editBimBusinessData } from '@/api/basicData/index'
import { getLabel, isEmpty, notEmpty, sleep } from '@/utils/index'
import { FileCategoryType } from "@/views/esop/fileCategoryManagement/constants";
import ConfigKey from "@/views/masterDataManagement/configManagement/paramSetting/ConfigKey";
Vue.prototype.$getLabel = getLabel
import { mapState, mapGetters } from "vuex";
export default {
  name: 'ParamSetting',
  data() {
    return {
      tableRerender: false,
      maxHeight: null,
      activeName: 'product',
      dataForm: {},
      productForm: {},
      configKeyObj: Object.freeze(ConfigKey),
      formLoading: false,
      listQuery: {
        pageSize: 1, // 1是编码 0是财务
        businessCode: '' //attachment——附件   warehouse——仓库
      },
      codeSetData: [],
      tableData: [],
      currentData: null,
      currentChooseCategory: '',
      reverseFn: null,
    }
  },
  watch: {
    activeName() {
      this.initData()
    }
  },
  created() {
    console.log(this.userInfo, 'userInfo')
    this.initData()
  },
  computed: {
    FileCategoryType() {
      return FileCategoryType
    },
    isAttachment() {
      return this.activeName === 'attachment'
    },
    stateWidth() {
      let width = 60
      let flag = true
      this.tableData.forEach((item) => {
        if (item.configKey == 'work_exceed_report' || item.configKey == 'collect_exceed_picking') {
          // if (item.state) {
          //   width = 200
          //   flag = false
          // } else {
          //   width = 60
          //   flag = true
          // }
          width = 200
        }
        if (['inbound_purchase', 'inbound_external'].includes(item.configKey)) {
          width = 290
        }
        if (['packaging'].includes(item.configKey)) {
          width = 340
        }
        // if (flag) {
        //   if (item.configKey == 'collect_exceed_picking') {
        //     // if (item.state) {
        //     //   width = 200
        //     // } else {
        //     //   width = 60
        //     // }
        //     width = 200
        //   }
        // }
      })

      return width
    },
    stateAlign() {
      let align = 'center'
      let flag = true
      this.tableData.forEach((item) => {
        if (item.configKey == 'work_exceed_report') {
          // if (item.state) {
          //   align = 'left'
          //   flag = false
          // } else {
          //   align = 'center'
          //   flag = true
          // }
          align = 'left'
        }
        if (flag) {
          if (item.configKey == 'collect_exceed_picking') {
            // if (item.state) {
            //   align = 'left'
            // } else {
            //   align = 'center'
            // }
            align = 'left'
          }
        }
      })
      return align
    },
    ...mapGetters(['userInfo'])
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      const visibleData = this.tableData
      const fields = ['mainModule']
      const cellValue = row['mainModule']
      if (cellValue && fields.includes(column.property)) {
        const prevRow = visibleData[rowIndex - 1]
        let nextRow = visibleData[rowIndex + 1]
        if (prevRow && prevRow[column.property] === cellValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          let countRowspan = 1
          while (nextRow && nextRow[column.property] === cellValue) {
            nextRow = visibleData[++countRowspan + rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
      }

    },
    async fileCategoryClick(row) {
      row.editFlag = true
      await this.$nextTick()
      this.$refs[row.configKey].openDialog()
    },
    closeHandler(row) {
      row.editFlag = false
    },
    onOrganizeChange(id, [category], row) {
      if (isEmpty(id)) {
        return this.$message.error('没有选中数据')
      }
      row.configValue2 = category.id
      row.configValue3 = category.name
      this.stateChangeFn(row)
    },
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
      } else if (this.activeName === 'return') {
        this.listQuery.pageSize = -1
        this.listQuery.businessCode = 'return'
        this.getData(5)
      } else if (this.activeName === 'system') {
        this.listQuery.pageSize = -1
        this.listQuery.businessCode = 'system'
        this.getData(4)
      } else if (this.activeName === 'customersupplier') {
        this.listQuery.pageSize = -1
        this.listQuery.businessCode = 'customersupplier'
        this.getData(6)
      } else if (this.activeName === 'deputyUnit') {
        this.listQuery.pageSize = -1
        this.listQuery.businessCode = 'deputyUnit'
        this.getData(7)
      } else if (this.activeName === 'maintenance') {
        this.listQuery.pageSize = -1
        this.listQuery.businessCode = 'maintenance'
        this.getData(8)
      } else if (this.activeName === 'orderField') {
        this.listQuery.pageSize = -1
        this.listQuery.businessCode = 'orderField'
        this.getData(9)
      } else if (this.activeName === 'departmentalset') {
        this.listQuery.pageSize = -1
        this.listQuery.businessCode = 'departmentalset'
        this.getData(10)
      } else if (this.activeName === 'price') {
        this.listQuery.pageSize = -1
        this.listQuery.businessCode = 'price'
        this.getData(11)
      } else if (this.activeName === 'print') {
        this.listQuery.pageSize = -1
        this.listQuery.businessCode = 'print'
        this.getData(12)
      } else if (this.activeName === 'inspect') {
        this.listQuery.pageSize = -1
        this.listQuery.businessCode = 'inspect'
        this.getData(13)
      }
      // else if (this.activeName === 'financialSet') {
      //   this.listQuery.codeFlag = 0
      //   this.listQuery.annexFlag = 0
      //   this.getData(1)
      // }
      else if (this.isAttachment) {
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
      this.tableRerender = false
      getBimBusinessSwitchConfigList(this.listQuery)
        .then((res) => {
          let list = []

          if (this.activeName === 'product') {
            list = res.data.product
          } else if (this.activeName === 'produce') {
            list = res.data.produce
          } else if (this.activeName === 'warehouse') {
            list = res.data.warehouse
          } else if (this.isAttachment) {
            list = res.data.attachment.filter((item) => item.configKey !== '' || item.configKey === 'fj_qzkh')
          } else if (this.activeName === 'system') {
            list = res.data.system
          } else if (this.activeName === 'return') {
            list = res.data.return
          } else if (this.activeName === 'customersupplier') {
            list = res.data.customersupplier
          } else if (this.activeName === 'deputyUnit') {
            list = res.data.deputyUnit
          } else if (this.activeName === 'maintenance') {
            list = res.data.maintenance
          } else if (this.activeName === 'departmentalset') {
            list = res.data.departmentalset
          }  else if (this.activeName === 'print') {
            list = res.data.print
          } else if (this.activeName === 'orderField') {
            list = res.data.orderField
            list.forEach(item => {
              item.configKey = `${item.configValue2}_${item.configKey}`
            })
          } else if (this.activeName === 'price') {
            list = res.data.price
          }

          list.forEach((item) => {
            if (item.configValue1 === '1') {
              item.state = true
              item.radio = 1
            } else {
              item.state = false
              item.radio = 0
            }
            if (item.configKey === 'inbound_purchase' || item.configKey === 'inbound_external') {
              item.radioOff = '按收货单入库'
              item.radioOn = '按订单入库'
            } else if (item.configKey === 'outbound_external_send') {
              item.radioOff = '按通知单出库'
              item.radioOn = '按订单出库'
            } else if (item.configKey === 'outbound_sale_send') {
              item.radioOff = '按通知单出库'
              item.radioOn = '按订单出库'
            } else if (['proportion', 'inventorySearcheListFlag'].includes(item.configKey)) {
              item.radioOff = '关闭'
              item.radioOn = '启用'
            } else if (item.configKey === 'auto_material') {
              item.radioOff = '首道自制工序扣减料'
              item.radioOn = '生产产品入库扣减料'
            } else if (item.configKey === 'vibration') {
              console.log(item, 'item')
              item.radioOff = '按加工工序计价'
              item.radioOn = '按工序属性计价'
            } else if (item.configKey === 'packaging') {
              console.log(item, 'item')
              item.radioOff = '按加工工序计价'
              item.radioOn = '按工序属性计价'
            }
            const configKeyObj = ConfigKey[item.configKey]
            console.log(configKeyObj, 'obj')
            console.log(notEmpty(configKeyObj), 'notEmpty(configKeyObj)')
            if (notEmpty(configKeyObj)) {
              item.description = configKeyObj.description
              item.configKeyLabel = configKeyObj.configKeyLabel
              this.isAttachment && (item.mainModule = configKeyObj.mainModule)
              this.activeName === 'orderField' && (item.mainModule = configKeyObj.mainModule)
            } else {
              item.configKeyLabel = item.configKey
              item.mainModule = " 暂无设置"
            }
            item.editFlag = false
          })
          this.isAttachment && list.sort((a, b) => b.mainModule.localeCompare(a.mainModule))
          this.tableData = list
          this.formLoading = false
        })
        .catch((err) => {
          console.error(err)
        }).finally(() => {
          this.formLoading = false
          this.tableRerender = true
        })
    },
    stateChangeFn(data) {
      let _data = []

      if (data.state) {
        data.configValue1 = 1
      } else {
        data.configValue1 = 0
      }

      if (data.businessCode === "orderField") {
        data.configKey = data.configKey.replace(`${data.configValue2}_`, "")
        console.log(`${data.configValue2}_`)
      }
      console.log(data)

      let query = {
        ...data,
        configKey: data.configKey
      }
      _data.push(query)
      return editBimBusinessData(_data).then((res) => {
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
    async stateChange(data) {
      if (this.isAttachment && data.state) {
        if (isEmpty(data.configValue2)) {
          this.$message.error('请先选择文件分类')
          await this.$nextTick()
          data.state = false
          return
        }
      }
      return this.stateChangeFn(data)
    },
    radioChange(data) {
      console.log(data, 'o')


      let _data = []
      if (data.radio) {
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

.multiline {
  width: 100px;
  white-space: pre-wrap;
}
</style>
