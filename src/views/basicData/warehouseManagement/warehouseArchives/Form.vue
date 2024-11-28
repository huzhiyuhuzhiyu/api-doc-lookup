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
          </el-collapse-item>
        </el-collapse>

      </div>
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
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getbimProductAttributesList, getbimProductsModelList } from '@/api/masterDataManagement/index'
import { addWarehouse, editWarehouse, getWarehouseInfo, checWarehouseCode } from '@/api/basicData/index'
import { getWarehouseList } from '@/api/basicData/index'
import tabs from './params'
import { mapGetters, mapState } from 'vuex'
import getProjectList from '@/mixins/generator/getProjectList'
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
        projectId: "",
      },
      sleeveItems: [
        { prop: 'userName', label: '姓名', type: 'view' },
        { prop: 'orgName', label: '部门', type: 'view' },
        { prop: 'remark', label: '备注', value: '', type: 'input', maxlength: 200 }
      ],
      stockLimitsAuthorities: [],
      requestObj2: {
        name: '',
        code: '',
        noId: '',
        type: ''
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

      projectIdDataList: [],
      businessType: '',//  参数设置  自动  还是 手输
      isProjectSwitch: "",
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),

  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProjectList()
    this.isProjectSwitchFlag = true
   
    this.tabs.forEach((tab, tabInd) => {
      if (this.isProjectSwitch == 1) {
        tab.tabContent.splice(2, 0,
          { prop: "projectId", label: "所属项目", value: this.dataForm.projectId, type: 'select', render: true, itemDisabled: this.dataForm.projectId != "", itemRules: [{ required: true, trigger: "change" }], options: this.projectIdDataList, sm: 8 },


        )

      }
      tab.tabContent.forEach((tc) => {

        // this.dataForm[tc.prop] = tc.value || '' // 设置默认value
        // 添加自定义表单元素方法和参数
        if (tc.type == 'custom') {
          // 产品分类
          if (tc.prop === 'partnerCategoryIdText') {
            // if(tc.prop == 'type') this.type = tc.value

            tc.method = getWarehouseList

            tc.requestObj = this.requestObj2
            tc.change = (val, data) => {
              // dom更新后重新校验此元素
              this.requestObj2.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
              getWarehouseList(this.requestObj2).then((res) => {
                if (!val && !data.length) {
                  this.dataForm.parentId = '-1'
                  return (this.dataForm.partnerCategoryIdText = '')
                }
                this.dataForm.parentId = data ? data[0].id : '-1'
                this.parentId = data ? data[0].id : ''
                this.dataForm.partnerCategoryIdText = data ? data[0].name : ''
                this.dataForm.type = data ? data[0].all.type : ''

                if (this.dataForm.type == 'line_edge') {
                  this.tabs[0].tabContent.forEach((tc) => {
                    if (tc.prop == 'workshop') {
                      tc.render = true
                    }
                  })
                }
                if (this.dataForm.type == 'scrap') {
                  this.tabs[0].tabContent.forEach((tc) => {
                    if (tc.prop == 'type') {
                      tc.options = [{ label: '报废仓库', value: 'scrap' }]
                    }
                  })
                } else if (this.dataForm.type == 'virtually') {
                  this.tabs[0].tabContent.forEach((tc) => {
                    if (tc.prop == 'type') {
                      tc.options = [{ label: '虚拟仓库', value: 'virtually' }]
                    }
                  })
                } else {
                  this.tabs[0].tabContent.forEach((tc) => {
                    if (tc.prop == 'type') {
                      tc.options = [
                        { label: '正常仓库', value: 'normal' },
                        { label: '中转仓库', value: 'temp' },
                        { label: '不良品仓库', value: 'unqualified' },
                        { label: '报废仓库', value: 'scrap' },
                        { label: '线边仓库', value: 'line_edge' },
                        { label: '委外仓库', value: 'out' },
                      ]
                    }
                  })
                }
              })
            }
            tc.dialogTitle = '选择上级仓库'
          }
        }

        // 添加校验编码和图号唯一性的规则
        if (tc.prop === 'code') {
          if (this.businessType === '1') {
            tc.render = false
            tc.itemDisabled = true
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
                  if (this.dataForm.id) {
                    checWarehouseCode(value, this.dataForm.id)
                      .then((res) => {
                        if (!res.data) {
                          callback()
                        } else {
                          callback(new Error('此仓库编码已存在'))
                        }
                      })
                      .catch((err) => {
                        callback(new Error(' '))
                      })
                  } else {
                    checWarehouseCode(value, '')
                      .then((res) => {
                        if (!res.data) {
                          callback()
                        } else {
                          callback(new Error('此仓库编码已存在'))
                        }
                      })
                      .catch((err) => {
                        callback(new Error(' '))
                      })
                  }
                }
              },
              trigger: 'blur'
            })
          }
        } else if (tc.prop === 'model') {
          if (!tc.itemRules) {
            tc.itemRules = []
          }
          tc.itemRules.push({
            validator: (rule, value, callback) => {
              if (!value) {
                callback()
              } else if (this.dataForm.drawingNo === this.autoDrawingNo) {
                callback()
              } else {
                // this.jnpf.specialCodeUrl 对浏览器无法解析的url字符进行手动转码
                checkModelExist({ id: this.dataForm.id || '', model: this.dataForm.model })
                  .then((res) => {
                    if (!res.data) {
                      callback()
                    } else {
                      callback(new Error('此型号已存在'))
                    }
                  })
                  .catch((err) => {
                    callback(new Error(' '))
                  })
              }
            },
            trigger: 'blur'
          })
        } else if (tc.prop === 'type') {
          tc.change = (val) => {
            if (val == 'line_edge') {
              this.tabs[0].tabContent.forEach((tc) => {
                if (tc.prop == 'workshop') {
                  tc.render = true
                } else if (tc.prop == 'locationStatus') {
                  tc.itemDisabled = false
                }
              })
              this.dataForm.locationStatus = 'enable'
            } else if (val == 'out') {
              this.tabs[0].tabContent.forEach((tc) => {
                if (tc.prop == 'locationStatus') {
                  tc.itemDisabled = true
                }
                this.dataForm.locationStatus = 'disabled'
              })
            } else {
              this.tabs[0].tabContent.forEach((tc) => {
                if (tc.prop == 'workshop') {
                  tc.render = false
                } else if (tc.prop == 'locationStatus') {
                  tc.itemDisabled = false
                }
              })
              this.dataForm.locationStatus = 'enable'
            }
          }
        }
      })
    })
  },
  computed: {
    openMode() {
      return this.title === '新建仓库档案' ? '新建' : this.title === '编辑仓库档案' ? '编辑' : '只读'
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
        // this.title = btnType ? '查看仓库档案' : '编辑仓库档案'
        // 获取详情
        getWarehouseInfo(id).then((res) => {
          // 记录编码和图号，用于校验唯一性
          this.autoCode = res.data.code
          this.dataForm.code = res.data.code
          this.dataForm.id = res.data.id
          this.dataForm.name = res.data.name
          this.dataForm.parentId = res.data.parentId
          this.dataForm.state = res.data.state
          this.dataForm.workshop = res.data.workshop
          this.dataForm.position = res.data.position
          this.dataForm.remark = res.data.remark
          this.dataForm.sort = res.data.sort
          this.dataForm.type = res.data.type
          this.dataForm.warehouseManagementStatus = res.data.warehouseManagementStatus
          this.dataForm.projectId = res.data.projectId

          this.stockLimitsAuthorities = res.data.stockLimitsAuthorities
          this.dataForm.partnerCategoryIdText = res.data.parentName
          if (this.dataForm.type == 'line_edge') {
            this.tabs[0].tabContent.forEach((tc) => {
              if (tc.prop == 'workshop') {
                tc.render = true
              }
            })
          }
          // 处理普通属性

          if (this.dataForm.type == 'scrap') {
            this.tabs[0].tabContent.forEach((tc) => {
              if (tc.prop == 'type') {
                tc.options = [{ label: '报废仓库', value: 'scrap' }]
              }
            })
          } else if (this.dataForm.type == 'virtually') {
            this.tabs[0].tabContent.forEach((tc) => {
              if (tc.prop == 'type') {
                tc.options = [{ label: '虚拟仓库', value: 'virtually' }]
              }
            })
          } else {
            this.tabs[0].tabContent.forEach((tc) => {
              if (tc.prop == 'type') {
                tc.options = [
                  { label: '正常仓库', value: 'normal' },
                  { label: '中转仓库', value: 'temp' },
                  { label: '不良品仓库', value: 'unqualified' },
                  { label: '线边仓库', value: 'line_edge' },
                  { label: '委外仓库', value: 'out' }
                ]
              }
            })
          }

          this.formLoading = false
        })
      }

      if (btnType == 'look') {
        this.isdisabled = true
        this.editFlag = true
        this.title = '查看仓库档案'
      } else if (btnType == 'edit') {
        this.editFlag = false
        this.isdisabled = false
        this.title = '编辑仓库档案'
      } else {
        this.title = '新建仓库档案'
        this.isdisabled = false
        this.editFlag = false
        this.dataForm.type = 'normal'
        this.formLoading = false
        // this.requestObj2.type = 'normal'
        this.$forceUpdate()
      }
    },
    async handleConfirm() {
      let submitFlag = true // 提交可行性判断
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
      }
      this.dataForm.state = 'enable'
      // 判断条件后发送请求
      if (submitFlag) {
        let obj = {
          stockWarehouse: this.dataForm,
          stockLimitsAuthorities: this.stockLimitsAuthorities
        }
        const formMethod = this.dataForm.id ? editWarehouse : addWarehouse
        this.btnLoading = true

        formMethod(obj)
          .then((res) => {
            let msg = res.msg
            if (res.msg === 'Success') {
              msg = formMethod == addWarehouse ? '新建成功' : '修改成功'
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
  }
}
</script>
<style lang="scss" scoped>
.main {
  // padding: 0px 30px 10px;
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

::v-deep .el-tabs__header {
  margin-bottom: 5px;
}
</style>
