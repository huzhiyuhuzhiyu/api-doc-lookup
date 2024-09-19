<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="!dataForm.id ? `新建设备` : disabled ? '查看设备' : '编辑设备'" />
        <div class="options" v-if="!disabled">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm()">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="jcInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="20" class="custom-row">
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="所属分类" prop="productCategoryName" ref="productCategoryName">
                        <ComSelect-list :isdisabled="disabled" v-model="dataForm.productCategoryName" placeholder="请选择设备类型" auth @change="onOrganizeChangeTwo" :title="'选择设备类型'" :method="getCategoryTrees" :requestObj="requestObjTwo" :paramsObj="{}" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="设备编码" prop="code">
                        <el-input v-model="dataForm.code" placeholder="请输入设备编码" maxlength="20" :disabled="disabled" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="设备名称" prop="name">
                        <el-input v-model="dataForm.name" placeholder="请输入设备名称" maxlength="20" :disabled="disabled" />
                      </el-form-item>
                    </el-col>

                    <!-- <el-col :sm="8" :xs="24">
              <el-form-item label="简称" prop="shortName">
                <el-input v-model="dataForm.shortName" placeholder="请输入" maxlength="50" />
              </el-form-item>
            </el-col> -->
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="设备规格" prop="specModel">
                        <el-input maxlength="50" v-model="dataForm.specModel" placeholder="请输入设备规格" :disabled="disabled" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="设备类型" prop="deviceType">
                        <el-select v-model="dataForm.deviceType" placeholder="请选择设备类型" :disabled="dataForm.id ? true : false" style="width: 100%;">
                          <el-option v-for="item in deviceTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <!-- <el-col :sm="8" :xs="24">
              <el-form-item label="计量单位" prop="unitVolume">
                <el-select v-model="dataForm.unitVolume" placeholder="请选择计量单位" :disabled="disabled" style="width: 100%;">
                  <el-option v-for="item in typeOptions" :key="item.id" :label="item.name"
                    :value="item.unitCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
                    <!-- <el-col :sm="8" :xs="24">
              <el-form-item label="安全等级" prop="unit">
                <el-select v-model="dataForm.grade" placeholder="请选择安全等级"  :disabled="disabled">
                    <el-option v-for="(item, index) in gradeList" :key="index" :label="item.fullName"
                      :value="item.enCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="额定使用年限" prop="serviceLife">
                        <el-input maxlength="9" oninput="value = value.replace(/\D/g, '')" v-model.number="dataForm.serviceLife" placeholder="请输入额定使用年限" :disabled="disabled" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="额定电压V" prop="ratedVoltage">
                        <el-input v-model="dataForm.ratedVoltage" placeholder="请输入额定电压V" :disabled="disabled" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="额定电流A" prop="ratedCurrent">
                        <el-input v-model="dataForm.ratedCurrent" placeholder="请输入额定电流A" :disabled="disabled" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="额定功率KW" prop="power">
                        <el-input v-model="dataForm.power" placeholder="请输入额定功率KW" :disabled="disabled" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="供应商" prop="partnerName">
                        <ComSelect-list :isdisabled="type === 'look'" v-model="dataForm.partnerName" placeholder="请选择供应商" auth @change="selectPartner" :title="'选择供应商'" :method="getCooperativeData" :requestObj="parentRequsetObj" :paramsObj="{}" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="8" :xs="24">
                      <el-form-item label="使用人" prop="userId">
                        <user-select v-model="dataForm.userId" placeholder="请选择使用人" style="width: 100%;" :disabled="disabled" @change="hangleSelectSales">
                        </user-select>
                      </el-form-item>
                    </el-col>

                    <el-col :sm="8" :xs="8">
                      <el-form-item label="使用部门" prop="userDepartmentId">
                        <el-input v-model="dataForm.userDepartmentName" readonly placeholder="请输入使用部门" :disabled="disabled" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="8" :xs="24">
                      <el-form-item label="存放地点" prop="storageLocation">
                        <el-input maxlength="100" v-model="dataForm.storageLocation" placeholder="请输入存放地点" :disabled="disabled" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="8" :xs="24">
                      <el-form-item label="采购金额(万元)" prop="purchaseAmount">
                        <el-input v-model="dataForm.purchaseAmount" placeholder="请输入采购金额" :disabled="disabled">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="生产厂家" prop="supplier">
                        <el-input maxlength="200" v-model="dataForm.supplier" placeholder="请输入生产厂家" :disabled="disabled" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="序列号" prop="serialNo">
                        <el-input maxlength="100" v-model="dataForm.serialNo" placeholder="请输入序列号" :disabled="disabled" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24" v-if="type !== 'add'">
                      <el-form-item label="设备状态" prop="state">
                        <el-select v-model="dataForm.state" placeholder="请选择设备状态" :disabled="type !== 'add'" style="width: 100%;">
                          <el-option v-for="( item, index ) in  equipmentStatusList " :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="理论节拍" prop="theoryBeat">
                        <el-input v-model.number="dataForm.theoryBeat" placeholder="请输入理论节拍" :disabled="disabled" maxlength="8" oninput="value = value.replace(/[^0-9]/g,'')" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="用途" prop="usin">
                        <el-input maxlength="200" v-model="dataForm.usin" placeholder="请输入用途" :disabled="disabled" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="重量（KG）" prop="weight">
                        <el-input v-model="dataForm.weight" placeholder="请输入重量" :disabled="disabled">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="设备原值（万元）" prop="equipmentValue">
                        <el-input v-model="dataForm.equipmentValue" placeholder="请输入设备原值" :disabled="disabled">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="长（cm）" prop="equLong">
                        <el-input v-model="dataForm.equLong" placeholder="请输入长" :disabled="disabled">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="宽（cm）" prop="width">
                        <el-input v-model="dataForm.width" placeholder="请输入宽" :disabled="disabled">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="高（cm）" prop="height">
                        <el-input v-model="dataForm.height" placeholder="请输入高" :disabled="disabled">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="保修截至时间" prop="warrantyDate">
                        <el-date-picker v-model="dataForm.warrantyDate" type="datetime" placeholder="请选择保修截至时间" value-format="yyyy-MM-dd HH:mm:ss" :disabled="disabled" style="width: 100%;" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="8" :xs="24">
                      <el-form-item label="采购人员" prop="purchaserId">
                        <user-select v-model="dataForm.purchaserId" placeholder="请选择采购人员" style="width: 100%;" :disabled="disabled">
                        </user-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="采购日期" prop="purchaseDate">
                        <el-date-picker v-model="dataForm.purchaseDate" type="date" placeholder="请选择购买日期" value-format="yyyy-MM-dd HH:mm:ss" :disabled="disabled" style="width: 100%;" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="制造日期" prop="productDate">
                        <el-date-picker v-model="dataForm.productDate" type="date" placeholder="请选择制造日期" value-format="yyyy-MM-dd HH:mm:ss" :disabled="disabled" style="width: 100%;" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="报废日期" prop="scrapDate">
                        <el-date-picker v-model="dataForm.scrapDate" type="date" placeholder="请选择报废日期" value-format="yyyy-MM-dd HH:mm:ss" :disabled="disabled" style="width: 100%;" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="24" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input maxlength="200" class="shuru" v-model="dataForm.remark" placeholder="请输入备注" type="textarea" :disabled="disabled" style="width: 100%;" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="datafilelist" :disabled="disabled" :detailed="disabled"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  editEquEquipment, saveEquEquipment
  , getEquEquipmentInfo
} from '@/api/basicData/index'
import { getCategoryTrees, getUserList, getCooperativeData, checkEquEquipmentCode } from '@/api/basicData/index'

import singleImg from '@/components/Upload/SingleImg'
import UploadImg from '@/components/upload-img/index.vue'
import axios from 'axios'
import formValidate from "@/utils/formValidate";
export default {
  components: {
    singleImg,
    UploadImg
  },
  data() {
    return {
      activeNames: ["basicInfo"],
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
        salespersonId: "",
        purchaseAmount: "",
        id: "",
        name: null, //设备名称
        shortName: null, //设备简称
        code: null, //设备编码
        productCategoryId: null, //设备分类
        grade: null, //安全等级
        serviceLife: null, //使用年限
        specModel: null, //规格型号
        userDepartmentId: null, //使用部门
        userDepartmentName: null, //使用部门
        storageLocation: null, //存放位置
        cooperativePartnerId: null, //供应商
        supplier: null, //生产厂家
        serialNo: null, //序列号
        warrantyDate: null, //保修日期
        state: 'normal', //设备状态
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
        equipmentValue: null, //设备原值（万元）
        theoryBeat: '', //理论节拍
        usin: '', //用途
        remark: '', //备注
        pic: '', //图片
        userId: '', //使用人
        attachmentList: [], //bim附件
        purchaserId: "",
        productCategoryName: '', //设备名称
        deviceType: 'normal',
        partnerName: '',
      },
      userList: [],
      deviceTypeList: [
        { value: "normal", label: "正常设备" },
        { value: "virtually", label: "虚拟设备" },
      ],
      // 设备状态
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
      requestObjTwo: {
        pageSize: -1,
        classAttribute: 'equipment'
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
        state: [{ required: true, message: '请选择设备状态', trigger: 'change' }],
        productCategoryName: [
          { required: true, message: '请选择设备分类', trigger: 'change' }
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
  created() {
  },
  methods: {
    changePic(data) {
      if (data.length === 0) {

        this.picArr = []
      } else {
        this.picArr = data
        let bimAttachments = {
          businessType: "equipment",
          documentId: data[0].id,
          fileFlag: "设备",
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
      if (!val && data.length) return
      if (!data) return
      if (data.length === 0) {
      } else {
        this.dataForm.productCategoryName = data[0].name
        this.dataForm.productCategoryId = data[0].id
      }
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

    init(id, disabled, type) {
      console.log(disabled, id);
      this.visible = true
      this.dataForm.id = id || ''
      this.organizeIdTree = []
      this.disabled = disabled
      this.type = type
      if (this.dataForm.id) {
        getEquEquipmentInfo(this.dataForm.id).then(res => {
          this.$nextTick(() => {
            console.log("res", res.data)
            this.dataForm = res.data
            this.dataForm.productCategoryName = res.data.categoryName
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
          this.dataForm.classAttribute = 'equipment'
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
                businessType: '',
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
          //     fileFlag: "设备",
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