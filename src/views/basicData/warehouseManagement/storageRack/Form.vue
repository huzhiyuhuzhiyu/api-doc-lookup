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
        <el-tabs v-model="activeName">
          <!-- 普通属性 -->
          <el-tab-pane v-for="item in tabs" :key="item.tabCode" :label="item.tabName" :name="item.tabCode">
            <JNPF-col v-model="dataForm" :tabContent="item.tabContent" ref="dataForm" :openMode="openMode" />
          </el-tab-pane>

          <JNPF-col-table
            v-if="tableFlag"
            v-model="stockLimitsAuthorities"
            ref="sleeveForm"
            :tableItems="sleeveItems"
            :openMode="openMode"
            @addth="addSleeveList"
            @deleteth="deleteth"
          />
        </el-tabs>
      </div>
      <user-select ref="userselect" v-show="false" :multiple="true" @change="hangleSelectSales"></user-select>
    </div>
  </transition>
</template>

<script>
import {
  detailProduct,
  cpAddProduct,
  updateProductData,
  checkCodeExist,
  checkModelExist
} from '@/api/masterDataManagement/productManage'
import { getCooperativeData, getcategoryTree as getcategoryCoop, getBimBusinessInfo } from '@/api/basicData/index'
import {
  addStockGoodsShelves,
  getList,
  deleteStockGoodsShelves,
  detailProductionResourceData
} from '@/api/basicData/stockGoodsShelves'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getbimProductAttributesList, getbimProductsModelList } from '@/api/masterDataManagement/index'
import { addWarehouse, editWarehouse, getWarehouseInfo, checWarehouseCode } from '@/api/basicData/index'
import { getWarehouseList } from '@/api/basicData/index'
import tabs from './params'
export default {
  data() {
    return {
      datafilelist: [],
      getWarehouseList,
      activeName: 'basicInfo',
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
      sleeveItems: [
        { prop: 'name', label: '库区名称', type: 'input' },
        { prop: 'code', label: '库区编码', type: 'input' }
        // { prop: 'remark', label: '备注', value: '', type: 'input', maxlength: 200 }
      ],
      stockLimitsAuthorities: [],
      requestObj2: {
        name: '',
        code: '',
        noId: '',
        type: '',
        category: 'warehouse'
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
      getbimProductAttributesList, // 产品类别属性列表请求api
      getbimProductsModelList, // 型号管理属性列表
      getCooperativeData, // 供应商列表
      getcategoryCoop, // 供应商分类
      rowColShow: false,
      tableFlag: true,
      tableQuery: {},
      businessType: '' //  参数设置  自动  还是 手输
    }
  },
  created() {
    this.tabs.forEach((tab, tabInd) => {
      tab.tabContent.forEach((tc) => {
        this.dataForm[tc.prop] = tc.value || '' // 设置默认value

        // 添加自定义表单元素方法和参数
        if (tc.type == 'custom') {
          // 产品分类
          if (tc.prop === 'partnerCategoryIdText') {
            // if(tc.prop == 'type') this.type = tc.value

            tc.method = getWarehouseList

            tc.requestObj = this.requestObj2
            tc.change = this.partnerCategoryIdTextChange
            console.log(tc, 'tc999')
            tc.dialogTitle = '选择上级仓库'
          }
        }

        // 添加校验编码和图号唯一性的规则
        if (tc.prop === 'code') {
          if (this.businessType === '1') {
            tc.render = false
          } else {
            if (!tc.itemRules) {
              tc.itemRules = []
            }
            tc.itemRules.push({
              validator: (rule, value, callback) => {
                if (!value) {
                  callback()
                } else if (this.dataForm.code === this.autoCode) {
                  callback()
                } else {
                  checkCodeExist({ id: this.dataForm.id || '', code: this.dataForm.code })
                    .then((res) => {
                      if (!res.data) {
                        callback()
                      } else {
                        callback(new Error('此产品编码已存在'))
                      }
                    })
                    .catch((err) => {
                      callback(new Error(' '))
                    })
                }
              },
              trigger: 'blur'
            })
          }
        }
        // if (tc.prop == 'goodsShelvesId') {
        //   console.log(tc, 'tc123')
        //   tc.change = this.goodsShelvesIdChange
        // }
      })
    })
  },
  computed: {
    openMode() {
      return this.title === '新建库区' || '新建货架' || '新建货位'
        ? '新建'
        : this.title === '编辑库区'
        ? '编辑'
        : '只读'
    }
  },
  methods: {
    init(id, parentId, btnType) {
      this.visible = true
      this.formLoading = true
      this.btnType = btnType
      // getBimBusinessInfo('460907390338859014').then((res) => {
      //   this.businessType = res.data.configValue1
      //   if (this.businessType === '1') {
      //     let target = this.tabs[0].tabContent.find((tc) => tc.prop === 'code')
      //     target.render = false
      //   }
      // })
      if (!!id) {
        this.dataForm.id = id
        // this.title = btnType ? '查看货架/货位' : '编辑货架/货位'
        // 获取详情
        detailProductionResourceData(id).then((res) => {
          // 记录编码和图号，用于校验唯一性
          this.dataForm.code = res.data.code
          this.dataForm.id = res.data.id
          this.dataForm.name = res.data.name
          this.dataForm.parentId = res.data.parentId == '-1' ? '' : res.data.parentId
          this.dataForm.position = res.data.position
          this.dataForm.remark = res.data.remark
          this.dataForm.sort = res.data.sort
          this.dataForm.type = res.data.type

          this.stockLimitsAuthorities = res.data.stockLimitsAuthorities
          this.dataForm.partnerCategoryIdText = res.data.parentName

          // 处理普通属性

          if (this.dataForm.type == 'scrap') {
            this.tabs[0].tabContent.forEach((tc) => {
              if (tc.prop == 'type') {
                tc.options = [{ label: '报废', value: 'scrap' }]
              }
            })
          } else {
            this.tabs[0].tabContent.forEach((tc) => {
              if (tc.prop == 'type') {
                tc.options = [
                  { label: '正常仓库', value: 'normal' },
                  { label: '中转仓库', value: 'temp' },
                  { label: '不良品仓库', value: 'unqualified' }
                ]
              }
            })
          }

          // 编辑时，如果已经规格型号那些，不允许修改
          // this.tabs[0].tabContent.forEach((tc) => {

          //   if (
          //     [
          //       'model',
          //       'sealingCoverStructure',
          //       'structureType',
          //       'clearance',
          //       'steelBallManufacturer',
          //       'oil',
          //       'noise',
          //       'holder'
          //     ].includes(tc.prop)
          //   ) {
          //     tc.itemDisabled = true
          //   }
          // })
          this.formLoading = false
        })
      }
      //  else {
      //   this.title = '新建货架/货位'
      //   this.formLoading = false
      // }
      if (btnType == 'look') {
        this.isdisabled = true
        this.editFlag = true
        this.title = '查看货架/货位'
      } else if (btnType == 'edit') {
        this.editFlag = true
        this.isdisabled = false
        this.title = '编辑库区'
        this.tableFlag = false
      } else if (btnType == 'addReservoirArea') {
        this.title = '新建库区'
        this.isdisabled = false
        this.editFlag = false
        this.dataForm.type = 'normal'
        this.formLoading = false
        // this.requestObj2.type = 'normal'
        // this.$forceUpdate()
      } else if (btnType == 'addShelves') {
        this.title = '新建货架'
        this.isdisabled = false
        this.editFlag = false
        this.dataForm.type = 'normal'
        this.formLoading = false

        // this.requestObj2.type = 'normal'
        // this.$forceUpdate()
      } else {
        this.title = '新建货位'
        this.isdisabled = false
        this.editFlag = false
        this.dataForm.type = 'normal'
        this.formLoading = false
      }
      this.tabs.forEach((tab, tabInd) => {
        tab.tabContent.forEach((tc) => {
          console.log(tc, 'tc9999')

          if (this.title == '新建库区' || this.title == '编辑库区') {
            console.log(this.title, 'ooooo')
            if (
              tc.prop == 'areaId' ||
              tc.prop == 'goodsShelvesId'
              // tc.prop == 'remark'
            ) {
              tc.render = false
            }
          } else if (this.title == '新建货架' || this.title == '编辑货架') {
            if (
              // tc.prop == 'locationType' ||
              // tc.prop == 'category' ||
              tc.prop == 'code' ||
              tc.prop == 'name' ||
              tc.prop == 'remark'
            ) {
              tc.render = false
            }
            this.sleeveItems = [
              { prop: 'name', label: '货架名称', type: 'input' },
              { prop: 'code', label: '货架编码', type: 'input' }
            ]
          } else if (this.title == '新建货位') {
            if (
              // tc.prop == 'locationType' ||
              // tc.prop == 'category' ||
              tc.prop == 'code' ||
              tc.prop == 'name' ||
              tc.prop == 'remark'
            ) {
              tc.render = false
            }
            this.sleeveItems = [
              { prop: 'name', label: '货位名称', type: 'input' },
              { prop: 'code', label: '货位编码', type: 'input' }
            ]
          }
        })
      })
    },
    async handleConfirm() {
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
        if (this.title == '新建库区') {
          for (let i = 0; i < this.stockLimitsAuthorities.length; i++) {
            this.stockLimitsAuthorities[i].warehouseId = this.tableQuery.warehouseId
            this.stockLimitsAuthorities[i].category = 'area'
            this.stockLimitsAuthorities[i].parentId = this.tableQuery.warehouseId
          }
        } else if (this.title == '新建货架') {
          for (let i = 0; i < this.stockLimitsAuthorities.length; i++) {
            this.stockLimitsAuthorities[i].warehouseId = this.tableQuery.warehouseId
            this.stockLimitsAuthorities[i].category = 'shelves'
            if (this.tableQuery.areaId) {
              this.stockLimitsAuthorities[i].areaId = this.tableQuery.areaId
              this.stockLimitsAuthorities[i].parentId = this.tableQuery.areaId
            } else {
              this.stockLimitsAuthorities[i].warehouseId = this.tableQuery.warehouseId
              this.stockLimitsAuthorities[i].parentId = this.dataForm.warehouseId
            }
          }
        } else if (this.title == '新建货位') {
          for (let i = 0; i < this.stockLimitsAuthorities.length; i++) {
            this.stockLimitsAuthorities[i].warehouseId = this.dataForm.warehouseId
            this.stockLimitsAuthorities[i].category = 'location'
            if (this.dataForm.goodsShelvesId) {
              this.stockLimitsAuthorities[i].goodsShelvesId = this.dataForm.goodsShelvesId
              this.stockLimitsAuthorities[i].parentId = this.dataForm.goodsShelvesId
            } else if (this.dataForm.areaId) {
              this.stockLimitsAuthorities[i].areaId = this.dataForm.areaId
              this.stockLimitsAuthorities[i].parentId = this.dataForm.areaId
            } else {
              this.stockLimitsAuthorities[i].warehouseId = this.dataForm.warehouseId
              this.stockLimitsAuthorities[i].parentId = this.dataForm.warehouseId
            }
          }
        }

        let obj = this.stockLimitsAuthorities
        const formMethod = this.dataForm.id ? editWarehouse : addStockGoodsShelves
        formMethod(obj)
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
        this.btnLoading = false
      }
    },
    goBack() {
      this.$emit('close')
    },
    partnerCategoryIdTextChange(val, data) {
      console.log(data, 'data666') // dom更新后重新校验此元素

      getWarehouseList(this.requestObj2).then((res) => {
        if (!val && !data.length) {
          this.dataForm.parentId = '-1'

          return (this.dataForm.partnerCategoryIdText = '')
        }

        this.dataForm.parentId = data ? data[0].id : '-1'

        this.parentId = data ? data[0].id : ''

        this.dataForm.partnerCategoryIdText = data ? data[0].name : ''

        this.dataForm.type = data ? data[0].all.type : ''
      })

      console.log(this.title, 'title')

      this.tableQuery.warehouseId = data[0].id

      this.tableQuery.category = 'area'

      this.tableQuery.pageSize = -1

      getList(this.tableQuery).then((res) => {
        console.log(res, 'rees')

        this.tabs[0].tabContent.forEach((tc) => {
          if (this.tableQuery.category == 'area') {
            if (tc.prop == 'areaId') {
              tc.options = res.data.records.map((item) => {
                console.log(item, 'poooo')
                return { label: item.name, value: item.id }
              })
              tc.change = this.areaIdChange
              console.log(tc, 'lkk')
            }
          }
        })
      })
    },
    // 库区选择
    areaIdChange(val, data) {
      console.log(val, 'val')
      console.log(data, 'data')
      this.tableQuery.category = 'shelves'
      this.tableQuery.areaId = val

      this.tableQuery.parentId = val

      getList(this.tableQuery).then((res) => {
        console.log(res, 'rees')

        this.tabs[0].tabContent.forEach((tc) => {
          if (this.tableQuery.category == 'shelves') {
            if (tc.prop == 'goodsShelvesId') {
              tc.options = res.data.records.map((item) => {
                return { label: item.name, value: item.id }
              })
              // tc.change = this.goodsShelvesIdChange
              console.log(tc, 'lkk')
            }
          }
        })
      })
    },
    // 货架选择
    goodsShelvesIdChange(val, data) {
      console.log(val, 'val')
      console.log(data, 'data')
      this.tableQuery.category = 'location'
      this.tableQuery.areaId = val

      this.tableQuery.parentId = val
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
  padding: 0px 30px 10px;
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
</style>
