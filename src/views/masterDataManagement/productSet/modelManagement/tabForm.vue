<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header']">
        <el-page-header @back="goBack" :content="btnType === 'edit' ? '批量修改型号' : '批量新建型号'" />
        <div class="options">
          <el-button size="mini" type="primary" :loading="btnLoading" @click="dataFormSubmit()"
            v-if="btnType !== 'look'">
            提交
          </el-button>
          <el-button size="mini" @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <JNPFColTable v-model="sleeveList" ref="sleeveForm" :tableItems="sleeveItems" :openMode="openMode"
          v-if="btnType == 'edit'" />
        <JNPFColTable v-model="sleeveList" ref="sleeveForm" :tableItems="sleeveItems" :openMode="openMode" v-else
          @deleteth="deleteFun" @addth="addFun" />
      </div>
    </div>
  </transition>
</template>

<script>
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getProductList } from '@/api/masterDataManagement/productManage' // 产品列表
import {
  updataBimProductsModelCheck,
  getbimProductsModelInfo,
  updataBimProductsModel,
  delBimProductsModel,
  getbimProductsModelList,
  addBimProductsModel,
  addBimProducts
} from '@/api/masterDataManagement/index'
import JNPFColTable from './JNPFColTable/index.vue'
export default {
  components: {
    JNPFColTable
  },
  data() {
    return {
      getProductList,
      openMode: '只读',
      dialogTitle: '',
      sleeveList: [],
      sleeveItems: [
        {
          prop: 'model',
          label: '型号',
          value: '',
          type: 'input',
          readOnly: true,
          itemRules: [
            { required: true, message: '型号不能为空', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                // 没有value不进行此校验
                if (!value) {
                  callback()
                } else {
                  let id = ''
                  let result = this.sleeveList.find((item) => item.model === value)
                  if (result) {
                    id = result.id
                  } else {
                    console.log('未找到匹配的对象')
                  }
                  console.log(id, ';o')
                  console.log('rule,', rule, value, this.sleeveList)
                  updataBimProductsModelCheck(value, id)
                    .then((res) => {
                      if (!res.data) {
                        callback()
                      } else {
                        callback(new Error('当前型号已存在'))
                      }
                    })
                    .catch((err) => {
                      callback(new Error(' '))
                    })
                }
              },
              trigger: 'blur'
            }
          ],
          minWidth: 140,
        },
        {
          prop: 'innerCircle',
          label: '内圈',
          value: '',
          type: 'custom',
          customComponent: 'ComSelect-page',
          itemRules: [{ required: true, trigger: 'change' }],
          minWidth: 140,

        },
        {
          prop: 'outerCircle',
          label: '外圈',
          value: '',
          type: 'custom',
          customComponent: 'ComSelect-page',
          itemRules: [{ required: true, trigger: 'blur' }],
          minWidth: 140
        },
        {
          prop: 'steelBall',
          label: '钢球型号',
          value: '',
          type: 'custom',
          customComponent: 'ComSelect-page',
          itemRules: [{ required: true, trigger: 'blur' }],
          minWidth: 180
        },
        {
          prop: 'sealingRing',
          label: '密封圈',
          value: '',
          type: 'custom',
          customComponent: 'ComSelect-page',
          itemRules: [{ required: true, trigger: 'blur' }],
          minWidth: 160
        },
        {
          prop: 'steelBallNum',
          label: '钢球用量(粒)',
          value: '',
          type: 'input',
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '不能为空',
                  (errMsg, index) => {
                    this.$message.error(`基础信息第${index + 1}，钢球用量${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            },
            // { validator: this.formValidate({ type: "decimal", params: [20, 2, (errMsg,index) => { this.$message.error(`第${index + 1}行钢球：` + '请输入正确的数量(最多保留2位小数,整数18位)') }], }), trigger: "blur", },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "请输入正确的钢球用量(最多保留2位小数,整数18位)", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：数量${errMsg}`) }] }), trigger: 'blur' },
            { required: true, message: '钢球用量不能为空', trigger: 'blur' },
          ],
          minWidth: 130
        },
        {
          prop: 'oilNum',
          label: '油脂用量(毫克)',
          value: '',
          type: 'input',
          itemRules: [
            { required: true, message: '油脂用量不能为空', trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "请输入正确的油脂用量(最多保留2位小数,整数18位)", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：数量${errMsg}`) }] }), trigger: 'blur' },
          ],
          minWidth: 160
        },
        {
          prop: 'holderNum',
          label: '保持架用量(个)',
          value: 0,
          type: 'input',
          itemRules: [
            { required: true, message: '保持架用量不能为空', trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "请输入正确的保持架用量(最多保留2位小数,整数18位)", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：数量${errMsg}`) }] }), trigger: 'blur' },


          ],
          minWidth: 160
        },
        {
          prop: 'sealingRingNum',
          label: '密封圈用量(个)',
          value: 0,
          type: 'input',
          itemRules: [{ required: true, message: '密封圈用量不能为空', trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "请输入正确的密封圈用量(最多保留2位小数,整数18位)", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：数量${errMsg}`) }] }), trigger: 'blur' },


          ],
          minWidth: 160
        }
      ],
      visible: false,
      btnLoading: false,
      formLoading: false,
      btnType: '',
      ProductListRequestObj: {
        classAttribute: '',

        productCategoryId: '',
        code: '',
        name: '',
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
        productSource: '',
        productStatus: 'enable',
        pageNum: 1,
        pageSize: 20
      },
      ProductListRequestObj1: {
        classAttribute: 'semi_finished',
        productCategoryId: '1810110053677125634',
        code: '',
        name: '',
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
        productSource: '',
        productStatus: 'enable',
        pageNum: 1,
        pageSize: 20
      },
      ProductListRequestObj2: {
        classAttribute: 'semi_finished',
        productCategoryId: '1810110311719096321',
        code: '',
        name: '',
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
        productSource: '',
        productStatus: 'enable',
        pageNum: 1,
        pageSize: 20
      },
      ProductTableItems: [
        { prop: 'drawingNo', label: '型号', minWidth: 0 },
        { prop: 'code', label: '产品编码' },
        // { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'mainUnit', label: '单位', minWidth: 0 }
        // { prop: 'productType', label: '产品类别', minWidth: 0 },
        // { prop: 'classAttributeText', label: '产品分类', minWidth: 0 }
      ],
      // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: 'productDrawingNo', label: '型号', type: 'input' },
        { prop: 'productCode', label: '产品编码', type: 'input' }
      ],
      ProductMethodArr: [
        {
          label: '产品分类',
          classAttribute: '',
          method: getcategoryTree,
          requestObj: { classAttribute: '', type: 'material' }
        }
      ],
      ProductMethodArr1: [
        {
          label: '产品分类',
          classAttribute: '',
          method: getcategoryTree,
          requestObj: { classAttribute: 'semi_finished' }
        }
      ]
    }
  },

  created() { },
  methods: {
    deleteFun(row) {
      this.sleeveList.splice(row.$index, 1)
    },
    addFun() {
      let index = this.sleeveList.length
      this.sleeveList.push({
        index,
        model: '',
        holderNum: 1,
        oilNum: 1,
        steelBallNum: 1,
        sealingRingNum: 2,
        steelBall: '',
        outerCircle: '',
        innerCircle: ''
      })
    },
    async dataFormSubmit() {
      this.btnLoading = true
      let submitFlag = true // 提交可行性判断

      this.sleeveList.map((item, index) => {
        console.log(item, 'iy')
        if (!item.model) {
          submitFlag = false
          this.$message.error(`第${index + 1}行，型号为空`)
        } else if (item.model) {
          submitFlag = false
          if (this.btnType == 'add') {
            updataBimProductsModelCheck(item.model, item.id).then((res) => {
              if (!res.data) {
                submitFlag = true
              } else {
                this.$message.error(`第${index + 1}行型号已存在`)
              }
            })
          } else {
            submitFlag = true
          }

        }
        if (!item.innerCircle) {
          submitFlag = false
          this.$message.error(`第${index + 1}行内圈为空`)
        } else if (!item.outerCircle) {
          submitFlag = false
          this.$message.error(`第${index + 1}行外圈为空`)
        } else if (!item.steelBall) {
          submitFlag = false
          this.$message.error(`第${index + 1}行钢球型号为空`)
        } else if (!item.steelBallNum) {
          submitFlag = false
          this.$message.error(`第${index + 1}行钢球用量为空`)
        } else if (!item.oilNum) {
          submitFlag = false
          this.$message.error(`第${index + 1}行油脂用量为空`)
        } else if (!item.holderNum) {
          submitFlag = false
          this.$message.error(`第${index + 1}行保持架用量为空`)
        } else if (!item.sealingRingNum) {
          submitFlag = false
          this.$message.error(`第${index + 1}行密封圈用量为空`)
        }
      })

      // 校验表格表单（套筒属性）
      let sleeveForm = this.$refs['sleeveForm'].$refs.main
      let valid_3 = await sleeveForm.validate().catch((err) => false)
      if (this.btnType == 'add') {
        if (!valid_3 && submitFlag) {
          submitFlag = false
          this.jnpf.focusErrValidItem(sleeveForm.fields)
        }
      }

      console.log(submitFlag, 'submitFlag')
      // 判断条件后发送请求
      if (submitFlag) {
        const formMethod = this.btnType == 'edit' ? updataBimProductsModel : addBimProductsModel

        formMethod(this.sleeveList)
          .then((res) => {
            let msg = res.msg
            if (res.msg === 'Success') {
              msg = formMethod == addBimProductsModel ? '新建成功' : '修改成功'
            }
            this.$message({
              message: msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.goBack()
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
    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.orderDetailData = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.orderDetailData[dataOrIndex][prop] = value
      }
    },

    goBack() {
      this.$emit('refresh', true)
    },

    sleeveNameChange1(val, data, paramsObj) {
      console.log("this.$refs['sleeveForm'].$children[0].fields",this.$refs['sleeveForm'].$children[0].fields[paramsObj.scope.$index * this.sleeveItems.length].labelFor);
      // let prop = this.$refs['sleeveForm'].$children[0].fields[paramsObj.scope.$index * this.sleeveItems.length].labelFor
      let prop = `data.${paramsObj.scope.$index}.innerCircle`
      console.log('prop',prop);
      this.$nextTick(() => {
        this.$refs['sleeveForm'].$children[0].validateField(prop)
      })
      if (!data || !data.length) return
      let index = paramsObj.scope.$index
      console.log(data, 'uuuu')
      this.sleeveList[index].innerCircleId = data[0].id
      this.sleeveList[index].innerCircle = data[0].all.drawingNo
    },
    sleeveNameChange2(val, data, paramsObj) {
      // let prop = this.$refs['sleeveForm'].$children[0].fields[paramsObj.scope.$index * this.sleeveItems.length].labelFor
      let prop = `data.${paramsObj.scope.$index}.outerCircle`
      this.$nextTick(() => {
        this.$refs['sleeveForm'].$children[0].validateField(prop)
      })
      if (!data || !data.length) return
      let index = paramsObj.scope.$index
      this.sleeveList[index].outerCircleId = data[0].id
      this.sleeveList[index].outerCircle = data[0].all.drawingNo
    },
    sleeveNameChange3(val, data, paramsObj) {
      // let prop = this.$refs['sleeveForm'].$children[0].fields[paramsObj.scope.$index * this.sleeveItems.length].labelFor
      let prop = `data.${paramsObj.scope.$index}.steelBall`
      this.$nextTick(() => {
        this.$refs['sleeveForm'].$children[0].validateField(prop)
      })
      if (!data || !data.length) return
      let index = paramsObj.scope.$index
      this.sleeveList[index].steelBallId = data[0].id
      this.sleeveList[index].steelBall = data[0].all.drawingNo
    },
    sleeveNameChange4(val, data, paramsObj) {
      // let prop = this.$refs['sleeveForm'].$children[0].fields[paramsObj.scope.$index * this.sleeveItems.length].labelFor
      let prop = `data.${paramsObj.scope.$index}.sealingRing`
      this.$nextTick(() => {
        this.$refs['sleeveForm'].$children[0].validateField(prop)
      })
      if (!data || !data.length) return
      let index = paramsObj.scope.$index
      this.sleeveList[index].sealingRingId = data[0].id
      this.sleeveList[index].sealingRing = data[0].all.drawingNo
    },
    init(data, type) {
      this.btnType = type
      this.visible = true
      this.sleeveList = []
      this.dialogTitle = type == 'edit' ? '批量修改产品型号' : '批量新建产品型号'
      this.sleeveList = data || []
      if (this.btnType == 'edit') {
        this.openMode = '编辑'
        this.sleeveList.forEach((item, index) => {
          item.index = index
        })
      } else {
        this.openMode = '新建'
        this.sleeveList = []
        this.sleeveList.push({
          model: '',
          holderNum: 1,
          oilNum: 1,
          steelBallNum: 1,
          sealingRingNum: 2,
          steelBall: '',
          outerCircle: '',
          innerCircle: ''
        })
      }
      console.log(this.sleeveItems, 'this.sleeveItems')
      this.sleeveItems.forEach((tc) => {
        // 添加自定义表单元素方法和参数
        // 若干需要选择的产品
        if (tc.prop === 'innerCircle') {
          tc.dialogTitle = '选择产品'
          tc.treeTitle = '产品分类'
          tc.methodArr = this.ProductMethodArr
          tc.listMethod = getProductList
          tc.listRequestObj = this.ProductListRequestObj
          tc.tableItems = this.ProductTableItems
          tc.searchList = this.ProductTableSearchList
          tc.change = this.sleeveNameChange1
          // tc.paramsObj = { row: scope.row, oldVal: { code: scope.row.code || '', name: scope.row.name || '' } }
        } else if (tc.prop === 'outerCircle') {
          tc.dialogTitle = '选择产品'
          tc.treeTitle = '产品分类'
          tc.methodArr = this.ProductMethodArr
          tc.listMethod = getProductList
          tc.listRequestObj = this.ProductListRequestObj
          tc.tableItems = this.ProductTableItems
          tc.searchList = this.ProductTableSearchList
          tc.change = this.sleeveNameChange2
          // tc.paramsObj = { row: scope.row, oldVal: { code: scope.row.code || '', name: scope.row.name || '' } }
        } else if (tc.prop === 'steelBall') {
          tc.dialogTitle = '选择产品'
          tc.treeTitle = '产品分类'
          tc.methodArr = this.ProductMethodArr
          tc.listMethod = getProductList
          tc.listRequestObj = this.ProductListRequestObj
          tc.tableItems = this.ProductTableItems
          tc.searchList = this.ProductTableSearchList
          tc.change = this.sleeveNameChange3
          // tc.paramsObj = { row: scope.row, oldVal: { code: scope.row.code || '', name: scope.row.name || '' } }
        } else if (tc.prop === 'sealingRing') {
          tc.dialogTitle = '选择产品'
          tc.treeTitle = '产品分类'
          tc.methodArr = this.ProductMethodArr
          tc.listMethod = getProductList
          tc.listRequestObj = this.ProductListRequestObj
          tc.tableItems = this.ProductTableItems
          tc.searchList = this.ProductTableSearchList
          tc.change = this.sleeveNameChange4
          // tc.paramsObj = { row: scope.row, oldVal: { code: scope.row.code || '', name: scope.row.name || '' } }
        } else {
          console.log(666)
          // console.warn(tc.prop + '不在判断条件内')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .el-tabs__header {
  padding: 0 !important;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}
</style>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}
</style>
