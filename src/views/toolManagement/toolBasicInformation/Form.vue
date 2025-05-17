<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="!dataForm.id ? `新建工具` : disabled ? '查看工具' : '编辑工具'" />
        <div class="options">
          <el-button type="primary" v-if="!disabled" :loading="btnLoading" @click="handleConfirm()">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="jcInfo">
            <el-collapse v-model="activeNames">
              <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                <el-collapse-item title="基本信息" name="basicInfo">
                  <el-row :gutter="20" class="custom-row">
                    <el-col :sm="8" :xs="24" v-if="isProjectSwitch=='1'">
                      <el-form-item label="所属项目" prop="projectId">
                        <el-select v-model="dataForm.projectId" placeholder="请选择所属项目" :loading="loadingprojectId" :disabled="type !== 'add'" style="width: 100%;">
                          <el-option v-for="item in projectIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="所属分类" prop="productCategoryName">
                        <ComSelect-list :isdisabled="disabled" v-model="dataForm.productCategoryName" placeholder="请选择工具类型" auth @change="onOrganizeChangeTwo" :title="'选择工具类型'" :method="getCategoryTrees" :requestObj="requestObj" :paramsObj="{}" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="工具编码" prop="code">
                        <el-input v-model="dataForm.code" placeholder="请输入工具编码" maxlength="20" :disabled="type!='add'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="工具名称" prop="name">
                        <el-input v-model="dataForm.name" placeholder="请输入工具名称" maxlength="20" :disabled="disabled" />
                      </el-form-item>
                    </el-col>

                    <!-- <el-col :sm="8" :xs="24">
              <el-form-item label="简称" prop="shortName">
                <el-input v-model="dataForm.shortName" placeholder="请输入" maxlength="50" />
              </el-form-item>
            </el-col> -->
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="工具规格" prop="specModel">
                        <el-input maxlength="50" v-model="dataForm.specModel" placeholder="请输入工具规格" :disabled="disabled" />
                      </el-form-item>
                    </el-col>
                    <!-- <el-col :sm="8" :xs="24">
                      <el-form-item label="工具类型" prop="deviceType">
                        <el-select v-model="dataForm.deviceType" placeholder="请选择工具类型" :disabled="dataForm.id ? true : false" style="width: 100%;">
                          <el-option v-for="item in deviceTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col> -->
                    <el-col :sm="8" :xs="24" v-if="this.propertyKey" >
                      <el-form-item label="资产名称" prop="propertyName">
                        <el-input v-model="dataForm.propertyName" placeholder="请输入资产名称" readonly @focus="openSelectAsset" :disabled="disabled"
                           />
                      </el-form-item>
                    </el-col>
                         <el-col :sm="8" :xs="24"   >
                      <el-form-item label="常用位置" prop="position">
                        <el-input v-model="dataForm.position" placeholder="请输入常用位置"   :disabled="disabled"
                           />
                      </el-form-item>
                    </el-col>
                        <el-col :sm="8" :xs="24" v-if='$store.getters.configData.equipment.inspectionUserFlag'>
                      <el-form-item label="点检人员" prop="inspectionUserId">
                        <user-select v-model="dataForm.inspectionUserId" placeholder="请选择点检人员" style="width: 100%;" :disabled="disabled">
                        </user-select>
                      </el-form-item>
                    </el-col>
                        <el-col :sm="8" :xs="24" v-if="$store.getters.configData.equipment.maintenanceUserFlag">
                      <el-form-item label="保养人员" prop="maintenanceUserId">
                        <user-select v-model="dataForm.maintenanceUserId" placeholder="请选择保养人员" style="width: 100%;" :disabled="disabled">
                        </user-select>
                      </el-form-item>
                    </el-col>
                     <el-col :sm="12" :xs="24">
                        <el-form-item label="备注" prop="remark">
                          <el-input v-model="dataForm.remark" placeholder="请输入备注"
                            :disabled="disabled" type="textarea" :rows="2" maxlength="200" />
                        </el-form-item>
                      </el-col>
                  </el-row>
                </el-collapse-item>
      
              </el-form>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
            <UploadWj v-model="datafilelist" :disabled="disabled" :detailed="disabled"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
      <selectAsset v-if="selectAssetVisible" ref="assetRef" @selectAsset="changeAsset"></selectAsset>
    </div>
  </transition>
</template>

<script>
import {
  editEquEquipment, saveEquEquipment
  , getEquEquipmentInfo
} from '@/api/basicData/index'
import { getequMountedPlaces } from "@/api/basicData/materialSettings";
import { getBimBusinessDetail, getCategoryTrees, getCooperativeData, checkEquEquipmentCode } from '@/api/basicData/index'
import singleImg from '@/components/Upload/SingleImg'
import UploadImg from '@/components/upload-img/index.vue'
import axios from 'axios'
import formValidate from "@/utils/formValidate";
import getProjectLists from '@/mixins/generator/getProjectList'
import { getProjectList } from '@/api/system/projectManagement'
import { mapGetters } from 'vuex'
import selectAsset from './assetForm.vue'

export default {
  mixins: [getProjectLists],
  components: {
    singleImg,
    UploadImg,
    selectAsset
  }, 

  data() {
    return {
      
      selectAssetVisible:false,
      propertyKey:"",
      isProjectSwitch: '',
      loadingprojectId: false,
      projectIdList: [],
      isattachmentswitch: '',
      categoryId: '',
      factorylistLoading: false,
      mountedPlacesList: [],
      factoryFloorList: [],
      activeNames: ["basicInfo", "sbInfo"],
      getCooperativeData,
      datafilelist: [],
      activeName: "jcInfo",
      getCategoryTrees,
      uploadCode: 'SB',
      action: `${process.env.VUE_APP_BASE_API}/api/extend/Document/Uploader`, // 后期替换上传接口
      areaList: [],
      provinces: [],
      cities: [],
      area: [],
      billingTypeList: [],
      paymentMethodList: [],
      listQuery: {
        keyword: ''
      },
      typeOptions: [],
      nodeId: -1,

      defaultFlagList: [
        {
          value: true,
          text: "是"
        }, {
          value: false,
          text: "否"
        }
      ],
      sexList: [
        {
          value: "男",
          label: "男"
        },
        {
          value: "女",
          label: "女"
        },
      ],
      visible: false,
      btnLoading: false,
      formLoading: false,
      gradeList: [],
      picArr: [],
      type: '',
      dataForm: {
        maintenanceUserId:"",
        inspectionUserId:"",
        propertyId:"",
        propertyName:"",
        projectId: '',
        repairUserId: '',
        salespersonId: "",
        purchaseAmount: "",
        id: "",
        name: null, //工具名称
        shortName: null, //工具简称
        code: null, //工具编码
        productCategoryId: null, //工具分类
        grade: null, //安全等级
        serviceLife: null, //使用年限
        specModel: null, //规格型号
        userDepartmentId: null, //使用部门
        userDepartmentName: null, //使用部门
        factoryFloorId: null,
        mountedPlacesId: null,
        cooperativePartnerId: null, //供应商
        supplier: null, //生产厂家
        serialNo: null, //序列号
        warrantyDate: null, //保修日期
        state: 'normal', //工具状态
        scrapDate: null, //报废日期
        purchaseDate: null, //购买日期
        productDate: null, //制造日期
        weight: null, //重量
        ratedVoltage: null, //额定电压V
        ratedCurrent: null, //额定电流A
        power: null, //额定功率KW
        equLong: null, //长
        width: null, //宽
        height: null, //高
        equipmentValue: null, //工具原值（万元）
        theoryBeat: '', //理论节拍
        usin: '', //用途
        remark: '', //备注
        pic: '', //图片
        userId: '', //使用人
        attachmentList: [], //bim附件
        purchaserId: "",
        productCategoryName: null, //工具名称
        deviceType: 'normal',
        partnerName: '',
      },
      userList: [],
      deviceTypeList: [
        { value: "normal", label: "正常工具" },
        { value: "virtually", label: "虚拟工具" },
      ],
      // 工具状态
      equipmentStatusList: [
        {
          value: "normal",
          label: "正常"
        },
        {
          value: "repair",
          label: "维修"
        },
        {
          value: "discard",
          label: "报废"
        },
        {
          value: "spare",
          label: "备用"
        },
        {
          value: "stop",
          label: "停用"
        },
        {
          value: "abnormal",
          label: "异常"
        }
      ],
      categoryIdProps: {
        'label': 'name',
        'value': 'id',
        'children': 'childrenList'
      },
      contactsList: [],
      deliveryAddressList: [],
      parentId: '',
      organizeIdTree: [],
      disabled: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      requestObj: {
        orderItems: [{
          asc: false,
          column: 'create_time'
        }],
        pageSize: -1,
        classAttribute: 'tool'
      },
      parentRequsetObj: {
        pageNum: 1,
        pageSize: -1,
        "orderItems": [
          {
            "asc": true,
            "column": ""
          },
        ],
        keyword: '',
        type: 'equipment_supplier'
      },
      partnerList: [],
      dataRule: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          // { validator: this.formValidate('enCode', '公司编码只能输入英文、数字和小数点且小数点不能放在首尾'), trigger: 'blur' },
          // { max: 50, message: '公司编码最多为50个字符！', trigger: 'blur' }
        ],
         propertyName: [
          { required: true, message: '请选择资产', trigger: 'blur' },
       
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          // { validator: this.formValidate('fullName', '编码不能含有特殊符号'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              console.log(this.dataForm.id);
              checkEquEquipmentCode(value, this.dataForm.id, 'equipment').then(res => {
                console.log('res===>', res);
                if (res.data) {
                  callback(new Error("编码重复"));
                } else {
                  callback();
                }
              }).catch(error => {
              })
            }, trigger: 'blur'
          },
        ],
        state: [{ required: true, message: '请选择工具状态', trigger: 'change' }],
        maintenanceUserId:[{ required: true, message: '请选择保养人员', trigger: 'change' }],
        inspectionUserId:[{ required: true, message: '请选择点检人员', trigger: 'change' }],
        productCategoryName: [
          { required: true, message: '请选择工具分类', trigger: 'change' }
        ],
        // unitVolume: [{ validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
        equLong: [{ validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
        width: [{ validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
        height: [{ validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
        ratedVoltage: [{ validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
        ratedCurrent: [{ validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
        power: [{ validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
        purchaseAmount: [{ validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
        weight: [{ validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
        equipmentValue: [{ validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }]
      }
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.getProjectListdata()
    this.getBimBusinessDetail()
    this.getfactoryFloor()
    console.log("444",this.$store.getters.configData.equipment.inspectionUserSetting);
  },
  computed: {
    ...mapGetters(['userInfo'])
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
      this.$set(this.dataForm,'propertyId',data.id) 
      this.$set(this.dataForm,'propertyName',data.name) 
    },
    getProjectListdata() {
      let query = {
        pageNum: 1,
        pageSize: -1
      }
      this.loadingprojectId = true
      getProjectList(query).then((res) => {
        this.loadingprojectId = false
        this.projectIdList = res.data.records
      }).catch(() => { })
    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_sbda'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
        this.categoryId = res.data.configValue2
      })
    },
    getfactoryFloor() {
      let obj = {
        pageNum: 1,
        pageSize: -1,
      }
      this.factorylistLoading = true
      getequMountedPlaces(obj).then(res => {
        this.factoryFloorList = res.data.records.filter(item => item.type == 'workshop')
        this.mountedPlacesList = res.data.records.filter(item => item.type == 'location')
        this.factorylistLoading = false
      }).catch(() => {
        this.factorylistLoading = false
      })
    },
    changePic(data) {
      if (data.length === 0) {

        this.picArr = []
      } else {
        this.picArr = data
        let bimAttachments = {
          businessType: "equipment",
          documentId: data[0].id,
          fileFlag: "工具",
          sort: 1
        }
        this.dataForm.attachmentList = [{ bimAttachments: bimAttachments }]
        this.dataForm.pic = data[0].url
      }
    },
    // 切换table
    handleClick(tab, event) {
    },
    onOrganizeChangeTwo(val, data, params) {
      this.$nextTick(() => {
        this.$refs['dataForm'].validateField('productCategoryName')
      })
      if (data && data.length) {
        this.dataForm.productCategoryName = data[0].all.name
        this.dataForm.productCategoryId = data[0].all.id
      } else {
        this.dataForm.productCategoryName = ''
        this.dataForm.productCategoryId = ''
      }
    },
    hanglerepairUserId(e, r) {
      this.dataForm.repairUserId = e
    },
    hangleSelectSales(e, r) {
      this.dataForm.userDepartmentId = r.parentId
      this.dataForm.userDepartmentName = r.organize
    },

    beforeUpload(file) {
      if (this.dataForm.pic && this.dataForm.pic.length > 0) {
        this.$message.error(`只能上传一张图片`)
        return false
      }
      let isAccept = new RegExp('image/*').test(file.type)
      if (!isAccept) {
        this.$message.error(`请上传图片`)
        return isAccept
      }
      return isAccept
    },

    // 上传文件
    uploadFile(file) {
      let uploadURL = `${process.env.VUE_APP_BASE_API}`
      axios.post(`${uploadURL}/api/extend/Document/Uploader`, file.file).then(res => {
        if (res.data.code === 200) {
          this.dataForm.pic.push(res.data.data)
        }
      }).catch(err => {
        console.log(err)
        this.$refs.upload.clearFiles()
      })
    },

    init(id, disabled, type,key) {
      console.log(disabled, id,'key',key);
      this.visible = true
      this.dataForm.id = id || ''
      this.organizeIdTree = []
      this.disabled = disabled
      this.type = type
      this.propertyKey=key
      if (this.dataForm.id) {
        getEquEquipmentInfo(this.dataForm.id).then(res => {
          this.$nextTick(() => {
            console.log("res", res.data)
            this.dataForm = res.data
            this.$set(this.dataForm, 'productCategoryName', res.data.categoryName)
            this.dataForm.userDepartmentId = [this.dataForm.userDepartmentId]
            // if (this.dataForm.attachmentList && this.dataForm.attachmentList.length) {
            //   this.picArr = res.data.attachmentList.map(item => ({
            //     url: this.dataForm.pic,
            //     id: item.bimAttachments.id
            //   }))
            // }
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
          })
        })
      }
    },
    goBack() {
      this.$emit('close')
    },
    onOrganizeChange(val, data) {
      this.dataForm.partnerCategoryId = data ? data[0].id : ''
      this.dataForm.partnerCategoryIdText = data ? data[0].name : ''
    },
    handleConfirm() {

      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(valid);
          this.btnLoading = true
          this.dataForm.classAttribute = 'tool'
          this.dataForm.productCategoryId = this.dataForm.productCategoryId
          // 如果userDepartmentId是数组，取最后一个值
          if (this.dataForm.userDepartmentId && typeof this.dataForm.userDepartmentId === 'object') {
            this.dataForm.userDepartmentId = this.dataForm.userDepartmentId[this.dataForm.userDepartmentId.length - 1]
          }
          if (!this.picArr.length) {
            this.dataForm.attachmentList = []
            this.dataForm.pic = ''
          }
          if (this.datafilelist.length) {
            this.datafilelist.map((item, index) => {
              item.bimAttachments = {
                businessType: 'system_attachment',
                configKey: 'fj_sbda',
                categoryId: this.categoryId,
                documentId: item.id,
                fileFlag: '',
                sort: index
              }
            })
          }
          this.dataForm.attachmentList = this.datafilelist
          // if (this.picArr.length) {
          //   console.log(111);
          //   let bimAttachments = {
          //     businessType: "equipment",
          //     documentId: this.picArr[0].id,
          //     fileFlag: "工具",
          //     sort: 1
          //   }
          //   this.dataForm.attachmentList = [{ bimAttachments: bimAttachments }]
          //   this.dataForm.pic = this.picArr[0].url
          //   // if (this.dataForm.pic && this.dataForm.pic.length) {
          //   //   this.dataForm.pic = this.dataForm.pic.map(item => item.url || item).join(',')
          //   //   console.log(11111,this.dataForm.pic);
          //   // }
          // } else{

          // }
          const formMethod = this.dataForm.id ? editEquEquipment : saveEquEquipment
          formMethod(this.dataForm).then(res => {
            let msg = "";
            if (formMethod == editEquEquipment) {
              msg = "修改成功"
            } else {
              msg = "新建成功"
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
    selectPartner(id, data) {
      this.dataForm.partnerName = data[0].name
      this.dataForm.cooperativePartnerId = data[0].id
    },
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