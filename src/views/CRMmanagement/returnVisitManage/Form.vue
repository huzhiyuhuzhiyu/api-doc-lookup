<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="btntype == 'edit' ? ' 编辑回访' : btntype == 'add' ? '新建回访' : '查看回访'" />
        <div class="options" v-if="btntype !== 'look'">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基础信息" name="jcInfo">
            <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top" label-width="120px">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="回访编号" prop="returnVisitNo">
                        <el-input v-model="dataForm.returnVisitNo" placeholder="请输入回访编号" :disabled="btntype == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag  ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="回访时间" prop="returnVisitTime">
                        <el-date-picker v-model="dataForm.returnVisitTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" placeholder="请选择回访时间" :disabled="btntype == 'look' ? true : false">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="回访人" prop="ownerUserId">
                        <user-select v-model="dataForm.ownerUserId" placeholder="请选择回访人" clearable style="width: 100%" :disabled="btntype == 'look'">
                        </user-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="回访形式" prop="returnVisitForm">
                        <el-select v-model="dataForm.returnVisitForm" placeholder="请选择回访形式" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                          <el-option v-for="(item, index) in returnVisitFormList" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="客户名称" prop="customerName">
                        <ComSelect-page key="partner" ref="ComSelect-page" v-model="dataForm.customerName" @change="partnerChange" :tableItems="partnerTableItems" dialogTitle="选择客户" treeTitle="客户分类" placeholder="请选择客户名称" :methodArr="{ method: getcategoryTrees, requestObj: { type: 'customer' } }" :listMethod="getCooperativeData" :listRequestObj="partnerRequestObj" :searchList="partnerSearchList" :treeNodeClick="PartnerTreeNodeClick" :isdisabled="btntype === 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="联系人" prop="contactsId">
                        <el-select v-model="dataForm.contactsId" placeholder="请选择联系人" clearable style="width: 100%;" :disabled="btntype == 'look'||!dataForm.customerName">
                          <el-option v-for="(item, index) in contactsIdList" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="合同编号" prop="contractNo">
                        <ComSelect-page v-model="dataForm.contractNo" @change="contractChange" :tableItems="contractTableItems" dialogTitle="选择合同" placeholder="请选择合同编号" :listMethod="getcrmContractlist" :listRequestObj="contractRequestObj" :searchList="contractSearchList" :isdisabled="btntype === 'look'||!dataForm.customerName" :renderTree="false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="客户满意度" prop="customerSatisfaction">
                        <el-select v-model="dataForm.customerSatisfaction" placeholder="请选择客户满意度" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                          <el-option v-for="(item, index) in customerSatisfactionList" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="客户反馈" prop="feedback">
                        <el-input v-model="dataForm.feedback" placeholder="请输入客户反馈" :disabled="btntype == 'look'" type="textarea" maxlength="200" :rows="2" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </el-form>
            <el-form v-if="dataForm.returnVisitForm=='见面拜访'" ref="informationForm" v-loading="formLoading" :model="informationForm" :rules="dataRule" label-position="top" label-width="120px">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="行程信息" name="xcInfo">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="出发地" prop="departure">
                        <el-input v-model="informationForm.departure" placeholder="请输入出发地" :disabled="btntype == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="目的地" prop="destination">
                        <el-input v-model="informationForm.destination" placeholder="请输入目的地" :disabled="btntype == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="里程数(km)" prop="mileage">
                        <el-input v-model="informationForm.mileage" @change="handleDownload" placeholder="请输入里程数" :disabled="btntype == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="出行方式" prop="travelMode">
                        <el-select v-model="informationForm.travelMode" placeholder="请选择出行方式" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                          <el-option v-for="(item, index) in travelModeList" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="btntype == 'look'">
                      <el-form-item label="定位" prop="visitGps">
                        <el-input v-model="informationForm.visitGps" placeholder="请在移动端进行定位" :disabled="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="24" :xs="24" v-if="btntype == 'look'">
                      <el-form-item label="现场照片" prop="visitPhoto">
                        <el-image class="information-img" fit="contain" v-for="item in informationForm.visitPhotoList" :key="item.id" :src="define.comUrl+item.url" @click="handlePictureCardPreview(item)">
                          <div slot="placeholder" class="image-slot">
                            加载中<span class="dot">...</span>
                          </div>
                        </el-image>
                        <!-- <UploadImg v-model="fileList"></UploadImg> -->
                        <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">
                          <img width="100%" height="100%" :src="define.comUrl+dialogImageUrl" alt="">
                        </el-dialog>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch=='1'">
            <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
// import UploadImg from "@/components/Generator/components/Upload/UploadImg.vue";
import { mapGetters } from 'vuex'
import { getCooperativeData } from '@/api/basicData/index'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { getcategoryTrees } from '@/api/salesManagement/assemblyOrders'
import { getMyContactsList } from '@/api/customerManagement/index'
import { addcrmReturnVisit, detailcrmReturnVisit, updatecrmReturnVisit, getcrmContractlist } from '@/api/CRMmanagement/index'
export default {
  // components: { UploadImg },
  data() {
    return {
      isattachmentswitch: '1',
      datafilelist: [],
      travelModeList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      codeConfig: {},//单据规则配置
      getcrmContractlist,
      //合同列表字段
      contractTableItems: [
        { prop: 'no', label: '合同编号' },
        { prop: 'contractName', label: '合同名称' },
        { prop: 'customerName', label: '客户名称' },
        { prop: 'businessName', label: '商机名称' },
        { prop: 'money', label: '合同金额' },
        { prop: 'orderTime', label: '下单日期' },
      ],
      //合同列表搜索
      contractSearchList: [
        { prop: 'contractName', label: '合同名称', type: 'input' },
      ],
      //合同请求条件
      contractRequestObj: {
        customerName: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      customerSatisfactionList: [],
      returnVisitFormList: [],
      contactsIdList: [],
      getcategoryTrees,
      // 客户搜索条件
      partnerSearchList: [
        { prop: 'code', label: '客户编码', type: 'input' },
        { prop: 'name', label: '客户名称', type: 'input' },
        { prop: 'taxId', label: '税号', type: 'input' }
      ],
      // 客户列表
      partnerRequestObj: {
        partnerCategoryId: '',
        code: "",
        name: "",
        taxId: "",
        contacts: "",
        phone: "",
        mobilePhone: "",
        departmentId: "",
        salespersonIdText: "",
        salespersonId: "",
        internalStaffId: "",
        startTime: "",
        endTime: "",
        type: "customer",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery: {}
      },
      // 客户列表字段
      partnerTableItems: [
        { prop: 'code', label: '客户编码' },
        { prop: 'name', label: '客户名称' },
        { prop: 'taxId', label: '税号' },
      ],
      activeNames: ["basicInfo", "xcInfo"],
      requestObj: {
        customerStatus: 'private_sea',
      },
      getCooperativeData,
      activeName: "jcInfo",
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        returnVisitNo: '',
        returnVisitTime: '',
        ownerUserId: '',
        contactsName: '',
        ownerUserName: '',
        feedback: '',
        customerName: '',
        customerId: '',
        contactsId: '',
        customerSatisfaction: '',
        returnVisitForm: '',
        contractNo: '',
        contractId: ''
      },
      informationForm: {
        departure: '',
        destination: '',
        mileage: '',
        travelMode: '',
        visitGps: '',
        visitPhoto: '',
        visitPhotoList: []
      },
      btntype: false,
      dataRule: {
        returnVisitNo: [
          { required: true, message: '请输入回访编号', trigger: 'blur' },
        ],
        returnVisitTime: [
          { required: true, message: '请选择回访时间', trigger: 'blur' },
        ],
        ownerUserId: [
          { required: true, message: '请选择回访人', trigger: 'blur' },
        ],
        customerName: [
          { required: true, message: '请选择客户名称', trigger: 'blur' },
        ],
        contractNo: [
          { required: true, message: '请选择合同编号', trigger: 'blur' },
        ]
      },
    }
  },
  created() {
    this.getDictionaryType()
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (this.btntype === 'add') this.dataForm.returnVisitNo = data.number
      } catch (error) {
      }
    },
    //合同选框传值
    contractChange(val, data) {
      if (data && data.length) {
        this.dataForm.contractNo = data[0].all.no
        this.dataForm.contractId = data[0].all.id
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.contractNo = ""
        this.dataForm.contractId = ""
      }
    },
    // 获取客户满意度、回访形式数据
    getDictionaryType() {
      getDictionaryType().then(res => {
        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "partnerArchives") {
            let children = item.children
            children.forEach(resp => {
              if (resp.enCode == "Customersatisfaction") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.customerSatisfactionList = response.data.list
                })
              }
              if (resp.enCode == "Followupform") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.returnVisitFormList = response.data.list
                })
              }
              if (resp.enCode == "Travelmode") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.travelModeList = response.data.list
                })
              }
            })
          }
        })
      })
    },
    // 客户分类节点点击
    PartnerTreeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.id
      return listQuery
    },
    // 客户选框传值
    partnerChange(val, data, paramsObj) {
      this.$nextTick(() => { this.$refs['dataForm'].validateField('customerName') }) // 校验操作的元素(name是组件绑定的value)
      if (data && data.length) { // 数据有效，进行更新
        this.dataForm.customerName = data[0].all.name
        this.dataForm.customerId = data[0].all.id
        this.contractRequestObj.customerName = this.dataForm.customerName
        this.dataForm.contactsId = ''
        this.dataForm.contactsName = ''
        getMyContactsList({
          cooperativePartnerName: this.dataForm.customerName, pageNum: 1,
          pageSize: -1,
        }).then(res => {
          this.contactsIdList = res.data.records
        })
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.customerId = ""
        this.dataForm.customerName = ""
      }
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type) {
      this.visible = true
      this.btntype = type
      this.dataForm.id = id || ''
      this.formLoading = true
      if (this.btntype === 'add' || this.btntype === 'edit') this.fetchData('HFBH')
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          detailcrmReturnVisit(this.dataForm.id).then(res => {
            this.dataForm = res.data.returnVisit
            this.informationForm = res.data.information
            if (this.informationForm.visitPhoto) {
              if (this.informationForm.visitPhotoList == "[]") {
                this.informationForm.visitPhotoList = [];
              } else {
                this.informationForm.visitPhotoList = this.informationForm.visitPhotoList.map(
                  item => JSON.parse("{" + item + "}")
                )
              }
            }
            getMyContactsList({
              cooperativePartnerName: this.dataForm.customerName, pageNum: 1,
              pageSize: -1,
            }).then(res => {
              this.contactsIdList = res.data.records
              this.formLoading = false
            })
            if (res.data.returnVisit.attachmentList) {
              res.data.returnVisit.attachmentList.forEach((item) => {
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
          })
        } else {
          this.dataForm.ownerUserId = this.userInfo.userId
          this.dataForm.returnVisitTime = this.jnpf.getToday('YYYY-MM-DD HH:mm:ss')
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          if (this.datafilelist.length) {
            this.datafilelist.map((item, index) => {
              item.bimAttachments = {
                businessType: 'customer',
                documentId: item.id,
                fileFlag: '',
                sort: index
              }
            })
          }
          let obj = {
            information: this.informationForm,
            returnVisit: {
              ...this.dataForm,
              attachmentList: this.datafilelist
            }
          }
          let formMethod = this.dataForm.id ? updatecrmReturnVisit(obj) : addcrmReturnVisit(obj);
          formMethod.then(res => {
            let msg = ""
            if (this.btntype == "edit") {
              msg = '修改成功'
            } else {
              msg = '新建成功'
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
    }
  }
}
</script>
<style scoped lang="scss">
.JNPF-preview-main .main {
  padding-top: 0;
  .information-img {
    width: 148px;
    height: 148px;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    overflow: hidden;
    cursor: pointer;
  }
  .information-img + .information-img {
    margin-left: 10px;
  }
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
::v-deep .el-form-item__content p {
  border: none;
}
::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
