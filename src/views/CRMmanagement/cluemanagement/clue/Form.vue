<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="btntype == 'edit' ? ' 编辑线索' : btntype == 'add' ? '新建线索' : '查看线索'" />
        <div class="options" v-if="btntype !== 'look'">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基础信息" name="jcInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo">
                <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top" label-width="120px">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="线索名称" prop="clueName">
                        <el-input v-model="dataForm.clueName" placeholder="请输入线索名称" maxlength="20" :disabled="btntype == 'look' ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="线索来源" prop="source">
                        <el-select v-model="dataForm.source" placeholder="请选择线索来源" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                          <el-option v-for="(item, index) in sourceList" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="负责人" prop="ownerUserId">
                        <user-select v-model="dataForm.ownerUserId" placeholder="请选择负责人" clearable style="width: 100%" :disabled="btntype == 'look'" @change="hangleSelectSales">
                        </user-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="dataForm.mobile" placeholder="请输入手机号" maxlength="20" :disabled="btntype == 'look' ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="电话" prop="telephone">
                        <el-input v-model="dataForm.telephone" placeholder="请输入电话" maxlength="20" :disabled="btntype == 'look' ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="邮箱" prop="email">
                        <el-input v-model="dataForm.email" placeholder="请输入邮箱" maxlength="20" :disabled="btntype == 'look' ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="地址" prop="provincecityarea">
                        <JNPF-Address v-model="dataForm.provincecityarea" @change="actiompro" placeholder="请选择地址" :disabled="btntype == 'look' ? true : false"></JNPF-Address>
                      </el-form-item>
                    </el-col>
                    <!-- <el-col :sm="8" :xs="24">
                  <el-form-item label="省" prop="province">
                    <el-select v-model="dataForm.province" placeholder="请选择省" style="width: 100%;" :disabled="btntype === 'look' ? true : false" :loading="foundationloadingprovince">
                      <el-option v-for="item in provinces" size="small" :key="item.id" :label="item.fullName" :value="item.id" @click.native="()=>{dataForm.city='',dataForm.area=''}">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="市" prop="city">
                    <el-select v-model="dataForm.city" placeholder="请选择市" style="width: 100%;" @focus="focusfoundation(dataForm.province)" :loading="foundationloadingcity" :disabled="btntype === 'look' ? true : false||!dataForm.province">
                      <el-option v-for="item in cities" size="small" :key="item.id" :label="item.fullName" :value="item.id" @click.native="()=>{dataForm.area=''}">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="区" prop="area">
                    <el-select v-model="dataForm.area" placeholder="请选择区" style="width: 100%;" @focus="foundationfocusactionarea(dataForm.city)" :loading="loadingareafoundation" :disabled="btntype === 'look' ? true : false||!dataForm.city">
                      <el-option v-for="item in area" size="small" :key="item.id" :label="item.fullName" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col> -->
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="详细地址" prop="address">
                        <el-input v-model="dataForm.address" placeholder="请输入详细地址" :disabled="btntype === 'look' ? true : false" maxlength="300" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="客户行业" prop="industry">
                        <el-select v-model="dataForm.industry" placeholder="请选择客户行业" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                          <el-option v-for="(item, index) in industryList" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="客户级别" prop="level">
                        <el-select v-model="dataForm.level" placeholder="请选择客户级别" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                          <el-option v-for="(item, index) in levelList" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="下次联系时间" prop="nextTime">
                        <el-date-picker v-model="dataForm.nextTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" placeholder="请选择下次联系时间" :disabled="btntype == 'look' ? true : false">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btntype == 'look'" type="textarea" maxlength="200" :rows="2" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
            </el-collapse>
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
import {
  getbimProductAttributes
} from "@/api/masterDataManagement/index";
import {
  getProvinceList,
} from '@/api/system/province'
import { addCluemanagement, updateCluemanagement, getCluemanagementDetail } from "@/api/basicData/index";
export default {
  data() {
    return {
      isattachmentswitch: '1',
      datafilelist: [],
      activeNames: ["basicInfo"],
      listQuery: {
        keyword: ''
      },
      nodeId: -1,
      foundationloadingprovince: false,
      foundationloadingcity: false,
      loadingareafoundation: false,
      area: [],
      cities: [],
      provinces: [],
      sourceList: [],
      levelList: [],
      industryList: [],
      activeName: "jcInfo",
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        provincecityarea: [],
        clueName: '',
        source: '',
        mobile: '',
        ownerUserId: "",
        telephone: "",
        id: "",
        email: "",
        province: "",
        city: "",
        area: "",
        address: '',
        industry: '',
        remark: '',
        nextTime: '',
        level: ''
      },
      btntype: false,
      dataRule: {
        mobile: [{ validator: this.formValidate('iphone'), trigger: 'blur' }, { validator: this.validateField2, trigger: 'blur' }],
        ownerUserId: [
          { required: true, message: '请选择负责人', trigger: 'blur' },
        ],
        clueName: [
          { required: true, message: '请输入线索名称', trigger: 'blur' },
        ]
      },
    }
  },
  created() {
    getbimProductAttributes('428523727035040965').then(res => {
      this.sourceList = res.data.list.length ? res.data.list : []
    })
    getbimProductAttributes('428119776947078341').then(res => {
      this.levelList = res.data.list.length ? res.data.list : []
    })
    getbimProductAttributes('585430056520656645').then(res => {
      this.industryList = res.data.list.length ? res.data.list : []
    })
    this.dataForm.ownerUserId = this.userInfo.userId
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    // 电话 手机 二填一
    validateField2(rule, value, callback) {
      if (!this.dataForm.telephone && !value) {
        callback(new Error('电话和手机号至少填一个'));
      } else {
        callback();
      }
    },
    actiompro(value) {
      if (value) {
        this.dataForm.province = value[0]
        this.dataForm.city = value[1]
        this.dataForm.area = value[2]
      } else {
        this.dataForm.province = ''
        this.dataForm.city = ''
        this.dataForm.area = ''
      }
    },
    //基础信息选择市
    focusfoundation(val) {
      this.foundationloadingcity = true
      getProvinceList(val).then(res => {
        this.cities = res.data.list
        this.foundationloadingcity = false
      })
    },
    //基础信息点击选择区
    foundationfocusactionarea(val) {
      this.loadingareafoundation = true
      getProvinceList(val).then(res => {
        this.area = res.data.list
        this.loadingareafoundation = false
      })
    },
    // 根据选择的城市获取各区的数据
    // changeCity(item) {
    //   this.dataForm.area = ""
    //   getProvinceList(item.id).then(res => {
    //     this.area = res.data.list
    //   })
    // },
    // 根据选择的省份获取相应的城市数据
    // changeProvince(item) {
    //   this.dataForm.city = ""
    //   this.dataForm.area = ""
    //   this.cities = []
    //   this.area = []
    //   getProvinceList(item.id).then(res => {
    //     this.cities = res.data.list
    //   })
    // },
    // 获取省份数据
    getProvinceList() {
      this.foundationloadingprovince = true
      getProvinceList(this.nodeId, this.listQuery).then(res => {
        this.provinces = res.data.list
        this.foundationloadingprovince = false
      })
    },
    //负责人
    hangleSelectSales(e, r) {
      this.$nextTick(() => { this.$refs.dataForm.validateField("ownerUserId") });
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type) {
      this.visible = true
      this.btntype = type
      this.dataForm.id = id || ''
      this.formLoading = true
      // this.getProvinceList()
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getCluemanagementDetail(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.dataForm.provincecityarea = []
            if (res.data.province) {
              this.dataForm.provincecityarea.push(res.data.province)
              this.dataForm.provincecityarea.push(res.data.city)
              this.dataForm.provincecityarea.push(res.data.area)
            }
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
            // getProvinceList(res.data.province).then(res => {
            //   this.cities = res.data.list
            // })
            // getProvinceList(res.data.city).then(res => {
            //   this.area = res.data.list
            // })
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
            ...this.dataForm,
            attachmentList: this.datafilelist
          }
          let formMethod = this.dataForm.id ? updateCluemanagement(obj) : addCluemanagement(obj);
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
