<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="!dataForm.id ? `新建模具档案` : disabled ? '查看模具档案' : '编辑模具档案'" />
        <div class="options">
          <el-button v-if="!disabled" type="primary" :loading="btnLoading" @click="handleConfirm()">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="jcInfo">
            <el-collapse v-model="activeNames">
              <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="140px" label-position="top">
                <el-collapse-item title="基本信息" name="basicInfo">
                  <el-row :gutter="20" class="custom-row">
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="模具类型" prop="categoryName" ref="comList1">
                        <!-- <JNPFTreeSelect v-model="dataForm.productCategoryId" placeholder="请选择模具类型" clearable
                  :options="categoryIdOptions" :props="categoryIdProps" :disabled="disabled">
                </JNPFTreeSelect> -->

                        <ComSelect-list :isdisabled="disabled" v-model="dataForm.categoryName" placeholder="请选择模具类型" auth @change="onOrganizeChangeTwo" :title="'选择模具类型'" :method="getCategoryTrees" :requestObj="requestObj" :paramsObj="{}" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="12" :xs="24">
                      <el-form-item label="模具名称" prop="name">
                        <el-input v-model="dataForm.name" placeholder="请输入模具名称" maxlength="64" :disabled="disabled" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="模具编码" prop="code">
                        <el-input v-model="dataForm.code" placeholder="请输入模具编码" maxlength="20" :disabled="disabled" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24" v-if="isProjectSwitch=='1'">
                      <el-form-item label="所属项目" prop="projectId">
                        <el-select v-model="dataForm.projectId" placeholder="请选择所属项目" :loading="loadingprojectId" :disabled="type !== 'add'" style="width: 100%;">
                          <el-option v-for="item in projectIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="模穴数量" prop="specModel">
                        <el-input maxlength="50" v-model="dataForm.specModel" placeholder="请输入模穴数量" :disabled="disabled" />
                      </el-form-item>
                    </el-col>

                    <!-- <el-col :sm="12" :xs="24">
              <el-form-item label="使用人" prop="userId">
                <el-select v-model="dataForm.userId" :disabled="disabled" filterable style="width: 100%;">
                  <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="8">
              <el-form-item label="使用部门" prop="userDepartmentId">
                <ComSelect v-model="organizeIdTree" placeholder="请选择使用组织部门" :currOrgId="dataForm.userDepartmentId || '0'"
                  auth @change="onOrganizeChangeHandle" :disabled="disabled" />
              </el-form-item>
            </el-col> -->
                    <!-- <el-col :sm="12" :xs="24">
                      <el-form-item label="图号" prop="drawingNo">
                        <el-input v-model="dataForm.drawingNo" placeholder="请输入图号" maxlength="50" :disabled="disabled">
                        </el-input>
                      </el-form-item>
                    </el-col> -->
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="用途" prop="usin">
                        <el-input maxlength="200" v-model="dataForm.usin" placeholder="请输入用途" :disabled="disabled" />
                      </el-form-item>
                    </el-col>
                    <!-- <el-col :sm="12" :xs="24">
              <el-form-item label="使用人" prop="userId">
                <user-select v-model="dataForm.userId" placeholder="请选择使用人" style="width: 100%;" :disabled="disabled"
                  @change="hangleSelectSales">
                </user-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="8">
              <el-form-item label="使用部门" prop="departmentId">
                <el-input v-model="dataForm.departmentName" readonly placeholder="请输入使用部门" :disabled="disabled" />
              </el-form-item>
            </el-col> -->
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="负责人" prop="userId">
                        <user-select v-model="dataForm.userId" placeholder="请选择负责人" clearable style="width: 100%;" :disabled="disabled" @change="getuserDepartment">
                        </user-select>

                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="负责人部门" prop="userDepartmentName">
                        <el-input v-model="dataForm.userDepartmentName" readonly placeholder="请输入负责人部门" :disabled="disabled" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24" v-if="type !== 'add'">
                      <el-form-item label="模具状态" prop="state">
                        <el-select v-model="dataForm.state" placeholder="请选择模具状态" clearable :disabled="type !== 'add'" style="width: 100%;">
                          <el-option v-for="( item, index ) in  equipmentStatusList " :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input maxlength="200" class="shuru" v-model="dataForm.remark" placeholder="请输入备注" type="textarea" :rows="2" :disabled="disabled" style="width: 100%;" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
                <el-collapse-item title="模具参数" name="gjInfo">
                  <el-row :gutter="20" class="custom-row">
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="长（cm）" prop="equLong">
                        <el-input v-model="dataForm.equLong" placeholder="请输入长" :disabled="disabled">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="宽（cm）" prop="width">
                        <el-input v-model="dataForm.width" placeholder="请输入宽" :disabled="disabled">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="高（cm）" prop="height">
                        <el-input v-model="dataForm.height" placeholder="请输入高" :disabled="disabled">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="体积" prop="unitVolume">
                        <el-input v-model="dataForm.unitVolume" placeholder="请输入体积" :disabled="disabled" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-form>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
            <UploadWj v-model="datafilelist" :disabled="type=='look'" :detailed="type=='look'"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { getBimBusinessDetail } from '@/api/basicData/index'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { getOrganizeInfo } from '@/api/permission/organize'
import {
  editEquEquipment, saveEquEquipment
  , getEquEquipmentInfo
} from '@/api/basicData/index'
import { getCategoryTrees, getUserList, checkEquEquipmentCode } from '@/api/basicData/index'
import {
  getProvinceList,
} from '@/api/system/province'
import {
  getDataInterfaceRes
} from '@/api/systemData/dataInterface'
import { getEffectUnitList } from '@/api/basicData/materialSettings'
import singleImg from '@/components/Upload/JXSingleImg'

import formValidate from "@/utils/formValidate";
import getProjectLists from '@/mixins/generator/getProjectList'
import { getProjectList } from '@/api/system/projectManagement'
import { mapGetters } from 'vuex'
export default {
  mixins: [getProjectLists],
  components: {
    singleImg
  },
  data() {
    return {
      isProjectSwitch: '',
      loadingprojectId: false,
      projectIdList: [],
      isattachmentswitch: '',
      categoryId: '',
      activeNames: ["basicInfo", "gjInfo"],
      datafilelist: [],
      activeName: "jcInfo",
      getCategoryTrees,
      areaList: [],
      title: '',
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
      type: '',
      dataForm: {
        projectId: '',
        id: "",
        name: null, //设备名称
        shortName: null, //设备简称
        code: null, //设备编码
        drawingNo: null, //图号
        unitVolume: null, //单位
        state: 'normal', //设备状态
        remark: '', //备注
        departmentId: "",
        specModel: "",
        equLong: "",
        width: "",
        height: "",
        usin: "",
        userId: "",
        departmentName: "",
      },
      requestObj: {
        orderItems: [{
          asc: false,
          column: 'create_time'
        }],
        pageNum: 1,
        pageSize: -1,
        classAttribute: 'mold'
      },
      userList: [],
      // 模具状态
      equipmentStatusList: [
        {
          value: "normal",
          label: "正常"
        },
        {
          value: "verification",
          label: "检定"
        },
        {
          value: "use",
          label: "领用"
        },
        {
          value: "discard",
          label: "报废"
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
      natureData: [],
      industryData: [],
      categoryIdOptions: [],
      disabled: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      partnerList: [],
      dataRule: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          // { validator: this.formValidate('enCode', '公司编码只能输入英文、数字和小数点且小数点不能放在首尾'), trigger: 'blur' },
          // { max: 50, message: '公司编码最多为50个字符！', trigger: 'blur' }
        ],
        state: [{ required: true, message: '请选择设备状态', trigger: 'change' }],
        unitVolume: [{ validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
        equLong: [{ validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
        width: [{ validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
        height: [{ validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { validator: this.formValidate('fullName', '编码不能含有特殊符号'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              console.log(this.dataForm.id);
              checkEquEquipmentCode(value, this.dataForm.id, 'tool').then(res => {
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
        // categoryName: [
        //   { required: true, message: '请选择模具分类', trigger: 'change' }
        // ],
      }
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.getProjectListdata()
    this.getBimBusinessDetail()
    this.getDictionaryType()
    // this.gettypeOptions()
    this.getUserList()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
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
        configKey: 'fj_gjda'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
        this.categoryId = res.data.configValue2
      })
    },
    handleClick() { },
    onOrganizeChangeTwo(val, data, param) {
      if (!val && data.length) return
      if (!data) return
      console.log(this.$refs);
      if (data.length === 0) {
        this.$refs['dataForm'].validateField()
      } else {
        this.$refs['dataForm'].fields[0].resetField()
        this.dataForm.categoryName = data[0].name
        this.dataForm.productCategoryId = data[0].id
      }
      // this.$refs['dataForm'].validateField('productCategoryId')
      console.log(data);

    },
    getuserDepartment(r, s) {
      console.log(r, s);
      this.parentId = s.parentId
      this.dataForm.userDepartmentName = s.organize
    },
    // hangleSelectSales(e, r) {
    //   console.log(e,r,'部门');
    //   this.dataForm.departmentId = r.parentId || ''
    //   this.dataForm.departmentName = r.organize
    // },

    getUserList() {
      getUserList({
        currentPage: 1,
        pageSize: 1000
      }).then(res => {
        this.userList = res.data.list
      })
    },
    beforeUpload(file) {
      // if (this.dataForm.pic && this.dataForm.pic.length > 0) {
      //   this.$message.error(`只能上传一张图片`)
      //   return false
      // }
      // let isAccept = new RegExp('image/*').test(file.type)
      // if (!isAccept) {
      //   this.$message.error(`请上传图片`)
      //   return isAccept
      // }
      // return isAccept
    },
    // 获取计量单位
    // gettypeOptions() {
    //   getEffectUnitList().then(res => {
    //     this.typeOptions = res.data
    //   })
    // },
    handlerEquChange(value, node) {
      console.log(value, node)
      if (node) {
        this.dataForm.name = node.name
        this.dataForm.code = node.code
      }
    },
    getChildrenList(data) {
      let arr = []
      data.forEach(item => {
        arr.push(item)
        if (item.childrenList && item.childrenList.length) {
          arr = arr.concat(this.getChildrenList(item.childrenList))
        }
      })
      return arr
    },
    // 获取设备分类
    // getCategoryIdOptions() {
    //   let listQuery = {
    //     page: 1,
    //     limit: 999,
    //     keyword: '',
    //     classAttribute: 'mold'
    //   }
    //   getCategoryTrees(listQuery).then(res => {
    //     this.categoryIdOptions = res.data
    //   }).catch(() => {
    //   })
    // },
    // 收获信息删除当前行
    deleteth(row, index) {
      this.deliveryAddressList.splice(row.$index, 1)

    },
    // 联系人信息删除当前行
    deltable(row, index) {
      console.log("row", row, index)
      this.contactsList.splice(row.$index, 1)
    },
    // 根据选择的省份获取相应的城市数据
    changeProvince(item) {
      console.log("item", item)
      getProvinceList(item.id).then(res => {
        console.log(res)
        this.cities = res.data.list
      })
    },
    handleSuccess(res, file, files) {
      if (!this.dataForm.pic) {
        this.dataForm.pic = []
      }
      this.dataForm.pic.push(res.data)
    },
    handleRemove(file, fileList, fileIndex) {
      this.dataForm.pic.splice(fileIndex, 1)
    },
    // // 使用部门
    // onOrganizeChange(val, data) {
    //   this.dataForm.userDepartmentId = data[0].id
    //   this.dataForm.userDepartmentName = data[0].name
    // },
    // 根据选择的城市获取各区的数据
    changeCity(item) {
      console.log("item", item)
      getProvinceList(item.id).then(res => {
        console.log(res)
        this.area = res.data.list
      })
    },
    // 获取省份数据
    getProvinceList() {
      getProvinceList(this.nodeId, this.listQuery).then(res => {
        console.log("省份数据", res)
        this.provinces = res.data.list
        this.init(id, parentId)
      }).catch(() => {
        this.listLoading = false
        this.btnLoading = false
        this.refreshTable = true
      })
    },


    // 获取等级、付款方式数据
    getDictionaryType() {
      getDictionaryType().then(res => {
        console.log("rescc", res)
        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "partnerArchives") {
            let children = item.children
            children.forEach(resp => {
              if (resp.enCode == "grade") {
                let id = resp.id
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  console.log("response", response)
                  this.gradeList = response.data.list
                })
              }
              if (resp.enCode == "regionCode") {
                let id = resp.id
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  console.log("地区", response)
                  this.areaList = response.data.list
                })
              }
              if (resp.enCode == "paymentMethod") {
                let id = resp.id
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  console.log("付款方式", response)
                  this.paymentMethodList = response.data.list
                })
              }
              if (resp.enCode == "billingType") {
                let id = resp.id
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.billingTypeList = response.data.list
                })
              }
            })

          }

        })
      })
    },




    init(id, disabled, type) {

      this.visible = true
      this.dataForm.id = id || ''
      this.type = type
      this.organizeIdTree = []
      this.disabled = disabled
      if (this.dataForm.id) {
        this.title = '编辑模具档案'
        getEquEquipmentInfo(this.dataForm.id).then(res => {
          console.log(res, '详情');
          this.$nextTick(() => {
            this.dataForm = res.data
            // if (!this.dataForm.userDepartmentId) {

            // } else {
            //   getOrganizeInfo(this.dataForm.userDepartmentId).then(sss => {
            //     this.organizeIdTree = sss.data.organizeIdTree || []
            //     console.log("this.dataForm.departmentId", this.dataForm.userDepartmentId);
            //     this.organizeIdTree.push(this.dataForm.userDepartmentId)
            //   })
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
    // onOrganizeChange(val, data) {
    //   console.log(111, data);
    //   this.dataForm.userDepartmentId = data ? data[data.length - 1].id : ''
    //   this.dataForm.userDepartmentIdText = data ? data[data.length - 1].name : ''
    // },
    handleConfirm() {

      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataForm.userDepartmentId = this.parentId
          this.btnLoading = true
          this.dataForm.classAttribute = 'mold'
          if (this.datafilelist.length) {
            this.datafilelist.map((item, index) => {
              item.bimAttachments = {
                businessType: 'system_attachment',
                configKey: 'fj_gjda',
                categoryId: this.categoryId,
                documentId: item.id,
                fileFlag: '',
                sort: index
              }
            })
          }
          this.dataForm.attachmentList = this.datafilelist
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
