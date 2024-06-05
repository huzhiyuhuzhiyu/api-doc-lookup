<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="!dataForm.id ? '新建' : '编辑'" />
        <div class="options">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            {{ $t('common.confirmButton') }}</el-button>
          <el-button @click="goBack()">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" v-loading="formLoading" label-width="100px"
        class="main">
        <el-form-item label="版本名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="版本名称" />
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="dataForm.version" placeholder="版本号" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="dataForm.type" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容" v-model="dataForm.remark">
          </el-input>
        </el-form-item>
        <el-form-item label="附件" prop="files">
          <DkcFz v-model="files" :accept="['.apk', '.ios']" :limit="1" />
        </el-form-item>

      </el-form>
    </div>
  </transition>
</template>

<script>
import { insertApp } from '@/api/system/knowledgeApp'
import DkcFz from './components/Upload/UploadFz'
export default {
  components: { DkcFz },
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        fileName: '',
        name: '',
        remark: '',
        type: '',
        version: ''
      },
      toUserIds: [],
      files: [],
      dataRule: {
        title: [
          { required: true, message: '公告标题不能为空', trigger: 'blur' }
        ]
      },
      options: [{
        value: 'apk',
        label: 'apk'
      }, {
        value: 'ios',
        label: 'ios'
      }],
    }
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    init(id) {
      this.dataForm.id = id || 0
      this.files = []
      this.toUserIds = []
      this.visible = true
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getNoticeInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.files = res.data.files ? JSON.parse(res.data.files) : []
            this.toUserIds = res.data.toUserIds ? res.data.toUserIds.split(',') : []
          })
        }
        this.formLoading = false
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.dataForm.fileName = this.files[0].fileId
          insertApp(this.dataForm).then(res => {
            this.$message({
              message: "更新成功",
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('refreshDataList')
                this.goBack()
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
.JNPF-preview-main {
  .content {
    >>> {
      p {
        line-height: 30px;

        img {
          display: block;
          margin-right: auto;
          margin-left: auto;
        }
      }
    }
  }

  .vab-quill-content {
    >>> {
      .el-form-item__content {
        line-height: normal;
      }
    }
  }
}

.transfer-pane__body-tab {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .el-tabs__header {
    margin-bottom: 0;
    flex-shrink: 0;

    .el-tabs__nav {
      width: 100%;

      .el-tabs__item {
        width: 25%;
        text-align: center;
        padding: 0 20px;
      }
    }
  }

  &.hasSys-tab {
    .el-tabs__header .el-tabs__nav .el-tabs__item {
      width: 25%;
    }
  }

  .el-tabs__content {
    flex: 1;

    .el-tab-pane {
      height: 100%;
      padding: 10px;
      overflow: auto;

      .JNPF-common-el-tree {
        margin: 0;
      }
    }
  }
}
</style>