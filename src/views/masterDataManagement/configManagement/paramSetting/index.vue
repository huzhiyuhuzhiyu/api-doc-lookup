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
      <div class="JNPF-common-layout-center JNPF-flex-main" style="background-color: #FFFFFF;margin-top: 5px">
        <div style="margin: 10px -6px 0 10px;overflow: scroll;">
          <el-table
              v-if="tableRerender"
              :span-method="activeName === 'attachment' ? arraySpanMethod : undefined"
              :height="maxHeight" :data="tableData" stripe :row-style="{ height: '50px' }"
            :header-cell-style="{ background: '#FAFAFA', color: '#606266', 'text-align': 'center' }">
              <el-table-column  v-if="activeName === 'attachment'" prop="mainModule" label="所属模块" width="110"/>




              <el-table-column prop="configKeyLabel" label="功能" width="230">
                  <template v-slot:default="{row}">
                      <div>{{row.configKeyLabel}}</div>
                  </template>
              </el-table-column>
              <el-table-column prop="state" label="操作" :width="stateWidth" :align="stateAlign">
                  <template slot-scope="scope">
                      <div v-if="scope.row.businessCode === 'warehouse'">
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
                          <el-checkbox v-model="scope.row.state" @change="stateChange(scope.row)" ></el-checkbox>
                          <el-input style="width: 150px;margin-left: 10px;" v-if="
                    (scope.row.state && scope.row.configKey == 'work_exceed_report') ||
                    (scope.row.state && scope.row.configKey == 'collect_exceed_picking')
                  " v-model="scope.row.configValue2" @change="configValue2Change(scope.row)">
                              <template slot="append">
                                  %
                              </template>
                          </el-input>
                      </div>
                  </template>
              </el-table-column>
              <el-table-column   class-name="pointer" prop="configValue3" label="文件分类" width="150" v-if="activeName === 'attachment'">
                  <template v-slot:default="{row}" >
                      <div @click="fileCategoryClick(row)" style="width: 100%">
                          <ComSelect2
                              v-if="row.editFlag"
                              :currOrgId="row.configValue2"
                              v-model="row.configValue2"
                              :ref="row.configKey"
                              placeholder="请选择所属分类" auth
                              :closeHandler="()=>closeHandler(row)"
                              @change="(...args)=>onOrganizeChange(...args,row)" :selectClassifyType="FileCategoryType.SYSTEM_ATTACHMENT"/>
                          <div v-else>
                              <div style="width: 100%" v-if="row.configValue3">{{row.configValue3}}</div>
                              <div style="width: 100%;visibility: hidden" v-else>1</div></div>
                      </div>
                  </template>
              </el-table-column>
            <el-table-column prop="description" label="说明"/>
          </el-table>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { getBimBusinessSwitchConfigList, editBimBusinessData } from '@/api/basicData/index'
import {getLabel, isEmpty, notEmpty} from '@/utils/index'
import {FileCategoryType} from "@/views/esop/fileCategoryManagement/constants";
import ConfigKey from "@/views/masterDataManagement/configManagement/paramSetting/ConfigKey";
Vue.prototype.$getLabel = getLabel
export default {
  name: 'ParamSetting',
  data() {
    return {
      tableRerender:false,
      maxHeight: null,
      activeName: 'product',
      dataForm: {},
      productForm: {},
      configKeyObj:Object.freeze(ConfigKey),
      formLoading: false,
      listQuery: {
        pageSize: 1, // 1是编码 0是财务
        businessCode: '' //attachment——附件   warehouse——仓库
      },
      codeSetData: [],
      tableData: [],
      currentData:null,
      currentChooseCategory:'',
      reverseFn:null,
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
      FileCategoryType() {
          return FileCategoryType
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
        if (item.configKey == 'inbound_purchase' || item.configKey == 'inbound_external') {
          width = 290
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
    }
  },
  methods: {
      arraySpanMethod({ row, column, rowIndex, columnIndex }){
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
     async fileCategoryClick(row){
         row.editFlag =true
         await this.$nextTick()
         this.$refs[row.configKey].openDialog()
      },
      closeHandler(row){
          row.editFlag = false
      },
    onOrganizeChange(id,[category],row){
        if(isEmpty(id)){
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
        this.tableRerender = false
      getBimBusinessSwitchConfigList(this.listQuery)
        .then((res) => {
          if (this.activeName == 'product') {
            this.tableData = res.data.product
          } else if (this.activeName == 'produce') {
            this.tableData = res.data.produce
          } else if (this.activeName == 'warehouse') {
            this.tableData = res.data.warehouse
          } else if (this.activeName == 'attachment') {
            this.tableData = res.data.attachment.filter((item) => item.configKey !== '' || item.configKey == 'fj_qzkh')
          }

          this.tableData.forEach((item) => {
            if (item.configValue1 == '1') {
              this.$set(item, 'state', true)
              this.$set(item, 'radio', 1)
            } else {
              this.$set(item, 'state', false)
              this.$set(item, 'radio', 0)
            }
            if (item.configKey == 'inbound_purchase' || item.configKey == 'inbound_external') {
              item.radioOff = '按收货单入库'
              item.radioOn = '按订单入库'
            } else if (item.configKey == 'outbound_sale_send') {
              item.radioOff = '按通知单入库'
              item.radioOn = '按订单入库'
            }
              const configKeyObj = ConfigKey[item.configKey]
              if(notEmpty(configKeyObj)){
                  this.$set(item, 'description', configKeyObj.description)
                  this.$set(item, 'configKeyLabel',configKeyObj.configKeyLabel)
                  this.activeName === 'attachment' &&  this.$set(item, 'mainModule',configKeyObj.mainModule)
              }else{
                  this.$set(item, 'configKeyLabel',item.configKey)
              }

            this.$set(item, 'editFlag', false)
          })

          this.formLoading = false
        })
        .catch(() => (this.formLoading = false)).finally(() => {
          this.tableRerender = true
        })
    },
    stateChangeFn(data){
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
        if(this.activeName === 'attachment' && data.state){
            if(isEmpty(data.configValue2)){
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
