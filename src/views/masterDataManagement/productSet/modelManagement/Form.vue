<template>
  <el-dialog :title="dialogTitle" :close-on-click-modal="false" append-to-body :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center" lock-scroll width="1000px">
    <el-row :gutter="15" class="" v-loading="loading">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
        <template>

          <el-col :span="12">
            <el-form-item label="型号" prop="model" ref="model">
              <el-input v-model="dataForm.model" placeholder="请输入型号" clearable :style='{ "width": "100%" }' :disabled="btnType=='add'?false:true"
                maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内圈" prop="innerCircleId" ref="innerCircleId">
              <el-input readonly placeholder="请选择产品" :disabled="btnType == 'look' ? true : false"
                      v-model="dataForm.innerCircleId" @focus="openProductDialog"></el-input>
                      <ComSelect-page  ref="productRef" :searchList="ProductTableSearchList"  
              v-model="dataForm.innerCircleId" placeholder="请选择产品" auth @change="onOrganizeChangeThree" :title="'选择产品'"
              :listMethod="getProductList" :requestObj="requestObj" :methodArr="ProductMethodArr"
              :listRequestObj="ProductListRequestObj" :tableItems="ProductTableItems" treeTitle="产品分类" :paramsObj="{}" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外圈" prop="outerCircleId" ref="outerCircleId">
              <el-input readonly placeholder="请选择产品" :disabled="btnType == 'look' ? true : false"
                      v-model="dataForm.outerCircleId" @focus="openProductDialog"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="钢球型号" prop="steelBallId" ref="steelBallId">
              <el-input readonly placeholder="请选择产品" :disabled="btnType == 'look' ? true : false"
                      v-model="dataForm.steelBallId" @focus="openProductDialog"></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="钢球用量" prop="steelBallNum" ref="steelBallNum">
              <el-input  placeholder="请输入钢球用量" :disabled="btnType == 'look' ? true : false"
                      v-model="dataForm.steelBallNum" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="油脂用量" prop="oilNum" ref="oilNum">
              <el-input  placeholder="请输入油脂用量" :disabled="btnType == 'look' ? true : false"
                      v-model="dataForm.oilNum" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保持架用量" prop="holderNum" ref="holderNum">
              <el-input  placeholder="请输入保持架用量" :disabled="btnType == 'look' ? true : false"
                      v-model="dataForm.holderNum" ></el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false"> 取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading"> 提 交</el-button>
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
  addBimProductsModel
} from "@/api/masterDataManagement/index";
import {
  getcategoryTree,
} from "@/api/basicData/materialSettings";
export default {
  data() {
    return {
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: 'input', },
        { prop: "name", label: "产品名称", type: 'input', },
        { prop: "drawingNo", label: "产品图号", type: 'input' }
      ], // 产品选择弹出框搜索条件
      ProductMethodArr: [
      { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ],
      ProductListRequestObj: {
        classAttribute: "material",
        classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        productSource: 'purchase',
        productStatus: "enable",
        pageNum: 1,
        pageSize: 20,
      },
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '产品图号', minWidth: 0 },
        { prop: 'mainUnit', label: '主单位', minWidth: 0 },
        { prop: 'productType', label: '产品类别', minWidth: 0 },
        { prop: 'classAttributeText', label: '产品分类', minWidth: 0 }
      ],
      requestObj: {
        type: "",
        orderItems: [{
          asc: false,
          column: 'createTime'
        }],
        pageNum: 1,

      },
      dialogTitle: '',
      visible: false,
      loading: false,
      btnLoading: false,
      addButtonFlag: true,
      parentData: [],
      dataForm: {
        id: "",
        steelBallNum:"",
        steelBallId:"",
        outerCircleId:"",
        oilNum:"",
        model:"",
        innerCircleId:"",
        holderNum:"",
      },
      dataFormTwo: [],
      dataFormTwoTemp: [],
      rules: {
        model: [{
          required: true,
          message: '请输入型号',
          trigger: ['blur']
        },{
          validator: (rule, value, callback) => {
            // 没有value不进行此校验
            if (!value) { callback() }
            else if (this.dataForm.model === this.autoModel) { callback() }
            else {
              updataBimProductsModelCheck(this.dataForm.model).then((res) => {
                if (!res.data) { callback() }
                else { callback(new Error('当前属性编码已存在')) }
              }).catch((err) => { callback(new Error(" ")) })
            }
          },
          trigger: 'blur'
        }],
        innerCircleId: [{
          required: true,
          message: '请选择内圈',
          trigger: ['blur']
        }, ],
        outerCircleId: [{
          required: true,
          message: '请选择外圈',
          trigger: ['blur']
        }],
        steelBallId: [{
          required: true,
          message: '请选择钢球型号',
          trigger: ['blur']
        }],
        steelBallNum: [{
          required: true,
          message: '请输入钢球用量',
          trigger: ['blur']
        },{
          validator:this.formValidate('number'),
          trigger: ['blur']
        }],
        oilNum: [{
          required: true,
          message: '请输入油脂用量',
          trigger: ['blur']
        },{
          validator:this.formValidate('number'),
          trigger: ['blur']
        }],
        holderNum: [{
          required: true,
          message: '请输入保持架用量',
          trigger: ['blur']
        },{
          validator:this.formValidate('number'),
          trigger: ['blur']
        }],
      },
      
    
      autoModel:"",
      btnType:"",
    }
  },
 
  methods: {
    









    clearData() {
      this.dataForm = {
        id: "",
        attributeItemName: "", // 属性选择项名称
        attributeItemVal: "", // 属性选择项值
        businessCode: "product", // 业务编码 - product（产品）
        code: "",
        name: "",
        type: ""
      }
      this.dataFormTwo = [];
    },
    init(id, type) {
      this.btnType = type
      this.dataForm.id = id ? id : ""
      this.dialogTitle = id ? '修改型号' : '新增型号'
      this.visible = true;
      this.autoModel = undefined
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields();
        if(this.btnType=='edit'){
          getbimProductsModelInfo(this.dataForm.id).then(res=>{
            console.log("详情",res);
          })
        }
        return
        if (this.dialogTitle === "新增属性") { this.clearData() }
        else {
          this.loading = true
          // 获取当前项详情
          detailattribute(id).then(res => {
            this.dataForm = res.data
            this.dataFormTwo = []
            this.autoCode = res.data.code
            this.loading = false
            let tempName, tempVal
            if (res.data.attributeItemName === "") { return }
            else if (!res.data.attributeItemName.includes(',')) {
              tempName = [res.data.attributeItemName]
              tempVal = [res.data.attributeItemVal]
            } else {
              tempName = res.data.attributeItemName.split(',')
              tempVal = res.data.attributeItemVal.split(',')
            }
            for (let i = 0; i < tempName.length; i++) { this.dataFormTwo.push({ index: i, itemKey: tempName[i], itemVal: tempVal[i] }) }
          })
        }
      });
      // this.$store.commit('generator/UPDATE_RELATION_DATA', {})
    },
    // 表单提交
    async dataFormSubmit() {
      this.btnLoading = true
      // 一些校验的方法
      let isOk = true // 决定是否满足发送请求的条件
      let focu = true // 判断自动聚焦是否已经使用了

      // 校验dataForm
      // 聚焦到dataForm第一个校验失败的dom
      let focusFirstChild = (el) => {
        if (el && el.nodeType === 1) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { el.focus() }
          else {
            const children = el.childNodes;
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              if (child.nodeType === 1) {
                focusFirstChild(child);
                break;
              }
            }
          }
        }
      }
      let valid = await this.$refs['elForm'].validate().catch(() => false)
      if (!valid) {
        isOk = false
        focu = false
        // 表单验证失败，聚焦到第一个验证失败的表单项
        for (let i = 0; i < this.formItems.length; i++) {
          const formItem = this.$refs[this.formItems[i].ref];
          if (formItem.validateState === 'error') {
            focusFirstChild(formItem.$children[1].$el)
            break
          }
        }
      }


      // 校验tableForm
      // 生成一个对应多个ratio和targetName的数组
      let refTotal = this.dataFormTwo.length
      for (let i = 0; i < refTotal; i++) {
        let refList = [this.$refs['tableForm_1_' + i], this.$refs['tableForm_2_' + i]]
        refList.forEach(item => {
          item.validate(valid => {
            if (!valid) {
              if (focu) {
                if (item.$children[0].validateMessage == "请选择属性类型") {
                  // 聚焦并展开el-select
                  // item.$children[0].focus()
                  // item.$children[0].showPopper()
                  // item.$children[0].showMessage()
                }
                item.$el[0].focus()
                focu = false
              }
              isOk = false
            }
          })
        })
      }

      if (isOk) {
        // 表单验证通过，处理数据关系后提交表单
        let attributeItemName = ""
        let attributeItemVal = ""
        this.dataFormTwo.forEach(item => {
          attributeItemName += item.itemKey + ','
          attributeItemVal += item.itemVal + ','
        })
        attributeItemName = attributeItemName.slice(0, attributeItemName.length - 1)
        attributeItemVal = attributeItemVal.slice(0, attributeItemVal.length - 1)
        this.dataForm = { ...this.dataForm, attributeItemName, attributeItemVal, businessCode: "product" }
        this.request()
      } else {
        this.btnLoading = false
      }

    },

  
    
    
  },
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>