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
            <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top" label-width="120px">
              <el-row :gutter="30" class="custom-row" style="padding: 0 10px;">
                <el-col :sm="12" :xs="24">
                  <el-form-item label="线索名称" prop="clueName">
                    <el-input v-model="dataForm.clueName" placeholder="请输入程序名称" maxlength="20" :disabled="btntype == 'look' ? true : false" />
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="线索来源" prop="source">
                    <el-select v-model="dataForm.source" placeholder="请选择线索来源" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                      <el-option v-for="(item, index) in sourceList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="dataForm.mobile" placeholder="请输入手机号" maxlength="20" :disabled="btntype == 'look' ? true : false" />
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="负责人" prop="ownerUserId">
                    <user-select v-model="dataForm.ownerUserId" placeholder="请选择负责人" clearable style="width: 100%" :disabled="btntype == 'look'" @change="hangleSelectSales">
                    </user-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="电话" prop="telephone">
                    <el-input v-model="dataForm.telephone" placeholder="请输入电话" maxlength="20" :disabled="btntype == 'look' ? true : false" />
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="dataForm.email" placeholder="请输入邮箱" maxlength="20" :disabled="btntype == 'look' ? true : false" />
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="省" prop="province">
                    <el-select v-model="dataForm.province" placeholder="请选择省" style="width: 100%;" :disabled="btntype === 'look' ? true : false" :loading="foundationloadingprovince">
                      <el-option v-for="item in provinces" size="small" :key="item.id" :label="item.fullName" :value="item.id" @click.native="()=>{dataForm.city='',dataForm.area=''}">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="市" prop="city">
                    <el-select v-model="dataForm.city" placeholder="请选择市" style="width: 100%;" @focus="focusfoundation(dataForm.province)" :loading="foundationloadingcity" :disabled="btntype === 'look' ? true : false||!dataForm.province">
                      <el-option v-for="item in cities" size="small" :key="item.id" :label="item.fullName" :value="item.id" @click.native="()=>{dataForm.area=''}">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="区" prop="area">
                    <el-select v-model="dataForm.area" placeholder="请选择区" style="width: 100%;" @focus="foundationfocusactionarea(dataForm.city)" :loading="loadingareafoundation" :disabled="btntype === 'look' ? true : false||!dataForm.city">
                      <el-option v-for="item in area" size="small" :key="item.id" :label="item.fullName" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="地址" prop="address">
                    <el-input v-model="dataForm.address" placeholder="请输入地址" :disabled="btntype === 'look' ? true : false" maxlength="300" />
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="客户行业" prop="industry">
                    <el-select v-model="dataForm.industry" placeholder="请选择客户行业" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                      <el-option v-for="(item, index) in industryList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="客户级别" prop="level">
                    <el-select v-model="dataForm.level" placeholder="请选择客户级别" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                      <el-option v-for="(item, index) in levelList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="下次联系时间" prop="nextTime">
                    <el-date-picker v-model="dataForm.nextTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" placeholder="请选择下次联系时间" :disabled="btntype == 'look' ? true : false">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btntype == 'look'" type="textarea" maxlength="200" :rows="2" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  getProvinceList,
} from '@/api/system/province'
import { addCluemanagement, updateCluemanagement, getCluemanagementDetail } from "@/api/basicData/index";
export default {
  data() {
    return {
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
      sourceList: [
        { label: '促销', value: '1' },
        { label: '搜索引擎', value: '2' },
        { label: '广告', value: '3' },
        { label: '转介绍', value: '4' },
        { label: '线上注册', value: '5' },
        { label: '线上询价', value: '6' },
        { label: '预约上门', value: '7' },
        { label: '陌拜', value: '8' },
        { label: '电话咨询', value: '9' },
        { label: '邮件咨询', value: '10' }
      ],
      levelList: [
        { label: 'A（重点客户）', value: '1' },
        { label: 'B（普通客户）', value: '2' },
        { label: 'C（非优先客户）', value: '3' }
      ],
      industryList: [
        { label: 'IT', value: '1' },
        { label: '金融业', value: '2' },
        { label: '房地产', value: '3' },
        { label: '商业服务', value: '4' },
        { label: '运输/物流', value: '5' },
        { label: '生产', value: '6' },
        { label: '政府', value: '7' },
        { label: '文化传媒', value: '8' }
      ],
      activeName: "jcInfo",
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
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
        ownerUserId: [
          { required: true, message: '请选择负责人', trigger: 'blur' },
        ],
        clueName: [
          { required: true, message: '请输入程序名称', trigger: 'blur' },
        ]
      },
    }
  },
  created() {
  },
  methods: {
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
      this.getProvinceList()
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getCluemanagementDetail(this.dataForm.id).then(res => {
            this.dataForm = res.data
            getProvinceList(res.data.province).then(res => {
              this.cities = res.data.list
            })
            getProvinceList(res.data.city).then(res => {
              this.area = res.data.list
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
          this.btnLoading = true;
          let obj = {
            ...this.dataForm
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
<style scoped>
::v-deep .el-form-item__content p {
  border: none;
}
::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
