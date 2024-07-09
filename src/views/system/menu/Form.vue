<template>
  <!-- <el-dialog :title="!dataForm.id ? '新建应用' : '编辑应用'" :close-on-click-modal="false"
    :close-on-press-escape="false" :visible.sync="visible" lock-scroll
    class="JNPF-dialog JNPF-dialog_center" width="600px"> -->
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main flow-form-main">
      <div class="JNPF-common-page-header">
        <el-page-header @back="$emit('close')" :content="!dataForm.id ? '新建应用'+'('+typeTitle+')' : '编辑应用'+'('+typeTitle+')'" />
        <div class="options">
          <el-button  size="mini" type="primary" @click="dataFormSubmit()" :loading="btnLoading">
            {{ $t('common.confirmButton') }}
          </el-button>
          <el-button  size="mini" @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="120px" v-loading="formLoading"
        class="menuForm">
        <el-form-item label="应用名称" prop="fullName">
          <el-input v-model="dataForm.fullName" placeholder="输入名称" />
        </el-form-item>
        <el-form-item label="应用编码" prop="enCode">
          <el-input v-model="dataForm.enCode" placeholder="输入编码" />
        </el-form-item>
        <el-form-item label="应用简称" prop="shortName">
          <el-input v-model="dataForm.shortName" placeholder="输入简称" maxlength="6" />
        </el-form-item>
        <el-form-item label="应用logo" prop="iconUrl">
          <el-upload class="avatar-uploader" :action="define.comUploadUrl + '/annex'" :show-file-list="false"
            :on-success="handleAvatarSuccess" accept="image/*">
            <img v-if="dataForm.iconUrl" :src="define.comUrl + dataForm.iconUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        
        <el-form-item label="图标" prop="icon">
          <el-row type="flex">
            <div style="flex:1;margin-right:10px">
              <el-input v-model="dataForm.icon" placeholder="请选择图标" readonly :suffix-icon="dataForm.icon">
                <el-button slot="append" @click="openIconBox">选择</el-button>
              </el-input>
            </div>
            <el-color-picker v-model="dataForm.propertyJson.iconBackgroundColor"
              :predefine="['#188ae2', '#35b8e0', '#26bf8c', '#f9c851', '#ff5b5b', '#5b69bc', '#ff8acc', '#3b3e47', '#282828']" />
          </el-row>
        </el-form-item>
        <el-form-item label="应用类型" prop="applicationType">
          <el-select v-model="dataForm.applicationType" placeholder="请选择应用类型" disabled>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type" v-if="type=='PC'">
        <el-select v-model="dataForm.type" placeholder="请选择类型" @change="changeMenuType">
          <el-option v-for="item in typeData" :key="item.enCode" :label="item.fullName"
            :value="item.enCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="(dataForm.type == 2 || dataForm.type == 7)&&type=='PC'" label="地址" prop="urlAddress"   >
        <el-input v-model="dataForm.urlAddress" placeholder="填写地址">
          <template slot="prepend"
            v-if="(type ==='PC') && dataForm.type == 2">@/views/</template>
          <el-select slot="append" v-model="dataForm.linkTarget" style="width: 90px;"
            v-if="type ==='PC' && dataForm.type == 7">
            <el-option label="_self" value="_self" />
            <el-option label="_blank" value="_blank" />
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item v-if="[5,6,8].indexOf(dataForm.type)>-1&& type=='PC'" label="关联"
        prop="propertyJson.moduleId">
        <JNPF-TreeSelect v-model="dataForm.propertyJson.moduleId" :options="tempData"
          placeholder="请选择" lastLevel @change="handleSelectModule" filterable />
      </el-form-item>
        <el-form-item label="默认选中顺序" prop="defaultSorting">
          <el-input-number :min="0" :max="999999" v-model="dataForm.defaultSorting" controls-position="right" />
        </el-form-item>
        <el-form-item label="排序" prop="sortCode">
          <el-input-number :min="0" :max="999999" v-model="dataForm.sortCode" controls-position="right" />
        </el-form-item>
        <el-form-item label="状态" prop="enabledMark">
          <el-switch v-model="dataForm.enabledMark" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="说明" prop="bodyText">
          <el-input v-model="dataForm.description" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
          {{ $t('common.confirmButton') }}</el-button>
      </span> -->
      <icon-box :visible.sync="iconBoxVisible" ref="iconBox" :current="dataForm.icon" @choiceIcon="choiceIcon" />
    </div>
  </transition>

  <!-- </el-dialog> -->
</template>

<script>

import iconBox from '@/components/JNPF-iconBox'
import { getDataReportSelector } from '@/api/onlineDev/dataReport'
import { getDataVSelector } from '@/api/onlineDev/dataV'
import { create, update, info } from "@/api/system/system";
import { getPortalSelector } from '@/api/onlineDev/portal'
export default {
  components: { iconBox },
  data() {
    return {
       typeData:[
  {
    enCode: 2,
    fullName: "页面"
  }, {
    enCode: 5,
    fullName: "报表"
  }, {
    enCode: 6,
    fullName: "大屏"
  }, {
    enCode: 8,
    fullName: "门户"
  }, {
    enCode: 7,
    fullName: "外链"
  }],
      options: [
        { value: 'Web', label: 'PC端应用' },
        { value: 'App', label: '移动端应用' },
        { value: 'Terminal', label: '工位终端应用' }
      ],
      visible: false,
      treeData: [], 
      type:"",
      featureWebData: [],
      featureAppData: [],
      dictionaryData: [],
      reportData: [],
      screenData: [],
      portalData: [],
      tempData: [],
      dataForm: {
        urlAddress: '',
        category: 'Web',
        linkTarget: '_self',
        isButtonAuthorize: 0,
        isColumnAuthorize: 0,
        isFormAuthorize: 0,
        isDataAuthorize: 0,
        enabledMark: 1,
        type:"",
        id: '',
        fullName: '',
        enCode: '',
        sortCode: 0,
        applicationType: '',
        defaultSorting: 0,
        icon: '',
        enabledMark: 1,
        description: '',
        propertyJson: {
          moduleId: '',
          iconBackgroundColor: '',
          isTree: 0
        },
        shortName: '',
        iconUrl: '',
      },
      dataRule: {
        fullName: [
          { required: true, message: '应用不能为空', trigger: 'blur' },
        ],
        shortName: [
          { required: true, message: '应用简称不能为空', trigger: 'blur' },
        ],
        iconUrl: [
          { required: true, message: '应用LOGO不能为空', trigger: 'change' },
        ],
        enCode: [
          { required: true, message: '应用编码不能为空', trigger: 'blur' },
        ],
        icon: [
          { required: true, message: '应用图标不能为空', trigger: 'click' }
        ],
        applicationType: [
          { required: true, message: '应用类型不能为空', trigger: 'blur' },
        ],
        defaultSorting: [
          { required: true, message: '默认选中顺序不能为空', trigger: 'blur' },
        ],
        'propertyJson.moduleId': [
          { required: true, message: '关联不能为空', trigger: 'blur' }
        ],
      },
      formLoading: false,
      iconBoxVisible: false,
      btnLoading: false,
      typeTitle:"",
    }
  },
  methods: {
    switchType(val) {
      switch (val) {
     
        case 5:
          this.fetchDataReportList()
          break
        case 6:
          this.fetchDataVList()
          break
        case 8:
          this.fetchPortalList()
          break
      }
    },
    handleSelectModule(val) {
      if (this.dataForm.type == 4) {
        const item = this.treeToArray(this.dictionaryData).filter(o => o.id === val)
        this.dataForm.propertyJson.isTree = item[0].isTree
      }
    },
      // 报表列表
      fetchDataReportList() {
      if (!this.reportData.length) {
        this.$store.dispatch('base/getDictionaryData', { sort: 'ReportSort' }).then(t => {
          const ReportSortTypeList = JSON.parse(JSON.stringify(t))
          getDataReportSelector().then(res => {
            let reportData = res.data.list
            this.reportData = ReportSortTypeList
            this.$nextTick(() => {
              for (let i = 0; i < this.reportData.length; i++) {
                let child = reportData.filter(o => this.reportData[i].id === o.categoryId)
                this.$set(this.reportData[i], 'children', child)
              }
              this.reportData = this.reportData.filter(o => o.children.length)
              this.tempData = this.reportData
            })
          })
        })
        return
      }
      this.tempData = this.reportData
    },
    // 大屏列表
    fetchDataVList() {
      if (!this.screenData.length) {
        getDataVSelector().then(res => {
          this.screenData = res.data.list
          this.tempData = this.screenData
        })
        return
      }
      this.tempData = this.screenData
    },
    // 门户列表
    fetchPortalList() {
      if (!this.portalData.length) {
        getPortalSelector().then(res => {
          this.portalData = res.data.list
          this.tempData = this.portalData
        })
        return
      }
      this.tempData = this.portalData
    },
        // 切换类型
        changeMenuType(val) {
      // 重置关联下拉框的值及链接处理
      this.dataForm.propertyJson.moduleId = ''
      const menuId = this.dataForm.id
      if (menuId) this.dataForm.urlAddress = ''
      if ([2, 3, 4].includes(val)) {
        this.dataForm.isButtonAuthorize = 1
        this.dataForm.isColumnAuthorize = 1
        this.dataForm.isFormAuthorize = 1
        this.dataForm.isDataAuthorize = 1
      } else {
        this.dataForm.isButtonAuthorize = 0
        this.dataForm.isColumnAuthorize = 0
        this.dataForm.isFormAuthorize = 0
        this.dataForm.isDataAuthorize = 0
      }
      if (val == 6) {
        this.dataForm.linkTarget = '_blank'
      } else {
        this.dataForm.linkTarget = '_self'
      }
      this.switchType(this.dataForm.type)
    },
    init(id,title,type) {
      this.dataForm.id = id || ''
      this.typeTitle=title
      this.visible = true
      this.type=type
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.formLoading = true
          info(this.dataForm.id).then(res => {
            this.dataForm = res.data
            const propertyJson = res.data.propertyJson ? JSON.parse(res.data.propertyJson) : null
            this.dataForm.propertyJson = propertyJson || { iconBackgroundColor: '' }
            this.$nextTick(() => { this.formLoading = false })
          }).catch(() => { })
        } else {
          this.dataForm.propertyJson.iconBackgroundColor = ''
          this.dataForm.description = ''
          this.dataForm.applicationType=type=='PC'?'Web':type=='YDD'?'App':'Terminal'
        }
      })
    },
    openIconBox() {
      this.iconBoxVisible = true
    },
    dataFormSubmit() {
      
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const query = {
            ...this.dataForm,
            propertyJson: JSON.stringify(this.dataForm.propertyJson)
          }
          const formMethod = this.dataForm.id ? update : create
          formMethod(query).then(res => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('close',true)
              }
            })
          }).catch(() => {
            this.btnLoading = false
          })
        }

      })
    },
    choiceIcon(value) {
      this.dataForm.icon = value
    },
    handleAvatarSuccess(res) {
      if (res.code === 200 && res.data && res.data.url) {
        this.dataForm.iconUrl = res.data.url
      } else {
        this.$message.error('头像上传失败')
      }
    },
  },

}
</script>
<style lang="scss" scoped>
::v-deep .avatar-uploader {
  .el-upload {
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .el-upload:hover {
    border-color: #409eff;
  }
}
::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 130px;
  height: 130px;
  line-height: 130px;
  text-align: center;
}

.avatar {
  width: 130px;
  height: 130px;
  display: block;
}
</style>