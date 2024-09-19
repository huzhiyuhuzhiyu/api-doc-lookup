<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" content="查看调岗记录" />
        <div class="options">
          <el-button size="mini" @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div v-loading="formLoading" class="main">
        <el-tabs v-model="activeName">
          <div class="JNPF-flex-main" style="height: 100%;">
            <JNPF-table :data="contactsList" style="width: 100%;flex:1;" custom-column>
              <el-table-column prop="realName" label="姓名" min-width="200">
              </el-table-column>
              <el-table-column prop="departmentName" label="原部门" min-width="230">
              </el-table-column>
              <el-table-column prop="postName" label="原岗位" min-width="200">
              </el-table-column>
              <el-table-column prop="departmentName2" label="现部门" min-width="230">
              </el-table-column>
              <el-table-column prop="postName2" label="现岗位" min-width="200">
              </el-table-column>
              <el-table-column prop="changeDate" :formatter="jnpf.tableDateFormatDay" label="调动日期" min-width="200">
              </el-table-column>
              <el-table-column prop="changeReason" label="调动原因" min-width="200">
              </el-table-column>
              <el-table-column prop="createTime" :formatter="jnpf.tableDateFormatDayTime" label="创建时间" min-width="200">
              </el-table-column>
            </JNPF-table>
          </div>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { getrecordInfo } from "@/api/permission/user";
export default {
  data() {
    return {
      activeName: 'tgjl',
      formLoading: false,
      contactsList: []
    }
  },
  methods: {
    init(id) {
      this.formLoading = true
      if (id) {
        getrecordInfo(id).then(res => {
          this.contactsList = res.data
          this.formLoading = false
        }).catch(() => {
          this.formLoading = false
        })
      }
    },
    goBack() {
      this.$emit('close')
    },
    timestampToDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    }
  }
}
</script>
<style scoped lang="scss">
>>> .avatar-uploader {
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
.JNPF-preview-main .main {
  padding-top: 0;
  ::v-deep .el-tabs.el-tabs--top {
    height: 100%;
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
::v-deep .el-tabs__header {
  padding: 0 !important;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: 100%;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}
</style>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}
</style>