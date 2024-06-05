<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="!dataForm.id ? '新建意向客户' : btnType ? '查看意向客户' : '编辑意向客户'" />
        <div class="options" v-if="!btnType">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm()">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="jcInfo">
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="8" :xs="24">
                  <el-form-item label="所属分类" prop="partnerCategoryId">
                    <ComSelect2 v-model="dataForm.partnerCategoryIdText" :isdisabled="isdisabled" placeholder="请选择所属分类"
                      auth isOnlyOrg @change="onOrganizeChange" :currOrgId="parentId" :parentId="parentId"
                      :type="dataForm.type" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="税号" prop="taxId">
                    <el-input v-model="dataForm.taxId" placeholder="请输入税号" :disabled="btnType ? true : false"
                      maxlength="25" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="意向客户名称" prop="name">
                    <el-input v-model="dataForm.name" placeholder="请输入意向客户名称" :disabled="btnType ? true : false"
                      maxlength="100" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="英文名称" prop="nameEn">
                    <el-input v-model="dataForm.nameEn" placeholder="请输入英文名称" :disabled="btnType ? true : false"
                      maxlength="200" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="联系人" prop="contacts">
                    <el-input v-model="dataForm.contacts" placeholder="请输入联系人" :disabled="btnType ? true : false"
                      maxlength="50" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="负责人" prop="personResponsible">
                    <el-input v-model="dataForm.personResponsible" placeholder="请输入负责人" maxlength="20"
                      :disabled="btnType ? true : false" />
                  </el-form-item>
                </el-col>
                <!-- <el-col :sm="8" :xs="24">
                  <el-form-item label="所属销售人员" prop="salespersonId">
                    <user-select v-model="dataForm.salespersonId" placeholder="请选择所属销售人员" clearable style="width: 100%;"
                      :disabled="btnType ? true : false">
                    </user-select>
                  </el-form-item>
                </el-col> -->


                <el-col :sm="8" :xs="24">
                  <el-form-item label="地区" prop="regionCode">
                    <el-select v-model="dataForm.regionCode" placeholder="请选择地区" style="width: 100%;"
                      :disabled="btnType ? true : false" @change="handleChange">
                      <el-option v-for="(item, index) in areaList" :key="index" :label="item.fullName"
                        :value="item.enCode"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="国家" prop="country">
                    <el-select v-model="dataForm.country" placeholder="请选择国家" style="width: 100%;"
                      v-if="dataForm.regionCode == 'foreign'" :disabled="btnType ? true : false" filterable>
                      <el-option v-for="(item, index) in countryList" :disabled="item.code == 'CN'" :key="index"
                        :label="item.name" :value="item.code"></el-option>
                    </el-select>
                    <el-select v-model="dataForm.country" placeholder="请选择国家" style="width: 100%;" v-else
                      :disabled="btnType ? true : false">
                      <el-option v-for="(item, index) in countryList" :key="index" :label="item.name"
                        :value="item.code"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24" v-if="dataForm.regionCode != 'foreign'">
                  <el-form-item label="省" prop="province">
                    <el-select v-model="dataForm.province" placeholder="请选择省" style="width: 100%;"
                      :disabled="btnType ? true : false">
                      <el-option v-for="item in provinces" size="small" :key="item.id" :label="item.fullName"
                        :value="item.id" @click.native="changeProvince(item)">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24" v-if="dataForm.regionCode != 'foreign'">
                  <el-form-item label="市" prop="city">
                    <el-select v-model="dataForm.city" placeholder="请选择市" style="width: 100%;"
                      :disabled="btnType ? true : false">
                      <el-option v-for="item in cities" size="small" :key="item.id" :label="item.fullName"
                        :value="item.id" @click.native="changeCity(item)">{{ item.fullName }}
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24" v-if="dataForm.regionCode != 'foreign'">
                  <el-form-item label="区" prop="area">
                    <el-select v-model="dataForm.area" placeholder="请选择区" style="width: 100%;"
                      :disabled="btnType ? true : false">
                      <el-option v-for="item in area" size="small" :key="item.id" :label="item.fullName" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :sm="8" :xs="24">
                  <el-form-item label="地址" prop="address">
                    <el-input v-model="dataForm.address" placeholder="请输入地址" :disabled="btnType ? true : false"
                      maxlength="300" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="电话" prop="phone">
                    <el-input v-model="dataForm.phone" placeholder="请输入电话" :disabled="btnType ? true : false"
                      maxlength="20" />
                  </el-form-item>
                </el-col><el-col :sm="8" :xs="24">
                  <el-form-item label="手机号" prop="mobilePhone">
                    <el-input v-model="dataForm.mobilePhone" placeholder="请输入手机号" :disabled="btnType ? true : false"
                      maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="传真" prop="fax">
                    <el-input v-model="dataForm.fax" placeholder="请输入传真" :disabled="btnType ? true : false"
                      maxlength="50" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="邮政编码" prop="zipCode">
                    <el-input v-model="dataForm.zipCode" placeholder="请输入邮政编码" :disabled="btnType ? true : false"
                      maxlength="10" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="dataForm.email" placeholder="请输入邮箱" :disabled="btnType ? true : false"
                      maxlength="100" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="网址" prop="website">
                    <el-input v-model="dataForm.website" placeholder="请输入网址" :disabled="btnType ? true : false"
                      maxlength="512" />
                  </el-form-item>
                </el-col>





                <el-col :sm="8" :xs="24">
                  <el-form-item label="开户银行" prop="bank">
                    <el-input v-model="dataForm.bank" placeholder="请输入开户银行" :disabled="btnType ? true : false"
                      maxlength="100" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="银行账号" prop="bankInfo">
                    <el-input v-model="dataForm.bankInfo" placeholder="请输入银行账号" :disabled="btnType ? true : false"
                      maxlength="100" />
                  </el-form-item>
                </el-col>

                <el-col :sm="8" :xs="24">
                  <el-form-item label="渠道类型" prop="channel">
                    <el-select v-model="dataForm.channel" placeholder="请选择渠道类型" clearable style="width: 100%;"
                      :disabled="btnType ? true : false">
                      <el-option v-for="(item, index) in channelList" :key="index" :label="item.fullName"
                        :value="item.enCode"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" maxlength="200"
                      :disabled="btnType ? true : false" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="datafilelist" :disabled="!!btnType" :detailed="!!btnType"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import {
  getCounryData, privateDetail, editPrivate, addPrivate
} from '@/api/basicData/index'
import {
  getProvinceList,
} from '@/api/system/province'
import formValidate from "@/utils/formValidate";
export default {
  data() {
    return {
      datafilelist: [],
      activeName: "jcInfo",
      btnType: undefined,
      areaList: [],
      provinces: [],
      cities: [],
      area: [],
      channelList: [],
      contactsList: [],
      countryList: [],
      listQuery: {
        keyword: ''
      },
      nodeId: -1,
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataForm: {
        // 合作伙伴
        taxId: '',
        name: '',
        nameEn: "",
        regionCode: '',
        country: '',
        province: '',
        city: '',
        area: '',
        address: '',
        contacts: '',
        phone: '',
        mobilePhone: '',
        fax: "",
        zipCode: "",
        personResponsible: '',
        email: "",
        taxRate: "",
        website: "",
        remark: "",
        id: "",
        type: "public_private_sea",
        departmentId: "",
        partnerCategoryIdText: "",
        partnerCategoryId: "",
        attachmentList: []
      },
      parentId: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      dataRule: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          // { validator: this.formValidate('enCode', '公司编码只能输入英文、数字和小数点且小数点不能放在首尾'), trigger: 'blur' },
          // { max: 50, message: '公司编码最多为50个字符！', trigger: 'blur' }
        ],
        mobilePhone: [{ validator: formValidate('iphone'), trigger: 'blur' }, { validator: this.validateField2, trigger: 'blur' }],

        contacts: [
          {
            required: true, message: "请输入联系人", trigger: "blur"
          }
        ]

      },
      userInfo: {},
    }
  },
  created() {
    this.getProvinceList()
    this.getDictionaryType()
  },
  mounted() {

    console.log(this.$store.state);
    this.userInfo = this.$store.state.user.userInfo
  },
  methods: {
    // 电话 手机 二填一
    validateField2(rule, value, callback) {
      if (!this.dataForm.phone && !value) {
        callback(new Error('电话和手机号至少填一个'));
      } else {
        callback();
      }
    },
    // 切换table
    handleClick(tab, event) {
      console.log(tab, event);
    },
    onOrganizeChange(val, data) {
      console.log("123", val, data);
      this.dataForm.partnerCategoryId = data ? data[0].id : ''
      this.dataForm.partnerCategoryIdText = data ? data[0].name : ''
    },
    handleChange($event) {
      if ($event == 'domestic') {
        // 国内
        this.countryList = [{
          code: "CN",
          id: "1663107232693223475",
          name: "中国",
          nameEn: "China",
        }]
        this.dataForm.country = "CN"
        this.dataForm.province = ""
        this.dataForm.city = ""
        this.dataForm.area = ""
        console.log("countryList", this.countryList);
        this.area = []
        this.cities = []
      } else {
        this.dataForm.country = ''

        this.countryList = []
        let obj = {
          "keyword": "",
          "orderItems": [
            {
              "asc": true,
              "column": ""
            }
          ],
          "pageNum": 1,
          "pageSize": -1
        }
        getCounryData(obj).then(res => {
          this.countryList = res.data.records

        })
      }
    },
    // 根据选择的省份获取相应的城市数据
    changeProvince(item) {
      this.dataForm.city = ""
      this.dataForm.area = ""
      this.area = []
      getProvinceList(item.id).then(res => {
        console.log(res);
        this.cities = res.data.list
      })
    },
    // 根据选择的城市获取各区的数据
    changeCity(item) {
      getProvinceList(item.id).then(res => {
        console.log(res);
        this.area = res.data.list
      })
    },
    // 获取省份数据
    getProvinceList() {
      getProvinceList(this.nodeId, this.listQuery).then(res => {
        this.provinces = res.data.list
        this.init(id, this.parentId, this.btnType)
      }).catch(() => {
        this.listLoading = false
        this.btnLoading = false
        this.refreshTable = true
      })
    },


    // 获取等级、付款方式数据
    getDictionaryType() {
      getDictionaryType().then(res => {
        console.log("rescc", res);
        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "partnerArchives") {
            let children = item.children
            children.forEach(resp => {
              if (resp.enCode == "regionCode") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  console.log("地区", response);
                  this.areaList = response.data.list
                })
              }
              if (resp.enCode == "channel") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.channelList = response.data.list
                })
              }

            });

          }

        });
      })
    },




    init(id, parentId, btnType) {
      console.log(btnType);
      this.visible = true
      this.dataForm.id = id || ''
      this.parentId = parentId || ''
      if (btnType == 'add' || btnType == 'edit') {
        this.btnType = false
        this.isdisabled = false
      } else {
        this.isdisabled = true
        this.btnType = true

      }
      if (this.dataForm.id) {
        privateDetail(this.dataForm.id).then(res => {
          console.log("res------", res);
          if (res.data.regionCode == 'domestic') {
            // 国内
            this.countryList = [{
              code: "CN",
              id: "1663107232693223475",
              name: "中国",
              nameEn: "China",
            }]

          } else {

            this.dataForm.country = ''
            this.countryList = []
            let obj = {
              "keyword": "",
              "orderItems": [
                {
                  "asc": true,
                  "column": ""
                }
              ],
              "pageNum": 1,
              "pageSize": -1
            }
            getCounryData(obj).then(res => {
              this.countryList = res.data.records

            })
          }
          console.log("意向客户", res);
          if (res.data.province) {
            let obj = {
              id: res.data.province
            }
            this.changeProvince(obj)
          }
          if (res.data.city) {
            let ooo = {
              id: res.data.city
            }
            this.changeCity(ooo)
          }

          this.$nextTick(() => {
            this.dataForm = res.data
            this.dataForm.type = 'public_private_sea'
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
    handleConfirm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.regionCode == "foreign") {
            this.dataForm.province = ""
            this.dataForm.city = ""
            this.dataForm.area = ""
          }
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
          this.dataForm.attachmentList = this.datafilelist
          this.dataForm.departmentId = this.userInfo.departmentId
          this.btnLoading = true
          const formMethod = this.dataForm.id ? editPrivate : addPrivate
          formMethod(this.dataForm).then(res => {
            let msg = "";
            if (formMethod == editPrivate) {
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
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .el-tabs__header {
  padding: 0 !important;
}

.el-button--small {
  // padding: 1;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.main {
  padding: 0 20px;
}
</style>