<template>
  <el-dialog append-to-body :title="!dataForm.id ? '新建收货地址' : '编辑收货地址'" :close-on-click-modal="false"
    :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
    width="800px">
    <el-row :gutter="24" class="">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :type="dataForm.type" :rules="dataRule"
        label-position="top" label-width="120px">
        <el-col :sm="12" :xs="24">
          <el-form-item label="收件人" prop="recipient">
            <el-input clearable v-model="dataForm.recipient" placeholder="请输入收件人" :disabled="type == 'look'"
              maxlength="20" />
          </el-form-item>
        </el-col>

        <el-col :sm="12" :xs="24">
          <el-form-item label="收件人电话" prop="phone">
            <el-input clearable v-model="dataForm.phone" placeholder="请输入收件人电话" :disabled="type == 'look'"
              maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="国家" prop="country">
            <el-select clearable v-model="dataForm.country" placeholder="请选择国家" filterable style="width: 100%;"
              :disabled="type == 'look'">
              <el-option v-for="(item, index) in countryList" :key="index" :label="item.name"
                @click.native="changeCountry(item)" :value="item.code">{{ item.name }}</el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :xs="24" v-if="this.dataForm.country === 'CN'">
          <el-form-item label="省" prop="province">

            <el-select clearable v-model="dataForm.province" placeholder="请选择省" style="width: 100%;"
              :disabled="type == 'look'">
              <el-option v-for="item in provinces" size="small" :key="item.id" :label="item.fullName" :value="item.id"
                @click.native="changeProvince(item)">{{ item.fullName }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :xs="24" v-if="this.dataForm.country === 'CN'">
          <el-form-item label="市" prop="city">
            <el-select clearable v-model="dataForm.city" placeholder="请选择市" style="width: 100%;"
              :disabled="type == 'look'">
              <el-option v-for="item in cities" size="small" :key="item.id" :label="item.fullName" :value="item.id"
                @click.native="changeCity(item)">{{ item.fullName }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" :xs="24" v-if="this.dataForm.country === 'CN'">
          <el-form-item label="区" prop="area">

            <el-select clearable v-model="dataForm.area" placeholder="请选择区" style="width: 100%;"
              :disabled="type == 'look'">
              <el-option v-for="item in area" size="small" :key="item.id" :label="item.fullName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :xs="24">
          <el-form-item label="地址" prop="address">
            <el-input v-model="dataForm.address" type="textarea" :rows="3" maxlength="200" placeholder="请输入地址" />
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { getCounryData, getCooperativeData } from '@/api/basicData/index'
import { getProvinceList, } from '@/api/system/province'
import formValidate from "@/utils/formValidate";
import { addPartnerAddress, editaddress, getAddressInfo, deleteAddress, detailAddress } from '@/api/basicData/index'
export default {
  data() {
    return {
      type: '',
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      dataForm: {
        address: "",
        area: "",
        city: "",
        cooperativePartnerId: '',
        country: "",
        defaultFlag: true,
        id: '',
        phone: "",
        province: "",
        recipient: "",
        remark: ""
      },
      nodeId: -1,
      countryList: [],
      provinces: [],
      cities: [],
      area: [],
      dataRule: {
        country: [{ required: true, message: '请选择国家', trigger: 'change' },],
        province: [{ required: true, message: '请选择省份', trigger: 'change' }],
        city: [{ required: true, message: '请选择城市', trigger: 'change' }],
        area: [{ required: true, message: '请选择地区', trigger: 'change' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话', trigger: 'blur' }, { validator: this.formValidate('iphone'), trigger: 'blur' },],
        recipient: [{ required: true, message: '请输入收件人名称', trigger: 'change' }, { validator: formValidate('fullName'), trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getProvinceList()
    this.getCounryDatas()
  },
  methods: {
    changeCountry(e) {
      console.log(e);
      this.dataForm.country
    },
    // 国家
    getCounryDatas() {
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
        console.log("国家数据", res);
        // this.countryList = res.data.records
        let a = res.data.records.filter((item) => {
          return item.name !== '中国'
        })
        let b = res.data.records.filter((item) => {
          return item.name == '中国'
        })
        // console.log('国家',abc);
        a.unshift(b[0])
        // console.log(res);
        this.countryList = a
      })
    },
    // 获取省份数据
    getProvinceList() {
      this.area = []
      this.cities = []

      if (this.type === 'add' || this.type === 'edit') {
        this.dataForm.city = ""
        this.dataForm.area = ""
      }
      console.log(this.dataForm.country);
      if (this.dataForm.country != 'CN') {
        this.countryShow = false
      }
      getProvinceList(this.nodeId, this.dataForm).then(res => {
        console.log("省份数据", res);
        this.provinces = res.data.list
      }).catch(() => {
        this.listLoading = false
        this.btnLoading = false
        this.refreshTable = true
      })
    },
    // 城市数据
    changeProvince(item, row) {
      console.log("item", item);
      this.area = []

      if (this.type === 'add' || this.type === 'edit') {
        this.dataForm.area = ""
        this.dataForm.city = ""
      }
      getProvinceList(item.id).then(res => {
        console.log(res, '市');
        this.cities = res.data.list
      })
    },
    // 各区的数据
    changeCity(item, row) {
      console.log(item, row);
      console.log("item", item);
      // this.dataForm.city = ""
      if (this.type === 'add' || this.type === 'edit') {
        this.dataForm.area = ""
      }
      getProvinceList(item.id).then(res => {
        console.log(res, '区');
        this.area = res.data.list
      })
    },

    init(id, type, parentId) {
      this.visible = true
      this.dataForm.id = id || ''
      // console.log(id,type,parentId);
      this.type = type
      this.dataForm.cooperativePartnerId = parentId
      this.organizeIdTree = []
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          detailAddress(this.dataForm.id).then(res => {
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
            })
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
          this.btnLoading = true
          let formMethod = this.dataForm.id ? editaddress : addPartnerAddress
          formMethod(this.dataForm).then(res => {
            let msg = ""
            if (formMethod == editaddress) {
              msg = '修改成功'
            } else {
              msg = '新建成功'
            }
            this.$emit('initData', this.dataForm.cooperativePartnerId)
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

<style scoped>
::v-deep .JNPF-dialog.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 10px !important;
}
</style>
