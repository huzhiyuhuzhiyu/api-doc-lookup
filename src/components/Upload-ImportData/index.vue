<template>
  <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :visible="true"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px" @close="$emit('close')">
    <el-upload class="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" :auto-upload="false" :limit="1"
      :on-preview="handlePreview" drag :on-remove="handleRemove" :on-change="handleFileChange" ref="uploadRef"
      v-loading="formLoading" loadingText="正在导入数据">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text"><em>点击选取文件上传</em></div>
      <div class="el-upload__tip" slot="tip">
        只能上传.xls/.xlsx文件
        <el-button type="text" class="topButton" icon="el-icon-download" @click="downLoadTemplate"
          v-if="templateDownLoadPath">
          下载模板
        </el-button>
      </div>
    </el-upload>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" @click="handleSubmit()" :loading="formLoading">
        {{ $t('common.submitButton') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'UploadImportData',
  props: {
    uploadApi: {
      required: true
    },
    templateDownLoadPath: {},
    extraFormData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formLoading: false,
      file: null
    }
  },
  methods: {
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', this.templateDownLoadPath.indexOf('http') !== -1 ? this.templateDownLoadPath : (location.origin + this.templateDownLoadPath))
      a.click()
    },
    handleSubmit() {
      if (!this.file) return this.$message.error('请先选择上传的文件')
      this.UploadProduct(this.file)
    },
    handleRemove(file, fileList) {
      delete this.file
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleCancel() {
      this.$emit('close')
    },
    handleFileChange(file) {
      console.log(file)
      this.file = file.raw
    },

    // 上传产品
    UploadProduct(data) {
      if (!this.file) return this.$message.error('请选择上传文件')
      console.log(data)
      this.formLoading = true
      var formData = new FormData()
      formData.append('file', data)

      for (const key in this.extraFormData) {
        formData.append(key, this.extraFormData[key])
      }

      //调用上传文件接口
      this.uploadApi(formData).then(res => {
        if (!res.data || !res.data.url) {
          this.$message.success(`导入成功`)
          this.$emit('success', res)
          this.$emit('close')
        } else {
          this.$refs['uploadRef'].clearFiles()
          delete this.file
          this.handleMessage(res.data)
          this.formLoading = false
        }
      }).catch(err => {
        this.$message.error(`文件上传失败`)
        this.formLoading = false
      })
    },
    // 提示
    handleMessage(data) {
      const h = this.$createElement
      this.$message({
        type: 'error',
        duration: 0,
        showClose: true,
        customClass: 'my-message', // 自定义类名，用于设置样式
        message: h('div',
          {
            style: 'padding-right:20px;display:flex;align-items:center;color:#f56c6c;'
          },
          [
            h('p', { style: 'font-size:14px;' }, '导入成功，存在产品相关信息错误！'),
            h('el-button', {
              props: {
                type: 'text',
                size: 'mini',
                icon: 'el-icon-download'
              },
              on: {
                click: () => {
                  this.downNoProduct(data)
                }
              },
              style: {
                border: 'none',
                textAlign: 'center',
                // width:"20%",
                margin: '0 5px 0 5px '
              }
            }, '下载导入错误数据')
          ]
        )
      })
      return
    },
    // 导入产品  下载导入错误数据
    downNoProduct(res) {
      this.jnpf.downloadFile(res.url, res.name)
    }
  }
}
</script>

<style scoped lang="scss"></style>
