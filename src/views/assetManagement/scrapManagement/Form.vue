<template>
  <transition name="el-zoom-in-center">
    <div>
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']" >
          <el-page-header @back="goBack"
            :content="btnType == 'add' ? '新建报废' : btnType == 'edit' ? '编辑报废' : btnType == 'look' ? '查看报废' : '新建报废'" />
          <div class="options">
            <el-button type="success" v-if="btnType != 'look'" size="mini" :loading="btnLoading"
              @click="handleConfirm('draft')">
              保存草稿</el-button>
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
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="资产分类" prop="propertyCategoryName">
                            <el-input v-model="dataForm.propertyCategoryName" placeholder="请选择资产分类"   @focus="openAssetCategoryDialog"
                              disabled />
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24" >
                          <el-form-item label="资产编码" prop="propertyCode">
                            <el-input v-model="dataForm.propertyCode" placeholder="请输入资产编码"
                              disabled />
                          </el-form-item>
                        </el-col>
               
                        <el-col :sm="6" :xs="24" >
                          <el-form-item label="资产名称" prop="propertyName">
                            <el-input v-model="dataForm.propertyName" placeholder="请输入资产名称" readonly @focus="openSelectAsset" :disabled="btnType!='add'"
                               />
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24" >
                          <el-form-item label="资产规格" prop="propertySpec">
                            <el-input v-model="dataForm.propertySpec" placeholder="请输入资产规格"
                              disabled />
                          </el-form-item>
                        </el-col>
  
                        <el-col :span="6" v-if="abProjectSwitchVisible" >
                          <el-form-item label="所属项目" prop="projectId">
                            <el-select v-model="dataForm.projectId" placeholder="请选择所属项目" style="width: 100%;"  filterable   disabled>
                              <el-option v-for="item in abProjectList" :key="item.id" :label="item.name"
                                :value="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                
                        <el-col :span="6"  v-if="btnType=='look'||btnType=='edit'">
                          <el-form-item prop="eqCode" label="设备工具编码">
                            <el-input v-model="dataForm.eqCode" placeholder="请输入设备工具编码" disabled />
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="投入使用日期" prop="userTime">
                            <el-date-picker v-model="dataForm.userTime" type="date" value-format="yyyy-MM-dd" 
                              style="width: 100%;" :picker-options="pickerOptions" placeholder="请选择投入使用日期"
                              disabled>
                            </el-date-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24" >
                          <el-form-item label="资产常用位置" prop="position">
                            <el-input v-model="dataForm.position" placeholder="请输入资产常用位置" 
                              disabled />
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24" >
                          <el-form-item label="资产原值" prop="costPrice">
                            <el-input v-model="dataForm.costPrice" placeholder="请输入资产原值" 
                              disabled />
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24" >
                          <el-form-item label="年折旧率" prop="depreciationRate">
                            <el-input v-model="dataForm.depreciationRate" placeholder="请输入年折旧率" 
                              disabled />
                          </el-form-item>
                        </el-col>
                   
                        <el-col :sm="6" :xs="24" >
                          <el-form-item label="资产净值" prop="netPrice">
                            <el-input v-model="dataForm.netPrice" placeholder="请输入资产净值" 
                              disabled />
                          </el-form-item>
                        </el-col>
                 
                        <el-col :sm="6" :xs="24" >
                          <el-form-item label="资产管理员" prop="ownerId">
                            <user-select v-model="dataForm.ownerId" placeholder="请选择资产管理员" clearable disabled
                                  style="width: 100%;"  @change="hangleSelectSales">
                                </user-select>
                          </el-form-item>
                        </el-col>
                    
                        <el-col :sm="6" :xs="24" >
                          <el-form-item label="采购人" prop="purchaserId">
                            <user-select v-model="dataForm.purchaserId" placeholder="请选择采购人" clearable disabled
                                  style="width: 100%;"  @change="hangleSelectSales">
                                </user-select>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24" >
                       
                          <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                            <!-- 供应商选择弹窗  -->
                            <ComSelect-page clearable :isdisabled="btnType === 'look'" :treeNodeClick="treeNodeClick"
                              v-model="dataForm.cooperativePartnerName"  ref="ComSelect-page" isdisabled
                              @change="supplierdata" :tableItems="PartnerTableItems" :placeholder="'请选择供应商名称'"
                              title="选择供应商" treeTitle="供应商分类" :methodArr="PartnerMethodArr"
                              :listMethod="getCooperativeData" :listRequestObj="PartnerListRequestObj"
                              :paramsObj="{ oldData }" :searchList="PartnerTableSearchList" />
                       
                          </el-form-item>
                        </el-col> 
   
                    
                        <el-col :sm="6" :xs="24" v-if="operateType=='approve'">
                          <el-form-item label="状态" prop="state">
                            <el-select v-model="dataForm.state" placeholder="请选择" style="width: 100%;" >
                              <el-option v-for="(item, index) in stateList" :key="index" :label="item.label" 
                                :value="item.value"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24"  v-if="operateType=='approve'">
                          <el-form-item label="审批说明" prop="approvalInstructions">
                            <el-input v-model="dataForm.approvalInstructions" placeholder="请输入审批说明"
                               type="textarea" :rows="2" maxlength="200" />
                          </el-form-item>
                        </el-col>

                        <el-col :sm="6" :xs="24"  v-if="operateType=='scrap'">
                          <el-form-item label="报废说明" prop="scrapInstructions">
                            <el-input v-model="dataForm.scrapInstructions" placeholder="请输入报废说明"
                               type="textarea" :rows="2" maxlength="200" />
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="备注" prop="remark">
                            <el-input v-model="dataForm.remark" placeholder="请输入备注"
                              :disabled="btnType == 'look' ? true : false" type="textarea" :rows="2" maxlength="200" />
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
      <assetCategoryForm v-if="assetCategoryFormVisible" ref="assetCategoryForm" @selectAssetFun="selectAssetCategoryFun"></assetCategoryForm>
      <selectAsset v-if="selectAssetVisible" ref="assetRef" @selectAsset="changeAsset"></selectAsset>
    </div>
  </transition>
</template>
<script>
import { propertyScrapDetail,editPropertyScrapList,addPropertyScrapList} from '@/api/bimPropertyCategory/index'
import assetCategoryForm from '../basicInformation/assetCategoryForm.vue'
import AbProjectMixin from '@/mixins/generator/AbProjectMixin'
import { getCooperativeData, getcategoryTree, getBimBusinessDetail } from '@/api/basicData/index'
import selectAsset from '../callManagement/assetForm.vue'
 
import { mapGetters, mapState } from 'vuex' 
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import {  getOrderFiledMap } from '@/api/basicData/index'
export default {
  mixins: [AbProjectMixin],

  components: {   assetCategoryForm,selectAsset},
  
  data() {
    return {
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
      //  供应商 树请求
      PartnerMethodArr: { method: getcategoryTree, requestObj: { type: 'supplier' } },
      // 供应商 列表
      PartnerTableItems: [
        { prop: 'code', label: '供应商编码', fixed: 'left' },
        { prop: 'name', label: '供应商名称', fixed: 'left' },
        { prop: 'nameEn', label: '英文名称' },
        { prop: 'taxId', label: '税号' }
      ],
      // 供应商搜索条件
      PartnerTableSearchList: [
        { prop: 'code', label: '供应商编码', type: 'input' },
        { prop: 'name', label: '供应商名称', type: 'input' }
      ],
      // 供应商请求参数
      PartnerListRequestObj: {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'supplier'
      },
      operateType:"",
      oldData:[],
      dataForm:{
        propertyCategoryName:"",
        propertyCategoryId:"",
        code:"",
        name:"",
        spec:"",
        projectId:"",
        userTime:"",
        position:"",
        costPrice:"",
        depreciationRate:"",
        netPrice:"",
        ownerId:"",
        purchaserId:"",
        cooperativePartnerName:"",
        cooperativePartnerId:"",
        remark:"",
        orderStatus:"toBeAgreed",
        
      },
      width1: 400,
      width: 700, 
      customStyleData: 0,
 
      activeNameDetail: 'productInfo',
      autoCode:"",
      
   
  
      dataRule: {
        propertyCategoryName: [
          { required: true, message: '资产分类不能为空', trigger: 'change' }
        ],
        
        propertyName: [
          { required: true, message: '资产名称为空', trigger: 'no' }
        ],
        projectId: [
          { required: true, message: '所属项目不能为空', trigger: 'change' }
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        // paymentMethod: [{ required: true, message: '付款方式不能为空', trigger: 'change' }],
        // paymentCycle: [{ required: true, message: '付款周期不能为空', trigger: 'change' }],
      },
      copyForm:{},
    
    }
  },
  computed: {
 
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),
  },
 
  watch: {


},
  async created() { 
 
  },
  mounted() { 
  },

  methods: {
    openSelectAsset(){
      this.selectAssetVisible=true
      this.$nextTick(()=>{
        this.$refs.assetRef.init()
      })
    },
    changeAsset(data){
      console.log("资产数据",data);
      this.dataForm=data
      this.$set(this.dataForm,'propertyId',data.id)
      this.$set(this.dataForm,'propertyName',data.name)
      this.$set(this.dataForm,'propertyCode',data.code)
      this.$set(this.dataForm,'propertySpec',data.spec)
      this.dataForm.id=""
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



    openAssetCategoryDialog(){
      this.assetCategoryFormVisible=true
      this.$nextTick(()=>{
        this.$refs.assetCategoryForm.init()
      })
    },
    // 选择资产分类
    selectAssetCategoryFun(row){
      console.log("所选择的分类",row);
      this.dataForm.propertyCategoryName=row.name
      this.dataForm.propertyCategoryId=row.id
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

    async switchStyleheight() {
      const mainRegion1 = this.$refs.main // 表单页面区域
      const mainHeight1 = mainRegion1.clientHeight
      // 其他同级组件占用高度
      let bortherHeight = 0
      const bortherItems = mainRegion1.querySelectorAll('.orderInfo > *')
      bortherItems.forEach((item) => {
        if (item.className !== 'el-form data-form') bortherHeight += item.clientHeight
      })

      // 表格高度 = 区域总高度 - 同级元素高度 - 安全高度
      let maxHeight2 = mainHeight1 - bortherHeight - 112
      let maxHeight;
      if (this.btnType == 'look') {
         maxHeight = mainHeight1 - 580

      } else {
         maxHeight = mainHeight1 - 500
      }

      console.log(maxHeight, 'maxHeight')
      this.customStyleData = Number(maxHeight) > 0 ? maxHeight : 300
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100)
      }
    },























    columnSetFun() {
      this.$refs.product.showDrawer()
    },





  
 
 
  
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_sales'
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
   
          // if (this.datafilelist.length) {
          //   this.datafilelist.map((item, index) => {
          //     item.bimAttachments = {
          //       businessType: "system_attachment",
          //       categoryId: this.attachmentData.configValue2,
          //       configKey: this.attachmentData.configKey,
          //       documentId: item.id,
          //       fileFlag: '',
          //       sort: index
          //     }
          //   })
          // }
          // let obj = {
          //   attachmentList: this.datafilelist,
          //   order: ,
          // }
          let filteredArr = []
     
          setTimeout(() => {
            if (submitFlag === false) return
            this.btnLoading = true
            let formMethod = null;
            if (this.btnType == 'edit'||this.operateType) {
              formMethod = editPropertyScrapList
              if(this.dataForm.state===true)this.dataForm.orderStatus='toBeScrapped'
              if(this.dataForm.state===false)this.dataForm.orderStatus='rejected'
              if(this.operateType==='approve')this.$set(this.dataForm,'approvalUserId',this.userInfo.userId)
              if(this.operateType==='scrap')this.dataForm.orderStatus='scrapped' 
              this.btnText = "继续修改"
            } else if (this.btnType == 'add' || this.btnType == 'copy') {
              formMethod = addPropertyScrapList
              this.dataForm.orderStatus='toBeAgreed'
              this.btnText = "继续新增"
            } 
            formMethod(this.dataForm).then(res => {
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
    getPropertyPurchaseOrderDetail(id){
      propertyScrapDetail(id).then(res=>{
        console.log("详情",res);
        this.dataForm=res.data
        this.autoCode=res.data.code
        this.copyForm=JSON.parse(JSON.stringify(res.data))
      })
    },
   

   
 

   
   
   
    init(id, btnType) {
      this.getBimBusinessDetail()
      console.log("btntype",btnType);
      if(btnType=='scrap'){
        btnType='look'
        this.operateType='scrap'
      }
     
      if(btnType=='approve'){
        btnType='look'
        this.operateType='approve'
      }
      this.btnType=btnType

      this.switchStyleheight()
       if(id)this.getPropertyPurchaseOrderDetail(id)
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
