<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack"
          :content="btnType == 'add' ? '新建模具绑定产品' : btnType == 'edit' ? '编辑模具绑定产品' : '查看模具绑定产品'" />
        <div class="options" v-if="btnType != 'look'">
          <!-- <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿</el-button> -->
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">

        <el-tabs v-model="activeName" @tab-click="handleClick" class=".el-table">
          <el-tab-pane label="任务信息" name="orderInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="30" class="custom-row">
                    <!-- <el-col :sm="6" :xs="24">
                      <el-form-item label="任务名称" prop="name">
                        <el-input v-model="dataForm.name" placeholder="请输入任务名称" :disabled="btnType == 'look'" maxlength="20" />
                      </el-form-item>
                    </el-col> -->
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="模具编码" prop="equipmentIdCode">
                        <el-input v-model="dataForm.equipmentIdCode" disabled></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="模具名称" prop="equipmentIdName">
                        <el-input v-model="dataForm.equipmentIdName" disabled></el-input>
                        <!-- <ComSelect-page v-model="dataForm.equipmentIdName" ref="ComSelect-pagesb"
                          @change="changeWarehouse" :tableItems="ProductTableItemss" title="选择模具" treeTitle="模具分类"
                          :methodArr="{ method: getcategoryTree, requestObj: { classAttribute: 'mold' } }"
                          :listMethod="getEquEquipmentList" :listRequestObj="ProductListRequestObjs"
                          :searchList="ProductTableSearchLists" :disabled="btnType !== 'add'" placeholder="请选择模具" /> -->
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="产品信息" name="xmxx">
                <TableForm-product :value="linesList" @input="contentChanges" ref="tableFormRef"
                  :tableItems="linesListItems" :btnType="btnType" @addth="addOrDelLinesItem"
                  @deleteth="addOrDelLinesItem" customStyle />
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <!-- <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
            <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'"></UploadWj>
          </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { getcategoryTree, getequMaintenanceLevel } from '@/api/basicData/materialSettings'
import { maintenanceTriggerSetting, maintenanceTriggerSettingModify, maintenanceTriggerSettingDetailMold, equEquipmentMoldProductList, batchModifyEquEquipmentProdMold } from '@/api/dailyManagement/Maintenance'
import { parametersShelveslist, getBimBusinessDetail } from '@/api/basicData/index'
import { getOrganizeInfo } from '@/api/permission/organize'
import { getEquEquipmentList } from '@/api/basicData/index'
import { getDepartmentSelectorByAuth } from '@/api/permission/department'
import { getOrganization } from '@/api/permission/user'
import getProjectList from '@/mixins/generator/getProjectList'
// import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue' // 附带产品多选的表格表单组件
export default {
  mixins: [getProjectList],
  components: { TableFormProduct },
  data() {
    return {
      isProjectSwitch: '',
      isattachmentswitch: '',
      categoryId: '',
      activeNames: ["basicInfo", "sbxx", "xmxx"],
      level: [],
      options: [],
      datafilelist: [],
      ProductTableSearchLists: [
        { prop: "code", label: "模具编码", type: 'input' },
        { prop: "name", label: "模具名称", type: 'input' },
      ],
      ProductListRequestObjs: {
        projectId: '',
        maintenanceFlag: 0,
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            "asc": false,
            "column": ""
          },
          {
            "asc": false,
            "column": "create_time"
          }
        ],
        code: "",
        name: "",
        state: 'normal',
        deviceType: 'normal',
        classAttribute: "mold",
      },
      getcategoryTree,
      ProductTableItemss: [
        { prop: 'code', label: '模具编码', fixed: 'left' },
        { prop: 'name', label: '模具名称', fixed: 'left' },
        { prop: 'categoryName', label: '模具分类' },
        { prop: 'specModel', label: '模穴数量' },
      ],
      productForm: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        code: "",
        name: "",
        typeCode: 'maintenanceItem'
      },
      selectlist: [],
      productVisible: false,
      cusProductData: [],
      cycleTypeStateList: [
        { label: "周期", value: "cycle" },
        { label: "一次", value: "disposable" },
      ],
      stateList: [
        { label: "禁用", value: "disabled" },
        { label: "启用", value: "enable" }
      ],
      unitStateList: [
        { label: '天' },
        { label: '周' },
        { label: '月' },
        { label: '季' },
        { label: '年' }
      ],
      salesList: [],
      provinces: [],
      getEquEquipmentList,
      getDepartmentSelectorByAuth,
      ordersLineId: '',
      isproductDrawingNo: false,
      code: '',
      iszt: false,
      iszhi: false,
      dataFormOne: {
        productData: [],
      },
      linesList: [],
      listLoading: false,
      total: 0,
      tableDataCustomer: [],
      btnType: undefined,
      activeName: "orderInfo",
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataForm: {},
      anceTime: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1000 * 3600 * 24;
        }
      },
      organizeIdTrees: [],
      dataRule: {
        triggerCount: [
          { required: true, message: '触发次数不能为空', trigger: 'blur' },
          { validator: this.formValidate('bigInt', null, () => { }), trigger: 'blur' }
        ],
        maintenanceLevelId: [
          { required: true, message: '保养等级不能为空', trigger: 'change' }
        ],
        name: [
          { required: true, message: '任务名称不能为空', trigger: 'change' }
        ],
        cycleType: [
          { required: true, message: '周期类型不能为空', trigger: 'change' }
        ],
        equipmentId: [
          { required: true, message: '模具不能为空', trigger: 'change' }
        ],
        departmentId: [
          { required: true, message: '计划保养部门不能为空', trigger: 'blur' }
        ],
        maintainerId: [
          { required: true, message: '计划保养人不能为空', trigger: 'change' }
        ],
        state: [
          { required: true, message: '状态不能为空', trigger: 'change' }
        ],
        cycle: [
          { required: true, message: '周期不能为空', trigger: 'change' },
          { validator: this.formValidate('bigInt'), trigger: 'change' }
        ],
        unit: [
          { required: true, message: '单位不能为空', trigger: 'change' }
        ],
        nextMaintenanceTime: [
          { required: true, message: `初次保养时间不能为空`, trigger: 'change' }
        ],
      },
      customerData: {},
      treeLoading: false,
      selectRows: [],
      selectRowssb: [],
      linesListItems: [
        { prop: 'code', label: '产品编码', type: 'view' },
        { prop: 'name', label: '产品名称', type: 'view' },
        { prop: 'drawingNo', label: this.$store.getters.productDrawingNo, type: 'view' },
      ],
    }
  },
  watch: {
    'dataForm.maintainerId'(newValue) {
      if (this.isProjectSwitch === '1') {
        this.dataFormOne.productData = []
        let _data = this.salesList.filter(item => item.id == newValue)[0]
        this.ProductListRequestObjs.projectId = _data.projectId ? _data.projectId || '' : ''
      }
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.getBimBusinessDetail()
  },
  mounted() {
    let tBody = document.querySelectorAll('.el-table')[1]
    tBody.style.height = 'auto'
    tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
  },
  methods: {
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_gjbyrwgl'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
        this.categoryId = res.data.configValue2
      })
    },
    geteLevel() {
      getequMaintenanceLevel({ pageNum: 1, pageSize: -1 }).then(res => {
        this.options = res.data.records.reduce((acc, item) => {
          // 查找当前 level 在结果中是否存在
          let levelGroup = acc.find(group => group.value === item.level);
          // 如果不存在，则创建一个新的
          if (!levelGroup) {
            levelGroup = {
              value: item.level,
              label: item.level,
              children: []
            };
            acc.push(levelGroup);
          }
          // 添加当前 item 到对应的 children 中
          levelGroup.children.push({
            value: item.id,
            label: `${item.cycle} ${item.unit}`
          });
          return acc;
        }, [])
      })
    },
    changelevel(e) {
      let a = this.$refs['mycascader'].getCheckedNodes()[0].pathLabels[1].split(' ')
      this.dataForm.maintenanceLevelId = e[1]
      this.dataForm.cycle = a[0]
      this.dataForm.unit = a[1]
    },
    openSeleceProductDialogss() {
      this.$refs['ComSelect-pagesb'].openDialog()
    },
    //表格某一行被点击
    rowaction(row) {
      this.$refs['dataTable'].$refs.JNPFTable.toggleRowSelection(row)
    },
    //状态
    cycleTypeaction(value) {
      if (value) {
        this.dataForm.cycleType = value
        if (value == 'cycle') {
          this.anceTime = '下次'
        } else {
          this.anceTime = '计划'
        }
      } else {
        this.dataForm.cycleType = ''
      }
    },
    //下次保养时间
    // nextMaintenanceTimeaction(value) {
    //   this.dataForm.nextMaintenanceTime = value 
    // },
    // 打开保养项目
    openSeleceProductDialog() {
      this.productVisible = true
      this.getcooperativeProduct()
    },
    openSeleceProductDialogsb() {
      this.$refs['ComSelect-page'].openDialog()
    },
    getcooperativeProduct() {
      this.listLoading = true
      parametersShelveslist(this.productForm).then(res => {
        this.cusProductData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 选中项目
    handleSelectionChange(e) {
      this.selectlist = e
    },
    //选择保养项目
    submitCustomerProduct() {
      this.productVisible = false
      this.selectlist.map(item => {
        this.linesList.map((item1) => {
          if (item.code == item1.itemCode) {
            item.isrepeat = true
          }
        })
      });
      this.selectlist.map(item => {
        if (!item.isrepeat) {
          this.linesList.push({
            itemName: item.name,
            itemCode: item.code,
            itemRequirements: item.itemRequirements,
            id: ''
          })
        } else {
          this.$message({
            message: "所选项目编码重复",
            type: 'error',
            duration: 1500,
          })
        }
      })
    },
    // //周期
    // cycleaction(value) {
    //   console.log(value);
    //   if (value > 0 && Number.isInteger(value * 1)) {
    //     if (this.dataForm.unit == '天') {
    //       const end = new Date();//获取当前的日期
    //       end.setDate(end.getDate() + value * 1);
    //       end.setTime(end.getTime())
    //       //计算，将当期日期-1天
    //       //此时得到的是中国标准时间，格式不是yyyy-MM-dd，需要用dateFormat这个函数转换下
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     } else if (this.dataForm.unit == '周') {
    //       const end = new Date();
    //       end.setDate(end.getDate() + value * 7);
    //       end.setTime(end.getTime())
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     } else if (this.dataForm.unit == '月') {
    //       const end = new Date();
    //       end.setMonth(end.getMonth() + value * 1);
    //       end.setTime(end.getTime())
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     } else if (this.dataForm.unit == '季') {
    //       const end = new Date();
    //       end.setMonth(end.getMonth() + value * 3);
    //       end.setTime(end.getTime())
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     } else if (this.dataForm.unit == '年') {
    //       const end = new Date();
    //       // end.setMonth(end.getMonth() + value*3);
    //       end.setFullYear(end.getFullYear() + 1 * value);
    //       end.setTime(end.getTime())
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     } else {
    //       this.dataForm.nextMaintenanceTime = ''
    //     }
    //   } else {
    //     this.dataForm.nextMaintenanceTime = ''
    //   }
    // },
    // //单位
    // unitaction(value) {
    //   console.log(value, '单位');
    //   if (this.dataForm.cycle > 0 && Number.isInteger(this.dataForm.cycle * 1)) {
    //     if (value == '天') {
    //       const end = new Date();//获取当前的日期
    //       end.setDate(end.getDate() + this.dataForm.cycle * 1);
    //       end.setTime(end.getTime())
    //       //计算，将当期日期-1天
    //       //此时得到的是中国标准时间，格式不是yyyy-MM-dd，需要用dateFormat这个函数转换下
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     } else if (value == '周') {
    //       const end = new Date();
    //       end.setDate(end.getDate() + this.dataForm.cycle * 7);
    //       end.setTime(end.getTime())
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     } else if (value == '月') {
    //       const end = new Date();
    //       end.setMonth(end.getMonth() + this.dataForm.cycle * 1);
    //       end.setTime(end.getTime())
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     } else if (value == '季') {
    //       const end = new Date();
    //       end.setMonth(end.getMonth() + this.dataForm.cycle * 3);
    //       end.setTime(end.getTime())
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     } else if (value == '年') {
    //       const end = new Date();
    //       // end.setMonth(end.getMonth() + this.dataForm.cycle*3);
    //       end.setFullYear(end.getFullYear() + 1 * this.dataForm.cycle);
    //       end.setTime(end.getTime())
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     }
    //   } else {
    //     this.dataForm.nextMaintenanceTime = ''
    //   }

    // },
    //计划保养人
    selectsales(val) {
      this.dataForm.maintainerId = val
    },
    //计划保养部门
    changedepartment(val) {
      this.dataForm.departmentIdName = ""
      this.dataForm.departmentId = ""
      this.$forceUpdate()
      if (!val || !val.length) return this.dataForm.departmentId = ''
      this.dataForm.departmentId = val[val.length - 1]
      this.$nextTick(() => { this.$refs['dataForm'].validateField('departmentId') })
      getOrganization({ keyword: "", organizeId: this.dataForm.departmentId }).then(res => {
        console.log("用户", res);
        if (res.data.length > 0) {
          res.data.forEach(item => {
            item.name = item.fullName.split('/')[0]
          });
        }
        this.salesList = res.data

      })
    },
    //选择模具
    changeWarehouse(val, data) {
      this.$nextTick(() => {
        this.$refs.dataForm.validateField('equipmentId')
      })
      if (!val && !data.length) return
      this.dataForm.equipmentIdName = data[0].name
      this.dataForm.equipmentId = data[0].id
      this.dataForm.equipmentIdCode = data[0].all.code
    },
    changeWarehousesb(val, data) {
      data.map(item => {
        this.dataFormOne.productData.map((item1) => {
          if (item.all.code == item1.code) {
            item.all.isrepeat = true
          }
        })
      });
      data.map(item => {
        if (!item.all.isrepeat) {
          this.dataFormOne.productData.push(item.all)
        } else {
          this.$message({
            message: "所选模具重复",
            type: 'error',
            duration: 1500,
          })
        }
      })
    },
    // dateFormat(dateData) {
    //   var date = new Date(dateData)
    //   var y = date.getFullYear()
    //   var m = date.getMonth() + 1
    //   m = m < 10 ? ('0' + m) : m
    //   var d = date.getDate()
    //   d = d < 10 ? ('0' + d) : d
    //   var h = date.getHours()
    //   h = h < 10 ? ('0' + h) : h
    //   var min = date.getMinutes()
    //   min = min < 10 ? ('0' + min) : min
    //   // var s = date.getSeconds()
    //   // s = s < 10 ? ('0' + s) : s
    //   const time = y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + '00'
    //   return time
    // },
    // 重置项目搜索条件
    resetcusProduct() {
      this.productForm = {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        code: "",
        name: "",
        typeCode: 'maintenanceItem'
      }
      this.searchcusProduct()
    },
    // 搜索项目
    searchcusProduct() {
      this.productForm.pageNum = 1
      this.getcooperativeProduct()
    },
    goBack() {
      this.$emit('close')
    },
    // 产品列表选中 
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    handeleProductInfoDatasb(val) {
      this.selectRowssb = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (!this.selectRows.length) {
        this.$message({
          message: '请选择要删除的产品',
          type: 'error',
          duration: 1500,
        })
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.linesList.indexOf(row);
        if (index > -1) {
          this.linesList.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },
    // 批量删除模具
    batchDeletesb() {
      // 遍历选中的行的数据
      if (!this.selectRowssb.length) {
        this.$message({
          message: '请选择要删除的模具',
          type: 'error',
          duration: 1500,
        })
      }
      for (let i = 0; i < this.selectRowssb.length; i++) {
        const row = this.selectRowssb[i];
        const index = this.dataFormOne.productData.indexOf(row);
        if (index > -1) {
          this.dataFormOne.productData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRowssb = []; // 清空选中的行的数据
    },
    // 单个删除
    handleDel(data) {
      this.linesList.splice(data.$index, 1)
    },
    handleDelsb(data) {
      this.dataFormOne.productData.splice(data.$index, 1)
    },

    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },

    // 切换table
    handleClick(tab, event) {
      console.log(tab, event);
    },
    init(row, btnType) {
      const { id } = row;
      console.log({ id, btnType });

      this.btnType = btnType


      this.dataForm = {
        id: row.id,
        equipmentIdCode: row.code,
        equipmentIdName: row.name,
      }
      this.formLoading = true
      equEquipmentMoldProductList(id).then(res => {
        // this.dataForm = res.data.triggerSetting
        this.linesList = res.data.moldProdList
        // if (this.dataForm.level && this.dataForm.maintenanceLevelId) this.level = [this.dataForm.level, this.dataForm.maintenanceLevelId]
        if (res.data.attachmentList) {
          res.data.attachmentList.forEach((item) => {
            this.datafilelist.push(
              {
                name: item.document.fullName,
                fileSize: item.document.fileSize,
                filename: item.document.filePath,
                id: item.document.id,
                url: item.url
              }
            )
          })
        }
        this.formLoading = false
      })
    },
    goBack() {
      this.$emit('close')
    },
    handleConfirm(value) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // if (!this.linesList.length) {
          //   this.$message({
          //     message: '请添加项目',
          //     type: 'error',
          //     duration: 1500,
          //   })
          //   return
          // }
          this.dataForm.documentStatus = value
          if (this.datafilelist.length) {
            this.datafilelist.map((item, index) => {
              item.bimAttachments = {
                businessType: 'system_attachment',
                configKey: 'fj_gjbyrwgl',
                categoryId: this.categoryId,
                documentId: item.id,
                fileFlag: '',
                sort: index
              }
            })
          }
          let obj = {}
          this.btnLoading = true
          let formMethod = null;
          if (this.btnType == 'edit') {
            obj = {
              attachmentList: this.datafilelist,
              ...this.dataForm,
              moldProdList: this.linesList
            }
            formMethod = batchModifyEquEquipmentProdMold
          } else if (this.btnType == 'add' || this.btnType == 'copy') {
            obj = {
              attachmentList: this.datafilelist,
              triggerSetting: this.dataForm,
              // equipmentIdList: this.dataFormOne.productData.map(item => item.id),
              triggerSettingLineList: this.linesList
            }
            formMethod = maintenanceTriggerSetting
          }
          formMethod(obj).then(res => {
            let msg = "";
            if (formMethod == maintenanceTriggerSetting) {
              msg = "新建成功"
            } else if (value == 'draft') {
              msg = "保存成功"
            } else if (value == 'submit') {
              msg = '提交成功'
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
          }).catch(() => {
            this.btnLoading = false
          })

        }
      })
    },

    // 对应子数据新增或删除行
    addOrDelLinesItem(data) {
      let type = Array.isArray(data) ? 'Array' : 'Object'

      if (type === 'Object') {
        this.linesList.splice(data.$index, 1)
      } else {
        let tempList = JSON.parse(JSON.stringify(this.linesList))
        let hasItemList = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i]
          const hasFlag = this.linesList.some((i) => item.id === i.id)
          if (hasFlag) {
            hasItemList.push(item.name)
          } else {
            tempList.push(item)
          }
          if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
        }
        this.linesList = JSON.parse(JSON.stringify(tempList))
        this.$nextTick(() => {
          this.$refs.tableFormRef.setDefaultValue()
        })
      }
    },
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-tabs__header {
  margin-bottom: 5px !important;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .data-form {
  margin-bottom: 18px;

  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:last-child {
  padding-right: 0 !important;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
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

::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>