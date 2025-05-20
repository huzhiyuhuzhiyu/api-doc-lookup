<template>
  <el-dialog :title="dialogTitle" :close-on-click-modal="false" append-to-body :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center" lock-scroll width="600px" @close="close">
    <el-row :gutter="15" class="" v-loading="loading">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
        <template>
          <el-col :span="12">
            <el-form-item label="型号" prop="model" ref="model">
              <el-input v-model="dataForm.model" placeholder="请输入型号" clearable :style="{ width: '100%' }"
                :disabled="btnType == 'add' ? false : true" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内圈" prop="innerCircle" ref="innerCircle">
              <ComSelect-page ref="productRef" :searchList="ProductTableSearchList" :value="dataForm.innerCircle"
                placeholder="请选择产品" auth @change="onOrganizeChangeThree1" :title="'选择产品'" :listMethod="getProductList"
                :requestObj="requestObj" :methodArr="ProductMethodArr" :listRequestObj="ProductListRequestObj"
                :tableItems="ProductTableItems" treeTitle="产品分类" :paramsObj="{}" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外圈" prop="outerCircle" ref="outerCircle">
              <ComSelect-page ref="productRef" :searchList="ProductTableSearchList" :value="dataForm.outerCircle"
                placeholder="请选择产品" auth @change="onOrganizeChangeThree2" :title="'选择产品'" :listMethod="getProductList"
                :requestObj="requestObj" :methodArr="ProductMethodArr" :listRequestObj="ProductListRequestObj"
                :tableItems="ProductTableItems" treeTitle="产品分类" :paramsObj="{}" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="钢球型号" prop="steelBall" ref="steelBall">
              <ComSelect-page ref="productRef" :searchList="ProductTableSearchList" :value="dataForm.steelBall"
                placeholder="请选择产品" auth @change="onOrganizeChangeThree3" :title="'选择产品'" :listMethod="getProductList"
                :requestObj="requestObj" :methodArr="ProductMethodArr" :listRequestObj="ProductListRequestObj"
                :tableItems="ProductTableItems" treeTitle="产品分类" :paramsObj="{}" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密封圈" prop="sealingRing" ref="sealingRing">
              <ComSelect-page ref="productRef" :searchList="ProductTableSearchList" :value="dataForm.sealingRing"
                placeholder="请选择产品" auth @change="onOrganizeChangeThree4" :title="'选择产品'" :listMethod="getProductList"
                :requestObj="requestObj" :methodArr="ProductMethodArr" :listRequestObj="ProductListRequestObj"
                :tableItems="ProductTableItems" treeTitle="产品分类" :paramsObj="{}" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="钢球用量" prop="steelBallNum" ref="steelBallNum">
              <el-input placeholder="请输入钢球用量" :disabled="btnType == 'look' ? true : false"
                v-model="dataForm.steelBallNum" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="油脂用量" prop="oilNum" ref="oilNum">
              <el-input placeholder="请输入油脂用量" :disabled="btnType == 'look' ? true : false"
                v-model="dataForm.oilNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保持架用量" prop="holderNum" ref="holderNum">
              <el-input placeholder="请输入保持架用量" :disabled="btnType == 'look' ? true : false"
                v-model="dataForm.holderNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密封圈用量" prop="sealingRingNum" ref="sealingRingNum">
              <el-input placeholder="请输入密封圈用量" :disabled="btnType == 'look' ? true : false"
                v-model="dataForm.sealingRingNum"></el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">提 交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  updataBimProductsModelCheck,
  getbimProductsModelInfo,
  updataBimProductsModel,
  delBimProductsModel,
  getbimProductsModelList,
  addBimProductsModel,
  addBimProducts
} from '@/api/masterDataManagement/index'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getProductList } from '@/api/masterDataManagement/productManage' // 产品列表
export default {
  data() {
    return {
      getProductList,
      ProductTableSearchList: [
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productDrawingNo', label: '品名规格', type: 'input' }
      ], // 产品选择弹出框搜索条件
      ProductMethodArr: [
        { label: '物料分类', classAttribute: '', method: getcategoryTree, requestObj: { classAttribute: '' } }
      ],
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
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        // { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '品名规格', minWidth: 0 },
        { prop: 'mainUnit', label: '单位', minWidth: 0 }
        // { prop: 'productType', label: '产品类别', minWidth: 0 },
        // { prop: 'classAttributeText', label: '产品分类', minWidth: 0 }
      ],
      requestObj: {
        type: '',
        orderItems: [
          {
            asc: false,
            column: 'createTime'
          }
        ],
        pageNum: 1
      },
      dialogTitle: '',
      visible: false,
      loading: false,
      btnLoading: false,
      addButtonFlag: true,
      parentData: [],
      dataForm: {
        id: '',
        steelBallNum: '',
        steelBallId: '',
        outerCircleId: '',
        oilNum: '',
        model: '',
        innerCircleId: '',
        holderNum: '',
        innerCircle: '',
        outerCircle: '',
        steelBall: ''
      },
      dataFormTwo: [],
      dataFormTwoTemp: [],
      rules: {
        model: [
          {
            required: true,
            message: '请输入型号',
            trigger: ['blur']
          },
          {
            validator: (rule, value, callback) => {
              // 没有value不进行此校验
              if (!value) {
                callback()
              } else if (this.dataForm.model === this.autoModel) {
                callback()
              } else {
                updataBimProductsModelCheck(this.dataForm.model)
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
        innerCircle: [
          {
            required: true,
            message: '请选择内圈',
            trigger: ['chang']
          }
        ],
        outerCircle: [
          {
            required: true,
            message: '请选择外圈',
            trigger: ['chang']
          }
        ],
        steelBall: [
          {
            required: true,
            message: '请选择钢球型号',
            trigger: ['chang']
          }
        ],
        steelBallNum: [
          {
            required: true,
            message: '请输入钢球用量',
            trigger: ['blur']
          },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "请输入正确的钢球用量(最多保留2位小数,整数18位)", (errMsg, index) => { this.$message.error(`${errMsg}`) }] }), trigger: 'blur' },
          {
            validator: this.formValidate('number'),
            trigger: ['blur']
          }
        ],
        oilNum: [
          {
            required: true,
            message: '请输入油脂用量',
            trigger: ['blur']
          },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "请输入正确的油脂用量(最多保留2位小数,整数18位)", (errMsg, index) => { this.$message.error(`${errMsg}`) }] }), trigger: 'blur' },
          {
            validator: this.formValidate('number'),
            trigger: ['blur']
          }
        ],
        holderNum: [
          {
            required: true,
            message: '请输入保持架用量',
            trigger: ['blur']
          },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "请输入正确的保持架用量(最多保留2位小数,整数18位)", (errMsg, index) => { this.$message.error(`${errMsg}`) }] }), trigger: 'blur' },
          {
            validator: this.formValidate('number'),
            trigger: ['blur']
          }
        ],
        sealingRingNum:[
          {
            required: true,
            message: '请输入密封圈用量',
            trigger: ['blur']
          },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "请输入正确的密封圈用量(最多保留2位小数,整数18位)", (errMsg, index) => { this.$message.error(`${errMsg}`) }] }), trigger: 'blur' },
          {
            validator: this.formValidate('number'),
            trigger: ['blur']
          }
        ],
      },

      autoModel: '',
      btnType: ''
    }
  },

  methods: {
    onOrganizeChangeThree2(val, data) {
      // this.$refs['elForm'].validateField('outerCircleName')
      if (!data || !data.length) return
      console.log(data, '产品产品')
      if (data[0].all) {
        this.dataForm.outerCircleId = data[0].all.id
        this.dataForm.outerCircle = data[0].all.drawingNo
      } else {
      }
    },
    onOrganizeChangeThree1(val, data) {
      // this.$refs['elForm'].validateField('innerCircleName')
      if (!data || !data.length) return
      console.log(data, '产品产品')
      if (data[0].all) {
        this.dataForm.innerCircleId = data[0].all.id
        this.dataForm.innerCircle = data[0].all.drawingNo
      } else {
      }
    },
    onOrganizeChangeThree3(val, data) {
      // this.$refs['elForm'].validateField('steelBallName')

      if (!data || !data.length) return
      console.log(data, '产品产品')
      if (data[0].all) {
        this.dataForm.steelBallId = data[0].all.id
        this.dataForm.steelBall = data[0].all.drawingNo
      } else {
      }
    },
    onOrganizeChangeThree4(val, data) {
      // this.$refs['elForm'].validateField('steelBallName')

      if (!data || !data.length) return
      console.log(data, '产品产品')
      if (data[0].all) {
        this.dataForm.sealingRingId = data[0].all.id
        this.dataForm.sealingRing = data[0].all.drawingNo
      } else {
      }
    },

    clearData() {
      this.dataForm = {
        id: '',
        attributeItemName: '', // 属性选择项名称
        attributeItemVal: '', // 属性选择项值
        businessCode: 'product', // 业务编码 - product（产品）
        code: '',
        name: '',
        type: ''
      }
      this.dataFormTwo = []
    },
    init(id, type) {
      this.btnType = type
      this.dataForm.id = id ? id : ''
      this.dialogTitle = id ? '修改型号' : '新增型号'
      this.visible = true
      this.autoModel = undefined
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (this.btnType == 'edit') {
          getbimProductsModelInfo(this.dataForm.id).then((res) => {
            console.log('详情', res)
            this.dataForm = res.data
            this.autoModel = res.data.model
          })
        }
      })
      // this.$store.commit('generator/UPDATE_RELATION_DATA', {})
    },
    // 表单提交
    async dataFormSubmit() {
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          console.log(this.dataForm)
          let arr = []
          arr[0] = this.dataForm
          let formMethod = this.dataForm.id ? updataBimProductsModel : addBimProductsModel
          formMethod(arr)
            .then((res) => {
              let msg = formMethod === updataBimProductsModel ? '编辑成功' : '新增成功'
              this.$message.success(msg)
              this.visible = false
              this.btnLoading = false
              this.$emit('refresh', true)
            })
            .catch((error) => {
              this.btnLoading = false
            })
        }
      })
    },
    close() {
      this.visible = false
      this.$emit('refresh', true)
    }
  }
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>
