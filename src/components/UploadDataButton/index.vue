<template>
  <div class="import-button">
    <el-button :loading="loading" size="mini" :type="buttonType" icon="el-icon-upload2" @click="importForm()">{{ buttonText }}</el-button>
    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :visible="importFormVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px"
      @close="handleClose">
      <el-upload class="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" :auto-upload="false" :limit="1"
        :on-preview="handlePreview" drag :on-remove="handleRemove" :on-change="handleFileChange" ref="uploadRef"
        v-loading="loading" loadingText="正在导入数据">
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
        <el-button @click="handleClose">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="handleSubmit()" :loading="loading">
          {{ $t('common.submitButton') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UploadDataButton',
  props: {
    buttonType:{
        type: String,
        default: 'text'
    },
    buttonText: {
      type: String,
      default: '导入'
    },
    uploadApi: {
      required: true
    },
    templateDownLoadPath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      importFormVisible: false,
      file: null
    }
  },
  methods: {
    // 打开导入表单
    importForm() {
      this.importFormVisible = true
    },
    // 关闭弹窗
    handleClose() {
      this.importFormVisible = false
      this.$refs.uploadRef && this.$refs.uploadRef.clearFiles()
      this.file = null
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', this.templateDownLoadPath.indexOf('http') !== -1 ? this.templateDownLoadPath : (location.origin + this.templateDownLoadPath))
      a.click()
    },
    handleSubmit() {
      if (!this.file) return this.$message.error('请先选择上传的文件')
      this.uploadFile(this.file)
    },
    handleRemove() {
      this.file = null
    },
    handlePreview(file) {
      console.log(file)
    },
    handleFileChange(file) {
      this.file = file.raw
    },
    // 上传文件
    uploadFile(data) {
      this.loading = true
      const formData = new FormData()
      formData.append('file', data)
      this.uploadApi(formData).then(res => {
        if (!res.data || !res.data.url) {
          this.$message.success('导入成功')
          this.$emit('success', res)
          this.handleClose()
        } else {
          this.$refs.uploadRef.clearFiles()
          this.file = null
          this.handleMessage(res.data)
        }
      }).catch((err) => {
        this.$message.error(err.message)
      }).finally(() => {
        this.loading = false
      })
    },
    // 错误提示
    handleMessage(data) {
      const h = this.$createElement
      this.$message({
        type: 'error',
        duration: 0,
        showClose: true,
        customClass: 'my-message',
        message: h('div',
          {
            style: 'padding-right:20px;display:flex;align-items:center;color:#f56c6c;'
          },
          [
            h('p', { style: 'font-size:14px;' }, '导入成功，存在数据错误！'),
            h('el-button', {
              props: {
                type: 'text',
                size: 'mini',
                icon: 'el-icon-download'
              },
              on: {
                click: () => {
                  this.downloadErrorData(data)
                }
              },
              style: {
                border: 'none',
                textAlign: 'center',
                margin: '0 5px 0 5px'
              }
            }, '下载错误数据')
          ]
        )
      })
    },
    // 下载错误数据
    downloadErrorData(res) {
      this.jnpf.downloadFile(res.url, res.name)
    }
  }
}
</script>

<style lang="scss" scoped>
.import-button {
  display: inline-block;
  margin-left: 10px;
}
</style>
