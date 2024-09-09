<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="btntype == 'edit' ? ' 编辑跟进记录' : btntype == 'add' ? '新建跟进记录' : '查看跟进记录'" />
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
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="拜访计划" prop="visitPlanName">
                        <ComSelect-page v-model="dataForm.visitPlanName" @change="visitPlanChange" :tableItems="VisitPlanTableItems" dialogTitle="选择拜访计划" placeholder="请选择拜访计划" :listMethod="getcrmVisitlist" :listRequestObj="VisitPlanRequestObj" :searchList="VisitPlanSearchList" :isdisabled="btntype === 'look'" :renderTree="false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="下次跟进时间" prop="nextTime">
                        <el-date-picker v-model="dataForm.nextTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" placeholder="请选择下次跟进时间" :disabled="btntype == 'look' ? true : false">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="跟进方式" prop="visitForm">
                        <el-select v-model="dataForm.visitForm" placeholder="请选择跟进方式" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                          <el-option v-for="(item, index) in visitFormList" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="负责人" prop="ownerUserId">
                        <user-select v-model="dataForm.ownerUserId" placeholder="请选择负责人" clearable style="width: 100%" :disabled="btntype == 'look'">
                        </user-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="客户名称" prop="name">
                        <ComSelect-page key="partner" ref="ComSelect-page" v-model="dataForm.name" @change="partnerChange" :tableItems="partnerTableItems" dialogTitle="选择客户" treeTitle="客户分类" placeholder="请选择客户名称" :methodArr="{ method: getcategoryTrees, requestObj: { type: 'customer' } }" :listMethod="getPartnerList" :listRequestObj="partnerRequestObj" :searchList="partnerSearchList" :treeNodeClick="PartnerTreeNodeClick" :isdisabled="btntype === 'look'||!!dataForm.visitPlanName" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="联系人" prop="contactsId">
                        <el-select v-model="dataForm.contactsId" placeholder="请选择联系人" clearable style="width: 100%;" :disabled="btntype == 'look'||!dataForm.name">
                          <el-option v-for="(item, index) in contactsIdList" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="合同" prop="contractNo">
                        <ComSelect-page v-model="dataForm.contractNo" @change="contractNoChange" :tableItems="contractNoTableItems" dialogTitle="选择合同" placeholder="请选择合同" :listMethod="getcrmContractlist" :listRequestObj="contractNoRequestObj" :searchList="contractNoSearchList" :isdisabled="btntype === 'look'||!dataForm.name" :renderTree="false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="回款" prop="receivablesNo">
                        <ComSelect-page v-model="dataForm.receivablesNo" @change="receivablesNoChange" :tableItems="receivablesNoTableItems" dialogTitle="选择回款" placeholder="请选择回款" :listMethod="getcrmReceivableslist" :listRequestObj="receivablesNoRequestObj" :searchList="receivablesNoSearchList" :isdisabled="btntype === 'look'||!dataForm.name" :renderTree="false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="跟进内容" prop="serviceDescription">
                        <el-input v-model="dataForm.serviceDescription" placeholder="请输入跟进内容" :disabled="btntype == 'look'" type="textarea" :rows="2" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </el-form>
            <el-form ref="informationForm" v-loading="formLoading" :model="informationForm" :rules="dataRule" label-position="top" label-width="120px">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="行程信息" name="xcInfo" v-if="dataForm.visitForm=='见面拜访'">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="出发地" prop="departure">
                        <el-input v-model="informationForm.departure" placeholder="请输入出发地" :disabled="btntype == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="目的地" prop="destination">
                        <el-input v-model="informationForm.destination" placeholder="请输入目的地" :disabled="btntype == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="里程数(km)" prop="mileage">
                        <el-input v-model="informationForm.mileage" placeholder="请输入里程数" :disabled="btntype == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="出行方式" prop="travelMode">
                        <el-select v-model="informationForm.travelMode" placeholder="请选择出行方式" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                          <el-option v-for="(item, index) in travelModeList" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24" v-if="btntype == 'look'">
                      <el-form-item label="定位" prop="visitGps">
                        <el-input v-model="informationForm.visitGps" placeholder="请在移动端进行定位" :disabled="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24" v-if="btntype == 'look'">
                      <el-form-item label="现场照片" prop="visitPhoto">
                        <el-upload action="#" list-type="picture-card" :auto-upload="false" :disabled="true">
                          <i slot="default" class="el-icon-plus"></i>
                          <div slot="file" slot-scope="{file}">
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                            <span class="el-upload-list__item-actions">
                              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                <i class="el-icon-zoom-in"></i>
                              </span>
                              <span class="el-upload-list__item-delete" @click="handleDownload(file)">
                                <i class="el-icon-download"></i>
                              </span>
                              <span v-if="btntype !== 'look'" class="el-upload-list__item-delete" @click="handleRemove(file)">
                                <i class="el-icon-delete"></i>
                              </span>
                            </span>
                          </div>
                          <div slot="tip" class="el-upload__tip">仅允许拍照上传</div>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">
                          <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch=='1'">
            <UploadWj v-model="datafilelist" :disabled="btntype === 'look'" :detailed="btntype === 'look'"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { getcategoryTrees } from '@/api/salesManagement/assemblyOrders'
import { getPartnerList, getMyContactsList } from '@/api/customerManagement/index'
import { addServiceRecords, detailServiceRecords, updateServiceRecords, getcrmBusinessList, getcrmVisitlist, getcrmContractlist, getcrmReceivableslist } from '@/api/CRMmanagement/index'
export default {
  data() {
    return {
      isattachmentswitch: '1',
      datafilelist: [],
      receivablesNoSearchList: [
        { prop: 'receivablesNo', label: '回款编号', type: 'input' },
      ],
      receivablesNoRequestObj: {
        customerName: '',
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
      getcrmReceivableslist,
      //回款列表字段
      receivablesNoTableItems: [
        { prop: 'receivablesNo', label: '回款编号' },
        { prop: 'receivablesData', label: '回款日期' },
        { prop: 'receivablesMoney', label: '回款金额' },
        { prop: 'contractNo', label: '合同编号' }
      ],

      contractNoSearchList: [
        { prop: 'no', label: '合同编号', type: 'input' },
      ],
      contractNoRequestObj: {
        customerName: '',
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
      getcrmContractlist,
      //合同列表字段
      contractNoTableItems: [
        { prop: 'no', label: '合同编号' },
        { prop: 'contractName', label: '合同名称' },
        { prop: 'businessName', label: '商机名称' },
        { prop: 'money', label: '合同金额' }
      ],
      travelModeList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      visitFormList: [],
      businessSearchList: [
        { prop: 'businessName', label: '商机名称', type: 'input' },
      ],
      businessRequestObj: {
        name: "",
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
      //拜访列表字段
      VisitPlanTableItems: [
        { prop: 'visitName', label: '拜访计划名称' },
        { prop: 'visitTime', label: '预计拜访时间' },
        { prop: 'customerName', label: '客户名称' },
        { prop: 'contactsName', label: '联系人' }
      ],
      getcrmVisitlist,
      VisitPlanRequestObj: {
        returnVisitNo: "",
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
      VisitPlanSearchList: [
        { prop: 'visitName', label: '拜访计划名称', type: 'input' },
      ],
      //商机
      getcrmBusinessList,
      //商机列表字段
      businessIdTableItems: [
        { prop: 'businessName', label: '商机名称' },
        { prop: 'money', label: '商机金额' },
        { prop: 'nextTime', label: '下次联系时间' },
        { prop: 'remark', label: '备注' }
      ],
      // visitGoalList: [],
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
        taxId: "",
        code: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        customerStatus: 'private_sea',
        totalRowFlag: false,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
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
      getPartnerList,
      activeName: "jcInfo",
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        receivablesNo: '',
        receivablesId: '',
        contractId: '',
        contractNo: '',
        visitPlanName: '',
        visitId: '',
        nextTime: '',
        visitForm: '',
        ownerUserId: '',
        name: '',
        cooperativePartnerId: '',
        contactsId: '',
        serviceDescription: '',
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
        serviceDescription: [
          { required: true, message: '请输入跟进内容', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请选择客户', trigger: 'blur' },
        ]
      },
    }
  },
  watch: {
    'dataForm.name': {
      handler(newOption) {
        this.receivablesNoRequestObj.customerName = newOption
        this.contractNoRequestObj.customerName = newOption
        getMyContactsList({
          cooperativePartnerName: newOption, pageNum: 1,
          pageSize: -1,
        }).then(res => {
          this.contactsIdList = res.data.records
        })
        this.dataForm.receivablesNo = ''
        this.dataForm.receivablesId = ''
        this.dataForm.contractId = ''
        this.dataForm.contractNo = ''
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getDictionaryType()
    this.dataForm.ownerUserId = this.userInfo.userId
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    handleRemove(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    //合同传值
    contractNoChange(val, data) {
      if (data && data.length) { // 数据有效，进行更新
        this.dataForm.contractNo = data[0].all.no
        this.dataForm.contractId = data[0].all.id
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.contractNo = ""
        this.dataForm.contractId = ""
      }
    },
    //回款传值
    receivablesNoChange(val, data) {
      if (data && data.length) { // 数据有效，进行更新
        this.dataForm.receivablesNo = data[0].all.receivablesNo
        this.dataForm.receivablesId = data[0].all.id
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.receivablesNo = ""
        this.dataForm.visitId = ""
      }
    },
    //拜访计划传值
    visitPlanChange(val, data) {
      if (data && data.length) { // 数据有效，进行更新
        this.dataForm.visitPlanName = data[0].all.visitName
        this.dataForm.visitId = data[0].all.id
        this.dataForm.name = data[0].all.customerName
        this.dataForm.cooperativePartnerId = data[0].all.customerId
        this.dataForm.visitForm = data[0].all.visitForm ? data[0].all.visitForm : ''
        this.dataForm.contactsId = data[0].all.contactsId ? data[0].all.contactsId : ''
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.visitPlanName = ""
        this.dataForm.visitId = ""
      }
    },
    //商机选框传值
    businessChange(val, data) {
      if (data && data.length) { // 数据有效，进行更新
        this.dataForm.businessName = data[0].all.businessName
        this.dataForm.businessId = data[0].all.id
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.businessName = ""
        this.dataForm.businessId = ""
      }
    },
    // 获取跟进数据
    getDictionaryType() {
      getDictionaryType().then(res => {
        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "partnerArchives") {
            let children = item.children
            children.forEach(resp => {
              if (resp.enCode == "Followupform") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.visitFormList = response.data.list
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
      if (listQuery.categoryId === data.id) return listQuery
      listQuery.categoryId = data.id
      return listQuery
    },
    // 客户选框传值
    partnerChange(val, data, paramsObj) {
      this.$nextTick(() => { this.$refs['dataForm'].validateField('name') }) // 校验操作的元素(name是组件绑定的value)
      if (data && data.length) { // 数据有效，进行更新
        this.dataForm.name = data[0].all.name
        this.dataForm.cooperativePartnerId = data[0].all.id
        this.businessRequestObj.name = this.dataForm.name
        this.dataForm.contactsId = ''
        this.dataForm.contactsName = ''
        this.dataForm.businessName = ""
        this.dataForm.businessId = ""
        // getMyContactsList({
        //   cooperativePartnerName: this.dataForm.name, pageNum: 1,
        //   pageSize: -1,
        // }).then(res => {
        //   this.contactsIdList = res.data.records
        // })
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.cooperativePartnerId = ""
        this.dataForm.name = ""
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
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          detailServiceRecords(this.dataForm.id).then(res => {
            this.dataForm = res.data.records
            this.informationForm = res.data.information
            if (res.data.records.attachmentList) {
              res.data.records.attachmentList.forEach((item) => {
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
        } else {
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
            information: informationForm,
            records: {
              ...this.dataForm,
              attachmentList: this.datafilelist
            }
          }
          let formMethod = this.dataForm.id ? updateServiceRecords(obj) : addServiceRecords(obj);
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
