<template>
  <transition name="el-zoom-in-center">
    <div>
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']" >
          <el-page-header @back="goBack"
            :content="btnType == 'add' ? '新建服务单' : btnType == 'edit'||operateType ? '编辑服务单' : btnType == 'look' ? '查看服务单' : '新建服务单'" />
          <div class="options">
            <!-- <el-button type="success" v-if="btnType != 'look'" size="mini" :loading="btnLoading"
              @click="handleConfirm('draft')">
              保存草稿</el-button> -->
            <el-button type="primary"  v-if="btnType != 'look'||operateType" size="mini" :loading="btnLoading"
              @click="handleConfirm('submit')">
              保存并提交</el-button>
            <el-button size="mini" @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" ref="main">

          <div  v-loading="formLoading" :element-loading-text="loadingText">
            <el-tabs v-model="activeName" @tab-click="handleClick" >
              <el-tab-pane label="基础信息" name="orderInfo">
                <el-collapse v-model="activeNames">
                  <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                      <el-row :gutter="30" class="custom-row">
                        <el-col :sm="6" :xs="24" >
                          <el-form-item label="服务单号" prop="orderNo">
                            <el-input v-model="dataForm.orderNo" placeholder="请输入服务单号"
                              :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false"
                              maxlength="300" />
                          </el-form-item>
                        </el-col>
                      
                        <el-col :sm="6" :xs="24" v-if="btnType!='look'">
                        <el-form-item label="服务商类型" prop="superType">
                            <el-select v-model="dataForm.superType" placeholder="请选择服务商类型" style="width: 100%;" @change="selectFun" :disabled="btnType=='look'">
                              <el-option v-for="item in superTypeList" size="small" :key="item.id" :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col  :sm="6" :xs="24" > 
                        <el-form-item label="服务商" prop="superType">
                             <ComSelect-page clearable :isdisabled="!dataForm.superType||btnType=='look'" :treeNodeClick="treeNodeClick"
                              v-model="dataForm.cooperativePartnerName"  ref="ComSelect-page"
                              @change="supplierdata" :tableItems="PartnerTableItems" :placeholder="'请选择服务商'"
                              title="选择服务商" treeTitle="服务商分类" :methodArr="PartnerMethodArr"
                              :listMethod="getCooperativeData" :listRequestObj="PartnerListRequestObj"
                              :paramsObj="{ oldData }" :searchList="PartnerTableSearchList" />
                          </el-form-item>
                        </el-col>

                            

                        <el-col :sm="6" :xs="24" >
                          <el-form-item label="收付款类型" prop="paymentType">
                             <el-select v-model="dataForm.paymentType" placeholder="请选择收付款类型" style="width: 100%;"  :disabled="btnType=='look'">
                              <el-option v-for="item in paymentTypeList" size="small" :key="item.id" :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                           <el-col :sm="6" :xs="24"   >
                          <el-form-item label="金额(含税)" prop="totalAmount">
                            <el-input v-model="dataForm.totalAmount" placeholder="请输入金额(含税)" type="text"   :disabled="!dataForm.paymentType||btnType=='look'"/>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24" >
                          <el-form-item label="税率(%)" prop="taxRate">
                            <el-select v-model="dataForm.taxRate" placeholder="请选择" style="width: 100%;" :disabled="btnType=='look'">
                              <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName" 
                                :value="item.taxRate"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                             
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="服务内容" prop="content">
                            <el-input v-model="dataForm.content" placeholder="请输入服务内容" :disabled="btnType=='look'"
                               type="textarea" :rows="2" maxlength="200" />
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </el-collapse-item>
 
                </el-collapse>
              </el-tab-pane>
              <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
                <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'"></UploadWj>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
  
 
        <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
          :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
          width="500px">
          <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span class="import_t">
              {{ submitmethodsTitle }}啦！</span><span class="import_b">您还可以进行如下操作：</span></div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="goBack">返回列表</el-button>
            <el-button v-if="btnType == 'edit'" type="primary" @click="continueEdit()"> {{ btnText }}</el-button>
            <el-button v-else type="primary" @click="continueAdd()"> {{ btnText }}</el-button>
          </span>
        </el-dialog>
      </div>
      <!-- <productForm v-if="productFormVisible" ref="productForm" @refresh="refresh" /> -->
      <!-- <selectAsset v-if="selectAssetVisible" ref="assetRef" @selectAsset="changeAsset"></selectAsset> -->
    </div>
  </transition>
</template>
<script>
import AbProjectMixin from '@/mixins/generator/AbProjectMixin'
import { getCooperativeData, getcategoryTree, getBimBusinessDetail } from '@/api/basicData/index'
// import selectAsset from '../../callManagement/assetForm.vue'
import {getbimProductAttributes} from "@/api/masterDataManagement/index";
 
import {addFinServiceTicket}from '@/api/service/index'
import { mapGetters, mapState } from 'vuex' 
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import {  getOrderFiledMap } from '@/api/basicData/index'
export default {
  mixins: [AbProjectMixin],

  
  data() {
    return {
      codeConfig: {},//单据规则配置
      superTypeList:[
        {label:"客户",value:"customer"},
        {label:"采购供应商",value:"supplier"},
        {label:"外协供应商",value:"outsourcing_suppliers"},
      ],
      paymentTypeList:[
        {label:"付款",value:"pay"},
        {label:"收款",value:"receive"},
      ],
      dataForm:{
        orderNo:"",
        superType:"",
        cooperativePartnerName:"",
        cooperativePartnerId:"",
        paymentType:"",
        totalAmount:"",
        taxRate:"",
        content:"",
      },






      taxRateList:[],
      selectAssetVisible:false,
      tipsvisible:false,
      categoryType:"purchase",
      categoryTypeList: [
        { code: "purchase", fullName: "资产采购单", },
        { code: "scrap", fullName: "资产报废单", },
        { code: "sale", fullName: "资产出售单", },
        { code: "call", fullName: "资产调用单", },

      ],
      stateList:[
        {label:"同意",value:true,},
        {label:"拒绝",value:false,},
      ],
      btnType:"",
      activeName:'orderInfo',
      activeNames:['basicInfo','associationInfo'],
      assetCategoryFormVisible:false,
      getCooperativeData,
      getcategoryTree,
      //  客户 树请求
      PartnerMethodArr: { method: getcategoryTree, requestObj: { type: "", } },
      // 客户 列表
      PartnerTableItems: [
        { prop: 'code', label: '服务商编码', fixed: 'left' },
        { prop: 'name', label: '服务商名称', fixed: 'left' },
        { prop: 'nameEn', label: '英文名称' },
        { prop: 'taxId', label: '税号' }
      ],
      // 客户搜索条件
      PartnerTableSearchList: [
        { prop: 'code', label: '服务商编码', type: 'input' },
        { prop: 'name', label: '服务商名称', type: 'input' }
      ],
      // 客户请求参数
      PartnerListRequestObj: {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: "",
      },
      operateType:"",
      oldData:[],
     
      width1: 400,
      width: 700, 
      customStyleData: 0,
 
      activeNameDetail: 'productInfo',
      autoCode:"",
      
   
  
      dataRule: {
        superType:[
          { required: true, message: '服务商类型不能为空', trigger: 'change' }

        ],
        orderNo:[
          { required: true, message: '服务单号不能为空', trigger: 'blur' }
        ],
        cooperativePartnerName:[
          { required: true, message: '请选择服务商', trigger: 'change' }
        ],
        paymentType: [
          { required: true, message: '请选择收付款类型', trigger: 'change' }
        ], 
         content: [
          { required: true, message: '请输入服务内容', trigger: 'blur' }
        ], 
         totalAmount: [
          { required: true, message: '请输入含税金额', trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal2', params: [20, 4, "请输入正确的含税金额(最多保留4位小数,整数16位)", (errMsg, index) => { this.$message.error(errMsg) }] }), trigger: 'blur' },

        ], 
      },
      copyForm:{},
      datafilelist:[],
      isattachmentswitch:"",
    }
  },
  computed: {
 
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),
  },
 
  watch: {


},
  async created() { 
    this.getProductClassFun()
  },
  mounted() { 
  },

  methods: {
    selectFun(){
      this.PartnerMethodArr.requestObj.type=this.dataForm.superType              
      this.PartnerListRequestObj.type=this.dataForm.superType
    },
  
    getProductClassFun() {
    
    // 获取税率(数据字典)
    getbimProductAttributes("585438081021126405").then(res => {
      res.data.list.forEach(item => {
        item.taxRate = item.enCode.replace('%', '') * 1
      })
      this.taxRateList = res.data.list 
    })
  },
  // 选择服务商
   supplierdata(id, data) {
     
      if (data.length === 0) {
        this.dataForm.cooperativePartnerName = ''
        this.dataForm.cooperativePartnerCode = ''
        this.dataForm.cooperativePartnerId = ''
      } else {
        if (this.oldData.length) {
        } else {
          this.oldData.push(data)
        }
        this.dataForm.cooperativePartnerName = data[0].all.name
        this.dataForm.cooperativePartnerCode = data[0].all.code
        this.dataForm.cooperativePartnerId = data[0].all.id
       
     
      }
    },



    openSelectAsset(){
      this.selectAssetVisible=true
      this.$nextTick(()=>{
        this.$refs.assetRef.init()
      })
    },
    
    continueEdit(){
      this.tipsvisible=false
      this.btnLoading=false
      this.btnType='edit'
      this.init(this.copyForm.id,'edit')
    },
    continueAdd(){
      this.tipsvisible=false
      this.btnType='add'
      this.$refs.dataForm.resetFields();
    },




  
    // 弹窗节点的点击
    treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },
    supplierdata(id, data) {
     
      if (data.length === 0) {
        this.dataForm.cooperativePartnerName = ''
        this.dataForm.cooperativePartnerCode = ''
        this.dataForm.cooperativePartnerId = ''
      } else {
        if (this.oldData.length) {
        } else {
          this.oldData.push(data)
        }
        this.dataForm.cooperativePartnerName = data[0].all.name
        this.dataForm.cooperativePartnerCode = data[0].all.code
        this.dataForm.cooperativePartnerId = data[0].all.id
       
     
      }
    },
 
    columnSetFun() {
      this.$refs.product.showDrawer()
    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_property'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
        this.attachmentData = res.data
      })
    },
   
    handleConfirm(value){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let submitFlag = null;
          let f = {};
          // this.dataForm.documentStatus = value
   
          if (this.datafilelist.length) {
            this.datafilelist.map((item, index) => {
              item.bimAttachments = {
                businessType: "system_attachment",
                categoryId: this.attachmentData.configValue2,
                configKey: this.attachmentData.configKey,
                documentId: item.id,
                fileFlag: '',
                sort: index
              }
            })
          } 
          if(this.dataForm.paymentType){
            if(this.dataForm.paymentType=='pay'){
              if(Number(this.dataForm.totalAmount)>0){
                submitFlag=false
                this.$message.error("付款类型为付款，含税金额不能大于0")
                return
              }
            }
            if(this.dataForm.paymentType=='收款'){
              if(Number(this.dataForm.totalAmount)<0){
                submitFlag=false
                this.$message.error("付款类型为收款，含税金额不能小于0")
                return
              }
            }
          }
          this.$set(this.dataForm,'attachmentList',this.datafilelist)
          setTimeout(() => {
            if (submitFlag === false) return
            this.btnLoading = true
            let formMethod = null;
            addFinServiceTicket(this.dataForm).then(res => {
              this.btnText = "继续新增"
              let msg = "";
              if (value == "draft") {
                this.submitmethodsTitle = "保存成功"
              } else {
                this.submitmethodsTitle = "提交成功"
              }
              this.tipsvisible = true

             

            }).catch(() => {
              this.btnLoading = false
            })
          }, 100);
        } else {
          this.btnLoading = false
        }
      })
    },
 
   

   
 

   
   
   
    init(btnType,data) {
      this.getBimBusinessDetail()
      this.btnType=btnType 
      if(data){
        this.dataForm=data
          if (data.attachmentList) {
              data.attachmentList.forEach((item) => {
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
      }
         if (this.btnType == 'add') {
        setTimeout(() => {
          this.fetchData("FWDH", true)
        }, 500);
      }
    },
    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (flag) {
          this.dataForm.orderNo = data.number
        }
      } catch (error) {
      }
    },
    goBack() {
      this.$emit('close', true)
      this.tipsvisible = false
    },
 
    // 测试审批流
    getBusInfo() {
      getBusinessFlowInfo('b025').then(res => {
        if (res.data) {
          if (res.data.enabledMark) {
            this.flowData = res.data
            this.flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) : null
            this.dataForm.approvalFlag = res.data.enabledMark
          } else {
            this.flowTemplateJson = {}
            this.dataForm.approvalFlag = false
            this.$message.error('未找到审批流程！')
          }
        } else {
          this.flowTemplateJson = {}
          this.dataForm.approvalFlag = false
        }
      }).catch(() => { })
    },
 
   
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .handle-mr {
  display: block !important;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  margin-bottom: 5px
}

::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 9px 10px;
}
</style>
<style scoped lang="scss">

::v-deep .el-tabs__header {
  padding: 0;
}
.required {
  color: red;
  margin-right: 4px;
}

.el-dialog .el-dialog__body {
  padding: 20px 0px 2px !important;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 5px 0 10px !important;
}

.el-button span {
  font-size: 14px !important;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}

.el-table__footer {
  display: none;
}

::v-deep.has-gutter {
  display: none;
}

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  // background: #dcdfe6;
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  // border-bottom:none;
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
  padding-bottom: 0px
}

.productInfo ::v-deep.el-collapse-item__wrap {
  padding: 0;
}

.import_t {
  font-size: 22px;
  color: rgb(103, 194, 58);
  vertical-align: top;
  margin-top: 40px;
  display: inline-block;
  margin-left: 20px;
}

.import_b {
  font-size: 18px;
  /* color: #67c23a; */
  vertical-align: top;
  margin-top: 43px;
  display: inline-block;
}


</style>
