<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="btntype == 'edit' ? ' 编辑行程信息' : btntype == 'add' ? '新建行程信息' : '查看行程信息'" />
        <div class="options" v-if="btntype !== 'look'">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main">
        <el-tabs v-model="activeName">
          <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" label-position="top" label-width="120px">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="行程信息" name="xcInfo">
                <el-row :gutter="30" class="custom-row">
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="客户名称" prop="customerName">
                      <el-input v-model="dataForm.customerName" placeholder="请输入客户名称" :disabled="btntype == 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="负责人" prop="ownerUserName">
                      <el-input v-model="dataForm.ownerUserName" placeholder="请选择负责人" :disabled="btntype == 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="出行时间" prop="visitTime">
                      <el-input v-model="dataForm.visitTime" placeholder="请选择出行时间" :disabled="btntype == 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="出发地" prop="departure">
                      <el-input v-model="dataForm.departure" placeholder="请输入出发地" :disabled="btntype == 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="目的地" prop="destination">
                      <el-input v-model="dataForm.destination" placeholder="请输入目的地" :disabled="btntype == 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="里程数(km)" prop="mileage">
                      <el-input v-model="dataForm.mileage" placeholder="请输入里程数" :disabled="btntype == 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="出行方式" prop="travelMode">
                      <el-select v-model="dataForm.travelMode" placeholder="请选择出行方式" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                        <el-option v-for="(item, index) in travelModeList" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="btntype == 'look' && dataForm.visitPhoto">
                    <el-form-item label="定位" prop="visitGps">
                      <el-input v-model="dataForm.visitGps" placeholder="请在移动端进行定位" :disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24" v-if="btntype == 'look' && dataForm.visitPhoto">
                    <el-form-item label="现场照片" prop="visitPhoto">
                      <el-image class="information-img" fit="contain" v-for="item in dataForm.visitPhotoList" :key="item.id" :src="define.comUrl+item.url" @click="handlePictureCardPreview(item)">
                        <div slot="placeholder" class="image-slot">
                          加载中<span class="dot">...</span>
                        </div>
                      </el-image>
                      <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">
                        <img width="100%" height="100%" :src="define.comUrl+dialogImageUrl" alt="">
                      </el-dialog>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { addcrmReturnVisit, detailcrmTravelInformation, updatecrmReturnVisit } from '@/api/CRMmanagement/index'
export default {
  data() {
    return {
      travelModeList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      codeConfig: {},//单据规则配置
      activeNames: ["xcInfo"],
      activeName: "jcInfo",
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {},
      btntype: false,
    }
  },
  created() {
    this.getDictionaryType()
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 获取客户满意度、行程信息形式数据
    getDictionaryType() {
      getDictionaryType().then(res => {
        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "partnerArchives") {
            let children = item.children
            children.forEach(resp => {
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
    goBack() {
      this.$emit('close')
    },
    init(id, type) {
      this.visible = true
      this.btntype = type
      this.dataForm.id = id || ''
      this.formLoading = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          detailcrmTravelInformation(this.dataForm.id).then(res => {
            this.dataForm = res.data
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
