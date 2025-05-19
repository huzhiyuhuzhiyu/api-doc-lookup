<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="title" />
        <div class="options" v-if="btnType !== 'look'">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm()">
            {{ $t('common.submitButton') }}
          </el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="基础信息" name="basicInfo" class="orderInfo">
            <JNPF-col v-model="dataForm" :tabContent="tabs[0].tabContent" ref="dataForm" :openMode="openMode" />
            <!-- <JNPF-col-table v-if="tableFlag" v-model="stockLimitsAuthorities" ref="sleeveForm" :tableItems="sleeveItems"
              :openMode="openMode" @addth="addSleeveList" @deleteth="deleteth" /> -->
            <JNPF-col-table v-if="!tableFlag" v-model="stockLimitsAuthorities" ref="sleeveForm"
              :tableItems="sleeveItems" :openMode="openMode" />
          </el-collapse-item>
        </el-collapse>
      </div>
      <user-select ref="userselect" v-show="false" :multiple="true" @change="hangleSelectSales"></user-select>
    </div>
  </transition>
</template>

<script>
import {
  addStockGoodsShelves,
  getListTree,
  getList,
  deleteStockGoodsShelves,
  detailProductionResourceData,
  editStockGoodsShelves,
  updateBatchStockGoodsShelves
} from '@/api/basicData/stockGoodsShelves'
import { addWarehouse, editWarehouse, getWarehouseInfo, checWarehouseCode } from '@/api/basicData/index'
import { getWarehouseList } from '@/api/basicData/index'
import tabs from './params'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
export default {
  mixins: [getProjectList],

  data() {
    return {
      datafilelist: [],
      getWarehouseList,
      activeName: 'basicInfo',
      activeNames: ['productInfo', 'basicInfo'],
      tabs: tabs(),
      tempRules: {}, // 动态判断是否必填项
      btnType: false,
      visible: true,
      btnLoading: false,
      formLoading: false,
      title: '',
      autoCode: undefined,
      autoDrawingNo: undefined,
      tempCodeRules: [],
      tempDrawingNoRules: [],
      dataForm: {
        category: 'warehouse',
        warehouseId:"",
        warehouseName:"",
      },
      sleeveItems: [
        {
          prop: 'name',
          label: '库位名称',
          type: 'input',
          itemRules: [
            { required: true, message: '库位名称不能为空', trigger: 'blur' },
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '不能为空',
                  (errMsg, index) => {
                    this.$message.error(`基础信息第${index + 1}，库位名称${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            }
          ]
        },
        {
          prop: 'code',
          label: '库位编码',
          type: 'input',
          itemRules: [
            { required: true, message: '请输入库位编码', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (this.autoCode == value) {
                  callback()
                } else {
                  if (this.dataForm.id) {
                    checWarehouseCode(value, this.dataForm.id)
                      .then((res) => {
                        if (res.data) {
                          callback(new Error('编码重复'))
                          this.$message.error(`编码重复`)
                        } else {
                          callback()
                        }
                      })
                      .catch((error) => { })
                  } else {
                    checWarehouseCode(value, '')
                      .then((res) => {
                        if (res.data) {
                          callback(new Error('编码重复'))
                          this.$message.error(`编码重复`)
                        } else {
                          callback()
                        }
                      })
                      .catch((error) => { })
                  }
                }
              },
              trigger: 'blur'
            }
          ]
        },
        { prop: 'remark', label: '备注', value: '', type: 'input', maxlength: 200 }
      ],
      stockLimitsAuthorities: [],
      requestObj2: {
        name: '',
        code: '',
        noId: '',
        type: '',
        state: 'enable',
        locationStatus: 'enable',
        category: 'warehouse'
      },
      requestObj5: {
        category: 'area',
        pageSize: -1,
        warehouseId: ''
      },
      modelQuery: {
        startTime: '',
        endTime: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        model: ''
      },

      rowColShow: false,
      tableFlag: true,
      tableQuery: {
        warehouseId: ''
      },
      areaOptions: [],
      type: '',
      businessType: '', //  参数设置  自动  还是 手输
      isProjectSwitch: "",

    }
  },

  async created() {
    await this.getProjectSwitch('system', 'project')

    this.tabs.forEach((tab, tabInd) => {
      tab.tabContent.forEach((tc) => {
        this.dataForm[tc.prop] = tc.value || '' // 设置默认value

        // 添加自定义表单元素方法和参数
        if (tc.type == 'custom') {
          // 产品分类
          if (tc.prop === 'warehouseName') {
            tc.method = getWarehouseList
            this.requestObj2.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''

            tc.requestObj = this.requestObj2
            tc.change = this.warehouseNameChange

            tc.dialogTitle = '选择上级仓库'
          }
        }
      })
    })
  },
  mounted() {

  },
  computed: {
    openMode() {
      return this.title === '新建库区' || '新建货架' || '新建库位'
        ? '新建'
        : this.title === '编辑库区'
          ? '编辑'
          : '只读'
    }
  },
  methods: {
    init(data, btntype) {
      console.log("data",data);
      this.btnType = btntype
      this.visible = true
      this.formLoading = true
      this.type = Array.isArray(data) ? 'Array' : 'Object'
      if (this.type === 'Object') {
        if (this.btnType == 'areaLook') {
          this.isdisabled = false
          this.title = '查看库区'
          this.tableFlag = true
          if (!!id) {
            this.dataForm.id = id

            // 获取详情
            detailProductionResourceData(id).then((res) => {
              // 记录编码和图号，用于校验唯一性
              this.dataForm = res.data
              this.autoCode = res.data.code
              this.dataForm.warehouseNameNew = res.data.warehouseName

              this.stockLimitsAuthorities = [
                { name: this.dataForm.name, code: this.dataForm.code, remark: this.dataForm.remark }
              ]
              this.formLoading = false
            })
          }
        } else if (this.btnType == 'edit') {
          this.isdisabled = false
          this.title = '编辑库位'
          this.tableFlag = true

          this.tabs[0].tabContent.forEach((tc) => {
            if (tc.prop == 'code') {
              tc.itemDisabled = true
            }
          })

          if (data.id) {
            this.dataForm.id = data.id

            // 获取详情
            detailProductionResourceData(data.id).then((res) => {
              // 记录编码和图号，用于校验唯一性
              this.dataForm = res.data
              this.autoCode = res.data.code
              this.dataForm.warehouseNameNew = res.data.warehouseName

              this.stockLimitsAuthorities = [
                { name: this.dataForm.name, code: this.dataForm.code, remark: this.dataForm.remark }
              ]
              this.formLoading = false
            })
          }
        } else if (this.btnType == 'add') {
          this.title = '新建库位'
          this.isdisabled = false
          this.editFlag = false
          this.dataForm.type = 'normal'
          this.dataForm.warehouseName = data.warehouseName
          this.dataForm.warehouseId = data.warehouseId

          this.formLoading = false

          // this.$forceUpdate()
        }
      } else {
        this.tabs[0].tabContent.forEach((tc) => {
          this.title = '批量修改库位'
          if (tc.prop == 'name') {
            tc.render = false
          }
          if (tc.prop == 'code') {
            tc.render = false
          }
          if (tc.prop == 'remark') {
            tc.render = false
          }
        })
        this.sleeveItems.forEach((tc) => {
          if (tc.prop == 'code') {
            tc.itemDisabled = true
          }
        })

        this.tableFlag = false
        this.dataForm.warehouseName = data[0].warehouseName
        this.dataForm.warehouseId = data[0].warehouseId
        this.stockLimitsAuthorities = data
        this.formLoading = false
      }
    },
    async handleConfirm() {
      this.btnLoading = true
      let submitFlag = true // 提交可行性判断

      // 校验tabs渲染表单
      // this.stockLimitsAuthorities.forEach((item, index) => {
      //   if (!item.name) {
      //     submitFlag = false
      //     return this.$message.error(`第${index + 1}行库区名称为空`)
      //   }
      //   if (!item.code) {
      //     submitFlag = false
      //     return this.$message.error(`第${index + 1}行库区编码为空`)
      //   }
      // })
      console.log(this.$refs, 'this.$refs')

      const form = this.$refs.dataForm.$refs.main

      const valid_1 = await form.validate().catch(() => false)

      if (!valid_1 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form.fields)
        this.btnLoading = false
      }

      // 判断条件后发送请求
      if (submitFlag) {
        if (this.title == '新建库位') {
          for (let i = 0; i < this.stockLimitsAuthorities.length; i++) {
            this.stockLimitsAuthorities[i].warehouseId = this.dataForm.warehouseId
            this.stockLimitsAuthorities[i].category = 'location'

            this.stockLimitsAuthorities[i].parentId = this.dataForm.warehouseId
          }
        }

        let obj = this.stockLimitsAuthorities

        const formMethod = this.dataForm.id ? editStockGoodsShelves : addStockGoodsShelves
        if (this.type == 'Object') {
          if (this.dataForm.id) {
            editStockGoodsShelves(this.dataForm)
              .then((res) => {
                let msg = res.msg
                if (res.msg === 'Success') {
                  msg = formMethod == addStockGoodsShelves ? '新建成功' : '修改成功'
                }
                this.$message({
                  message: msg,
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.btnLoading = false
                    this.$emit('close', true)
                  }
                })
              })
              .catch(() => {
                this.btnLoading = false
              })
          } else {
            addStockGoodsShelves(this.dataForm)
              .then((res) => {
                let msg = res.msg
                if (res.msg === 'Success') {
                  msg = formMethod == addStockGoodsShelves ? '新建成功' : '修改成功'
                }
                this.$message({
                  message: msg,
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.btnLoading = false
                    this.$emit('close', true)
                  }
                })
              })
              .catch(() => {
                this.btnLoading = false
              })
          }
        } else {
          this.stockLimitsAuthorities.forEach((item) => {
            item.state = this.dataForm.state
          })
          updateBatchStockGoodsShelves(this.stockLimitsAuthorities).then((res) => {
            this.$message({
              message: '批量修改成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          })
        }
      } else {
        this.btnLoading = false
      }
    },
    goBack() {
      this.$emit('close')
    },
    warehouseNameChange(val, data) {
      this.dataForm.parentId = data ? data[0].id : '-1'

      this.parentId = data ? data[0].id : ''

      this.dataForm.warehouseName = data ? data[0].name : ''
      this.dataForm.warehouseId = data ? data[0].id : ''
      this.dataForm.type = data ? data[0].all.type : ''
      this.requestObj5.warehouseId = data[0].id
    },

    // 对应套筒新增行
    addSleeveList() {
      // this.$refs.userselect.openDialog()
      // return
      // this.visible = true
      this.index = this.stockLimitsAuthorities.length
      this.stockLimitsAuthorities.push({
        name: '',
        remark: '',
        code: ''
      })
      if (this.selectType === 'all') {
        this.activeNamerepson = 'all'
        this.setDefault()
      }
    },
    // 对应套筒删除当前行
    deleteth(data, index) {
      this.stockLimitsAuthorities.splice(data.$index, 1)
    },
    //批量选择人员
    hangleSelectSales(val, data) {
      if (!data.length) return
      data.map((item) => {
        item.fullName = item.fullName.split('/')[0]
        this.stockLimitsAuthorities.push({
          userName: item.fullName,
          userId: item.id,
          orgName: item.organize,
          remark: ''
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  // padding: 0px 30px 10px;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  position: sticky;
  top: 0;
  z-index: 99;
  background-color: #fff;
}

.el-button--small {
  padding: 1;
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
  // padding: 0px 20px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep #sleeve .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}

.JNPF-preview-main .main {
  padding-top: 0;
  margin-top: 10px;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
</style>
