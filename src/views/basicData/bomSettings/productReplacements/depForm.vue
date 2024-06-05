<template>
  <el-dialog title="新建产品替代件" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px" @close="handleClose">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRules" label-position="top"
      label-width="120px">
      <el-row :gutter="30">
        <el-col :span="12">

          <el-form-item label="产品名称" prop="name" ref="name">
            <ComSelect-page :listDataFormatting="listDataFormatting" ref="productRef" :searchList="ProductTableSearchList" :isdisabled="abledShow ? false : true"
              v-model="dataForm.name" placeholder="请选择产品名称" auth @change="onOrganizeChangeThree" :title="'选择产品'"
              :listMethod="getProductList" :requestObj="requestObj" :methodArr="ProductMethodArr"
              :listRequestObj="ProductListRequestObj" :tableItems="ProductTableItems" treeTitle="产品分类" :paramsObj="{}" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="产品编码" prop="code">
            <el-input placeholder="请输入产品编码" readonly disabled v-model="dataForm.code"></el-input>
          </el-form-item>
        </el-col>






        <el-col :span="24">
          <el-form-item label-width="0">
            <el-table :data="dataFormTwo" size='mini' height="200" id="table">
              <el-table-column type="index" width="60" label="序号" align="center" />
              <el-table-column prop="ncode" label="替代产品编码">
                <template slot-scope="{row}">
                  <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                    <el-form-item prop="ncode" :style="row.cssObj" ref="ncode">
                      <el-input disabled v-model="row.ncode" placeholder="请选择替代产品编码" clearable maxlength="20"></el-input>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="nname" label="替代产品名称">

                <template slot-scope="{row}">
                  <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                    <el-form-item prop="nname" :style="row.cssObj" ref="nname">
                      <el-input disabled v-model="row.nname" placeholder="请选择替代产品名称" clearable maxlength="20"></el-input>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column> -->
              <el-table-column prop="nname" label="替代产品名称">
                <template slot="header">
                  <span class="required">*</span>替代产品名称
                </template>
                <template slot-scope="scope">
                  <el-form :ref="`tableForm_${scope.$index}`" :model="scope.row" :rules="rulesTwo">
                    <el-form-item prop="nname" ref="targetName">
                      <ComSelect-page :listDataFormatting="listDataFormatting" :searchList="ProductTableSearchList" :ref="`compage_${scope.$index}`"
                        :isdisabled="abledShow ? false : true" v-model="scope.row.nname" placeholder="请选择替代产品名称" auth
                        @change="onOrganizeChangeTwo" :title="'选择产品'" :listMethod="getProductList"
                        :requestObj="requestObj" :methodArr="ProductMethodArr" :listRequestObj="ProductListRequestObj"
                        :tableItems="ProductTableItems" treeTitle="产品分类"
                        :paramsObj="{ scope }" />

                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="60">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="btntype ? true : false"
                    @click="deltable(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-actions" >
              <el-button @click="addtable()" v-if="!btntype" :disabled="pruductTypeVis" type="text" icon="el-icon-plus">添加</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" v-show="!btntype">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { getCooperativeData, addBimProduct, } from "@/api/basicData/index";
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
export default {
  data() {
    return {
      getProductList,
      getCooperativeData,
      visible: false,
      formLoading: false,
      btnLoading: false,
      code: '',         //客户编码
      requestObj: {
        type: "customer",
        orderItems: [{
          asc: false,
          column: 'createTime'
        }],
        pageNum: 1,

      },
      pruductType: '',
      pruductTypeVis: true,
      changeDataForm: false,
      requestObj2: {
        type: "customer",
        orderItems: [{
          asc: false,
          column: 'createTime'
        }],
        pageNum: 1,
        pageSize: -1,
      },
      ProductListRequestObj: {
        classAttribute: "",
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
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: 'input', },
        { prop: "name", label: "产品名称", type: 'input', },
        { prop: "drawingNo", label: "产品图号", type: 'input' }
      ], // 产品选择弹出框搜索条件
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '产品图号', minWidth: 0 },
        { prop: 'mainUnit', label: '主单位', minWidth: 0 },
        { prop: 'productType', label: '产品类别', minWidth: 0 },
        { prop: 'classAttributeText', label: '产品分类', minWidth: 0 }
      ],
      abledShow: true,
      // 保存编辑时已有的项目编码
      autoCode: undefined,
      dataForm: {
        nname: '',          //替代产品名称
        ncode: '',          //替代编码
        productIds: [],     //替代产品数组
        productId: '',      //产品id
        name: '',          //产品名称
        code: '',           //产品编码
        productType: '',
        changeDataForm: false,
      },
      oldData: [],
      // {
      //   "bimProductSubstitutionComparison": [
      //     {
      //       "alternativeProductId": 0,
      //       "id": 0,
      //       "productId": 0
      //     }
      //   ],
      //   "productId": ""
      // }
      productIds: [],
      ProductMethodArr: [
      { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ],
      dataFormTwo: [],
      rulesTwo: {
        targetName: [{
          required: true,
          message: '请选择产品名称',
          trigger: ['change']
        }],
        nname: [{ required: true, message: '请选择替代产品', trigger: 'change' }],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      btntype: false,
      dataRules: {
        name: [{ required: true, message: '请选择产品', trigger: 'change' }],
      }
    }
  },
  created() {
  },
  methods: {
    handleClose() {
      this.pruductTypeVis = true
    },
    // ProductDataFormatting(res){
    //   console.log(res,'树形');
    // },
    // listDataFormatting(res){
    //   console.log(res,'产品列表');
    // },
    onOrganizeChangeThree(val, data) {
      this.$refs['dataForm'].validateField('name')
      if (!data || !data.length) return
      console.log(data, '产品产品');
      if (data[0].all) {
        this.dataForm.code = data[0].all.code
        this.dataForm.productType = data[0].all.productType
        this.pruductTypeVis = false
      } else {
        this.pruductTypeVis = false
        this.dataForm.productType = ''
      }
      // 数据存在 并且其productType不一样的时候 
      if (this.odlData) {
        if (this.odlData[0].all.productType != this.dataForm.productType) {
          this.odlData = [...this.odlData]
          console.log(this.odlData, 'this.odlData');
        } else {
          this.odlData = data
        }
      } else {
        this.odlData = data    // 旧数据
      }


      this.dataForm.productId = data[0].id
      this.dataForm.name = data[0].name
      if (this.dataFormTwo.length > 0) {
        this.dataFormTwo.forEach((item, index) => {
          if (item.alternativeProductId === this.dataForm.productId) {
            this.dataForm.name = ''
            // this.$refs['productRef'].setDefault()
            this.$refs['dataForm'].validateField('name')
            this.$message.error('选择的替代产品与当前产品重复')
            this.dataForm.productId = ''
            this.dataForm.code = ''
          }
        })
      }
      if (this.dataFormTwo.length > 0) {
        this.dataFormTwo.forEach((item, index) => {
          if (this.dataForm.productType != item.productType) {
            this.$confirm(`当前产品类别与替代产品类别不一致，是否替换`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$message({
                type: 'success',
                message: '继续成功!'
              });
              this.dataFormTwo = []
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });
              console.log(this.odlData, 'this.odlData');
              // this.dataForm.changeDataForm = true
              this.$nextTick(()=>{

                this.dataForm.productId = this.odlData[0].id
                this.dataForm.code = this.odlData[0].all.code
                this.dataForm.name = this.odlData[0].name
                this.dataForm.productType = this.odlData[0].all.productType
              })
            });
          }
        })
      }

    },
    // 选择产品名称的弹框
    onOrganizeChangeTwo(val, data, paramsObj) {
      if (!data || !data.length) return
      console.log(data);
      console.log(paramsObj,'1111');
      // return
      this.$nextTick(() => {
        // 重新校验指定选择框，其他内容不做操作
        console.log(this.$refs['tableForm_' + paramsObj.scope.$index]);
        this.$refs['tableForm_' + paramsObj.scope.$index].validateField('nname')
   
      })
      let index = paramsObj.scope.$index
      console.log(index,'索引');
      if (data.length) {

        this.dataFormTwo[index].alternativeProductId = data[0].id    //产品id
        if (data[0].all) {
  
          this.dataFormTwo[index].productType = data[0].all.productType
        }
      }

      console.log(this.dataFormTwo[index].productType, '产品类型');
      if (this.dataForm.productType === this.dataFormTwo[index].productType) {

        if (this.dataFormTwo[index].alternativeProductId === this.dataForm.productId) {
          // this.$refs['compage'].setDefault()
          this.dataFormTwo[index].alternativeProductId = ''
          this.dataFormTwo[index].ncode = '' // 物料编码
          this.dataFormTwo[index].nname = ''
          this.$refs['compage_' + index].innerValue = ''
          this.$message.error('选择的替代产品与当前产品重复')
          // console.log(this.$refs['compage'].setDefault());
          console.log(this.dataFormTwo[index]);
        } else {
          this.dataFormTwo[index].alternativeProductId = data[0].id    //产品id
          this.dataFormTwo[index].ncode = data[0].all.code   // 物料编码
          this.dataFormTwo[index].nname = data[0].all.name
        }
      } else {
        this.$nextTick(() => {
          this.dataFormTwo[index].alternativeProductId = ''
          this.dataFormTwo[index].ncode = '' // 物料编码
          this.dataFormTwo[index].nname = ''
          this.$message.error('请选择产品类别一致的产品')
        })
      }

     console.log(this.dataFormTwo,'this.dataFormTwo');
      const codeOneItems = this.dataFormTwo.filter(item => item.nname === data[0].name);
      console.log(codeOneItems);
        const hasCodeOneMoreThanOnce = codeOneItems.length >= 2;
        if (hasCodeOneMoreThanOnce) {
          console.log(index);
          this.dataFormTwo[index].alternativeProductId = ''    //产品id
          this.dataFormTwo[index].ncode = ''  // 物料编码
          this.dataFormTwo[index].nname = ''  // 物料编码
          console.log(this.dataFormTwo,'this.dataFormTwo');
          this.$refs['compage_' + index].innerValue = ''
          this.$message.error('当前选择的替代产品已经存在此产品了')
          
        }
        console.log(this.dataFormTwo,'this.dataFormTwo');
     
    },
    listDataFormatting(res){
      console.log(res);
      res.data.records.forEach((item,index)=>{
        if(item.productType === 'pt001'){
          item.productType = '胶管总成'
        }else if (item.productType === 'pt002'){
          item.productType = '钢管总成'
        }else if (item.productType === 'pt003'){
          item.productType = '胶管'
        }else if (item.productType === 'pt004'){
          item.productType = '套筒'
        }else if (item.productType === 'pt005'){
          item.productType = '过渡接头总成'
        }else if (item.productType === 'pt006'){
          item.productType = '软管接头总成'
        }else if (item.productType === 'pt007'){
          item.productType = '过渡接头'
        }else if (item.productType === 'pt008'){
          item.productType = '软管接头'
        }
      })
      return res.data.records
    },
    addtable() {
      let ind = this.dataFormTwo.length
      let item = {
        index: ind,
        nname: "",
        alternativeProductId:'',
        targetUnitCode: "",
        cssObj: {}
      }
      this.dataFormTwo.push(item)

    },
    deltable(index) {
      this.dataFormTwo.splice(index, 1);
      this.abledShow = true
      console.log(this.dataFormTwo,'删除');
    },
    init() {
      this.abledShow = true
      this.dataForm.productId = ''
      this.dataForm.name = ''
      this.dataForm.code = ''
      this.dataFormTwo = []
      this.autoCode = undefined
      this.visible = true
      this.btntype = false
      // this.dataForm.id = id || ''
      // this.formLoading = true

    },

    dataFormSubmit() {
      let queryData = {
        bimProductSubstitutionComparison: this.dataFormTwo,
        productId: this.dataForm.productId,
      }
      let msg = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.dataFormTwo);
          if (this.dataFormTwo.length === 0) {
            this.$message.error('未选择替代产品')
          } else {

            this.dataFormTwo.forEach((item, index) => {
              if (item.nname === '') {
                msg = false
                this.$message({
                  type: 'error',
                  message: `替代产品:第${index + 1}条替代产品名称不能为空`,
                  duration: 1500,
                })
              }
            })
            if (msg) {
              this.btnLoading = true;
              let formMethod = addBimProduct
              formMethod(queryData).then(res => {
                console.log(666, res);
                let msg = "新建成功"
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
          }

        }
      })

    }
  }
}
</script>
<style scoped>
::v-deep #table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.required {
  color: red;
  margin-right: 4px;
}
</style>
