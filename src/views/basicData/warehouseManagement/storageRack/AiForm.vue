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
        <!-- 使用对象结合自定义组件渲染内容 -->

        <el-collapse v-model="activeNames">
          <el-collapse-item title="基础信息" name="basicInfo" class="orderInfo">
            <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" :openMode="openMode" />
            <JNPF-col-table v-if="tableFlag" v-model="stockLimitsAuthorities" ref="sleeveForm" :tableItems="sleeveItems"
              :openMode="openMode" @addth="addSleeveList" @deleteth="deleteth" />
            <JNPF-col-table v-else v-model="stockLimitsAuthorities" ref="sleeveForm" :tableItems="sleeveItems"
              :openMode="openMode" />
          </el-collapse-item>
        </el-collapse>

      </div>
      <user-select ref="userselect" v-show="false" :multiple="true" @change="hangleSelectSales"></user-select>
    </div>
  </transition>
</template>

<script>
import {
  addBatchStockGoodsShelves,
  getListTree,
  getList,
  deleteStockGoodsShelves,
  detailProductionResourceData,
  editStockGoodsShelves
} from '@/api/basicData/stockGoodsShelves'
import { addWarehouse, editWarehouse, getWarehouseInfo, checWarehouseCode } from '@/api/basicData/index'
import { getWarehouseList } from '@/api/basicData/index'
export default {
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
        category: 'warehouse'
      },
      dataFormItems: [
        { prop: "warehouseName", label: "上级仓库", value: "", type: 'custom', customComponent: "ComSelect-list", render: true, itemRules: [{ required: true, trigger: "change" }] },
        { prop: "state", label: "状态", value: "", type: 'select', render: true, itemRules: [{ required: true, trigger: "change" }], options: [{ label: '启用', value: 'enable' }, { label: '禁用', value: 'disabled' }] },
      ],
      sleeveItems: [
        {
          prop: 'name',
          label: '库位名称',
          type: 'input',
          itemRules: [{ required: true, message: '请输入库位编码', trigger: 'blur' }]
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
      businessType: '' //  参数设置  自动  还是 手输
    }
  },
  created() {

    this.dataFormItems.forEach((tc) => {
      this.dataForm[tc.prop] = tc.value || '' // 设置默认value

      // 添加自定义表单元素方法和参数
      if (tc.type == 'custom') {
        // 产品分类
        if (tc.prop === 'warehouseName') {
          tc.method = getWarehouseList

          tc.requestObj = this.requestObj2
          tc.change = this.warehouseNameChange

          tc.dialogTitle = '选择上级仓库'
        }
      }
    })

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
    init(row) {
      console.log(row, 'oooooooo')
      this.visible = true
      this.formLoading = true
      this.btnType = row.btntype
      console.log(this.btnType, 'bttttttt')

      // if (row.id) {
      //   this.dataForm.id = id
      //   // this.title = btnType ? '查看货架/库位' : '编辑货架/库位'
      //   // 获取详情
      //   detailProductionResourceData(id).then((res) => {
      //     // 记录编码和图号，用于校验唯一性
      //     this.dataForm = res.data
      //     this.autoCode = res.data.code
      //     this.dataForm.warehouseId = res.data.warehouseId
      //     this.requestObj5.warehouseId = this.dataForm.warehouseId

      //     this.stockLimitsAuthorities = [
      //       { name: this.dataForm.name, code: this.dataForm.code, remark: this.dataForm.remark }
      //     ]

      //     this.formLoading = false
      //   })
      // }

      if (this.btnType == 'areaLook') {
        this.isdisabled = false
        this.title = '查看库区'
        this.tableFlag = false
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
        this.tableFlag = false
        console.log(row, 'id')
        if (row.id) {
          this.dataForm.id = row.id

          // 获取详情
          detailProductionResourceData(row.id).then((res) => {
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
        console.log('库区', row)
        this.title = '新建库位'
        this.isdisabled = false
        this.editFlag = false
        this.dataForm.type = 'normal'
        this.dataForm.warehouseName = row.warehouseName
        this.dataForm.warehouseId = row.warehouseId

        this.formLoading = false

        // this.$forceUpdate()
      }
    },
    async handleConfirm() {
      if (this.stockLimitsAuthorities.length == 0) return this.$message.error(`请添加${this.title.slice(-2)}`)
      this.btnLoading = true
      let submitFlag = true // 提交可行性判断

      // 校验tabs渲染表单
      for (let i = 0; i < this.$refs['dataForm'].length; i++) {
        const item = this.$refs['dataForm'][i]
        const form = item.$refs.main

        const valid_1 = await form.validate().catch(() => false)

        if (!valid_1 && submitFlag) {
          submitFlag = false
          this.activeName = this.tabs[i].tabCode
          this.jnpf.focusErrValidItem(form.fields)
        }
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
        for (let i = 0; i < this.stockLimitsAuthorities.length; i++) {
          this.dataForm.name = this.stockLimitsAuthorities[i].name
          this.dataForm.code = this.stockLimitsAuthorities[i].code
          this.dataForm.remark = this.stockLimitsAuthorities[i].remark
        }

        const formMethod = this.dataForm.id ? editStockGoodsShelves : addBatchStockGoodsShelves
        if (this.dataForm.id) {
          editStockGoodsShelves(this.dataForm)
            .then((res) => {
              let msg = res.msg
              if (res.msg === 'Success') {
                msg = formMethod == addBatchStockGoodsShelves ? '新建成功' : '修改成功'
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
          addBatchStockGoodsShelves(this.dataForm)
            .then((res) => {
              let msg = res.msg
              if (res.msg === 'Success') {
                msg = formMethod == addBatchStockGoodsShelves ? '新建成功' : '修改成功'
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
    deleteth(row, index) {
      this.stockLimitsAuthorities.splice(row.$index, 1)
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
}

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
</style>
